import { cloneDeep, uniqueId } from "lodash-es";
import Vue from "vue";
/**
 * 表格编辑状态管理
 */
class EditState {
  constructor(options = {}) {
    this.valueKey = options.valueKey || "id";
    this.editingRows = new Map(); // 存储正在编辑的行
    this.currentEditCell = null; // 当前正在编辑的单元格列属性
    this.columns = options.columns || []; // 表格列配置
    this.mode = options.mode;
    this.trigger = options.trigger;
    this.isRowEdit = options.isRowEdit;
    this.exclusive = options.exclusive || false;
    this.eventBus = new Vue();
  }

  on(event, callback) {
    this.eventBus.$on(event, callback);
  }

  off(event, callback) {
    this.eventBus.$off(event, callback);
  }
  /**
   * 在禁用依赖收集的环境下执行函数
   */
  _runWithoutDeps(fn) {
    const originalWatcher = Vue.prototype._target;
    Vue.prototype._target = null; // 临时禁用依赖收集
    try {
      return fn();
    } finally {
      Vue.prototype._target = originalWatcher; // 恢复原状态
    }
  }
  /**
   * 验证单元格是否可编辑
   * @param {Object} column 列配置
   * @param {Object} scope 行作用域
   * @returns {String|Boolean} 编辑模式或false
   */
  validateEdit(column, scope) {
    return this._runWithoutDeps(() => {
      if (!scope || !column) return false;

      const { row, $index } = scope;
      if (!row) return false;

      // 获取行的编辑信息
      const rowEditInfo = this.getRowEditInfo(row);
      const editMode = rowEditInfo.type || "edit";

      // 检查列是否禁用了该编辑模式
      if (column[editMode] === false) return false;

      // 评估列的编辑条件
      const canEdit =
        typeof column.isEdit === "function"
          ? column.isEdit({ row, $index, mode: editMode })
          : column.isEdit;

      if (canEdit === false) return false;

      // 根据编辑模式判断
      if (this.mode === "cell") {
        return this.isCellEditing(row, column.prop) ? editMode : false;
      }

      if (this.mode === "row") {
        return rowEditInfo.isEditing ? editMode : false;
      }

      // 自由编辑模式或列允许编辑
      if (this.mode === "free" || canEdit) {
        return editMode;
      }

      return false;
    });
  }
  getRowKey(row) {
    return row[this.valueKey];
  }

  /**
   * 设置行的编辑状态
   * @param {Object} row 行数据
   * @param {Boolean} isEditing 是否处于编辑状态
   * @param {String} type 编辑类型，'edit'或'add'
   * @param {String} addType 新增类型，'first'或'last'
   * @returns {Object} 更新后的行数据
   */
  setRowEditStatus(row, isEditing, type = "edit", { addType, prop } = {}) {
    const rowKey = this.getRowKey(row);
    if (!rowKey) return;
    const editInfo = this.getRowEditInfo(row);
    if (this.isRowEdit) {
      const disabled = this.isRowEdit({ row, $index: row.$index }) === false;
      if (disabled) return;
    }
    if (isEditing) {
      if (editInfo.isEditing && editInfo.type === type) return;

      // 处理互斥编辑
      if (this.exclusive && this.mode === "row" && type === "edit") {
        this.clearOtherEditingRows(rowKey);
      }

      this.editingRows.set(rowKey, {
        type,
        data: cloneDeep(row),
        row,
        addType,
      });
    } else {
      this.editingRows.delete(rowKey);
    }

    this.notifyEditStatusChange({
      mode: "row",
      rowKey: rowKey,
      row,
      prop,
      type,
    });
    this.isSetting();
  }

  clearOtherEditingRows(excludeRowKey) {
    for (const [rowKey, editInfo] of this.editingRows.entries()) {
      // 跳过新增的行和指定要排除的行
      if (editInfo.type === "add" || rowKey === excludeRowKey) continue;
      this.editingRows.delete(rowKey);
    }
  }

