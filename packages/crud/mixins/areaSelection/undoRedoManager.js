/**
 * 撤销管理器
 */
export class UndoRedoManager {
  constructor(options = {}) {
    // 撤销历史栈
    this.stack = [];
    // 最大历史记录数
    this.maxSize = options.maxSize || 50;
    // 是否正在记录历史
    this.isRecording = true;
    // 当前指针位置，-1表示没有历史记录
    this.currentIndex = -1;
  }

  /**
   * 记录操作历史
   * @param {string} operationType - 操作类型 ('paste', 'cut', 'fill', 'clear')
   * @param {Array} affectedCells - 受影响的单元格数据
   */
  recordHistory(operationType, affectedCells) {
    if (!this.isRecording || !affectedCells || affectedCells.length === 0) {
      return;
    }

    // 创建历史记录
    const historyRecord = {
      operationType,
      affectedCells: affectedCells.map((cell) => ({
        rowIndex: cell.rowIndex,
        columnIndex: cell.columnIndex,
        oldValue: cell.oldValue,
        newValue: cell.newValue,
      })),
    };

    // 如果当前指针不在栈顶，清除指针后面的重做历史
    if (this.currentIndex < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.currentIndex + 1);
    }

    // 添加到历史栈
    this.stack.push(historyRecord);

    // 更新指针到新记录位置
    this.currentIndex = this.stack.length - 1;

    // 限制历史记录数量
    if (this.stack.length > this.maxSize) {
      this.stack.shift();
      this.currentIndex--; // 调整指针位置
    }
  }

  /**
   * 执行撤销操作
   * @returns {Object|null} 返回撤销操作的数据，如果没有可撤销的操作则返回null
   */
  executeUndo() {
    if (this.currentIndex < 0) {
      console.warn("没有可撤销的操作");
      return {
        affectedCells: null,
        operationType: "undo",
      };
    }

    const undoRecord = this.stack[this.currentIndex];
    if (!undoRecord) return null;

    // 移动指针到上一个位置
    this.currentIndex--;

    // 暂停记录历史，避免撤销操作本身被记录
    this.isRecording = false;

    try {
      const { affectedCells } = undoRecord;

      // 返回需要处理的数据
      return {
        affectedCells,
        operationType: "undo",
      };
    } catch (error) {
      console.error("撤销操作失败:", error);
      return null;
    } finally {
      // 恢复历史记录
      this.isRecording = true;
    }
  }

  /**
   * 执行重做操作
   * @returns {Object|null} 返回重做操作的数据，如果没有可重做的操作则返回null
   */
  executeRedo() {
    if (this.currentIndex >= this.stack.length - 1) {
      console.warn("没有可重做的操作");
      return {
        affectedCells: null,
        operationType: "redo",
      };
    }

    // 移动指针到下一个位置
    this.currentIndex++;
    const redoRecord = this.stack[this.currentIndex];
    if (!redoRecord) return null;

    // 暂停记录历史，避免重做操作本身被记录
    this.isRecording = false;

    try {
      const { affectedCells } = redoRecord;

      // 返回需要处理的数据
      return {
        affectedCells,
        operationType: "redo",
      };
    } catch (error) {
      console.error("重做操作失败:", error);
      return null;
    } finally {
      // 恢复历史记录
      this.isRecording = true;
    }
  }

  /**
   * 检查是否可以撤销
   * @returns {boolean}
   */
  canUndo() {
    return this.currentIndex >= 0;
  }

  /**
   * 检查是否可以重做
   * @returns {boolean}
   */
  canRedo() {
    return this.currentIndex < this.stack.length - 1;
  }

  /**
   * 清空历史记录
   */
  clear() {
    this.stack = [];
    this.currentIndex = -1;
  }

  /**
   * 获取历史记录信息
   * @returns {Object}
   */
  getHistoryInfo() {
    return {
      stackLength: this.stack.length,
      currentIndex: this.currentIndex,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }
}