  // 批量编辑
  batchSetEditStatus(rows, isEditing, type = "edit") {
    if (!Array.isArray(rows)) return;

    rows.forEach((row) => {
      this.setRowEditStatus(row, isEditing, type);
    });

    this.eventBus.$emit("batch-edit-status-change", {
      rows: rows.map((row) => this.getRowKey(row)),
      isEditing,
      type,
    });
  }

  /**
   * 设置单元格的编辑状态
   * @param {Object} row 行数据
   * @param {String} prop 列属性名
   * @returns {Object} 更新后的行数据
   */
  setCellEditStatus(row, prop) {
    const rowKey = this.getRowKey(row);
    if (!rowKey) return;

    if (this.isCellEditing(row, prop)) return;

    if (this.isRowEdit) {
      const disabled = this.isRowEdit({ row, $index: row.$index }) === false;
      if (disabled) return;
    }

    // 设置当前编辑的单元格
    this.currentEditCell = {
      rowKey,
      prop,
      row,
    };

    // 通知状态更新
    this.notifyEditStatusChange({
      mode: "cell",
      rowKey,
      row,
      prop,
      type: "edit",
    });
    this.isSetting();
  }

  isSetting() {
    this._isSetting = true;
    setTimeout(() => {
      this._isSetting = false;
    }, 50);
  }
  /**
   * 检查行是否处于编辑状态
   * @param {Object} row 行数据
   * @returns {Boolean} 是否处于编辑状态
   */
  isRowEditing(row) {
    const rowKey = this.getRowKey(row);
    return rowKey && this.editingRows.has(rowKey);
  }

  /**
   * 获取行的编辑信息
   * @param {Object} row 行数据
   * @returns {Object|null} 行的编辑信息，包含 type 和原始数据
   */
  getRowEditInfo(row) {
    const rowKey = this.getRowKey(row);
    const nullObj = { isEditing: false, data: null, type: null };
    if (!rowKey) return nullObj;
    const rowEditInfo = this.editingRows.get(rowKey);
    if (!rowEditInfo) return nullObj;
    return {
      isEditing: true,
      data: rowEditInfo.data, // 原始数据
      row: rowEditInfo.row, // 当前行数据
      type: rowEditInfo.type, // 编辑类型
    };
  }

  getEditingCell() {
    return this.currentEditCell;
  }

  /**
   * 检查单元格是否处于编辑状态
   * @param {Object} row 行数据
   * @param {String} prop 列属性名
   * @returns {Boolean} 是否处于编辑状态
   */
  isCellEditing(row, prop) {
    const rowKey = this.getRowKey(row);
    return (
      rowKey &&
      this.currentEditCell &&
      this.currentEditCell.rowKey === rowKey &&
      this.currentEditCell.prop === prop
    );
  }

  /**
   * 检查是否有任何行处于编辑状态
   * @returns {Boolean} 是否有行处于编辑状态
   */
  hasEditingRows() {
    return this.editingRows.size > 0;
  }

  /**
   * 获取所有处于编辑状态的行的键
   * @returns {Array} 处于编辑状态的行的键数组
   */
  getEditingRowKeys() {
    return Array.from(this.editingRows.keys());
  }

  /**
   * 清除所有编辑状态
   */
  clearAllEditStatus() {
    if (this._isSetting) return;
    this.editingRows.clear();
    this.currentEditCell = null;
  }

  // 触发编辑状态更新事件
  notifyEditStatusChange({ mode, rowKey, row, prop, type }) {
    this.eventBus.$emit("edit-status-change", {
      mode,
      rowKey,
      row,
      prop,
      type,
      ...this.getRowEditInfo(row),
    });
  }

  // 获取所有新增类型的行数据
  getAddedRows() {
    const addedRows = [];
    this.editingRows.forEach((editInfo, rowKey) => {
      if (editInfo.type === "add") {
        addedRows.push(editInfo);
      }
    });
    return addedRows;
  }
  // 获取所有处于编辑状态的行数据
  getEditingRows() {
    return Array.from(this.editingRows.values());
  }
}

export default EditState;
