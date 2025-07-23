<template>
  <div class="sc-table-select">
    <!-- 下拉模式 -->
    <template v-if="!useDialog">
      <el-select
        ref="select"
        :value="displayValue"
        :multiple="multiple"
        :placeholder="_placeholder"
        :clearable="clearable"
        :filterable="filterable"
        :filter-method="_filterMethod"
        @remove-tag="handleRemoveTag"
        @clear="handleClear"
        @visible-change="visibleChange"
        @focus="showTable = true"
        v-bind="$attrs"
        v-on="$listeners"
      >
        <template #empty>
          <sc-position
            :slot-name="'content'"
            :slots="$scopedSlots"
            :scope="tableScope"
            :inline="false"
          >
            <sc-crud
              v-if="showTable"
              ref="crud"
              init
              :search.sync="search"
              :selected.sync="internalValue"
              :loading.sync="loading"
              :showPopper.sync="showPopper"
              :data="filteredData"
              :total="total"
              :options="crudOptions"
              v-on="$listeners"
              @update:selected="handleSelectedUpdate"
            >
              <!-- 透传所有插槽 -->
              <template v-for="(_, name) in $scopedSlots" #[name]="slotData">
                <slot :name="name" v-bind="slotData" />
              </template>
            </sc-crud>
          </sc-position>
        </template>
        <template #prefix>
          <slot name="prefix" />
        </template>
      </el-select>
    </template>

    <!-- 弹窗模式 -->
    <template v-else>
      <el-select
        ref="select"
        :popper-class="b('popper')"
        :value="displayValue"
        :multiple="multiple"
        :placeholder="_placeholder"
        :clearable="clearable"
        @remove-tag="handleRemoveTag"
        @clear="handleClear"
        @click.native="openDialog"
        v-bind="$attrs"
        v-on="$listeners"
        ><template #prefix>
          <slot name="prefix" />
        </template>
      </el-select>
    </template>
  </div>
</template>

<script>
import { create } from "core";
import { debounce } from "lodash-es";

export default create({
  name: "table-select",
  props: {
    // 基础属性
    value: {
      type: [Array, Object, String, Number],
      default: null,
      // 支持以下格式：
      // 1. 对象：{ id: 1, name: '名称' }
      // 2. 对象数组：[{ id: 1, name: '名称1' }, { id: 2, name: '名称2' }]
      // 3. 基本类型：1, '1'
      // 4. 基本类型数组：[1, 2, 3], ['1', '2', '3']
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    filterMethod: {
      type: Function,
    },

    // 数据字段配置
    valueKey: {
      type: String,
      default: "id",
    },
    labelKey: {
      type: String,
      default: "",
    },
    searchKey: {
      type: String,
      default: "",
    },
    // 是否使用基本类型作为输入输出
    basicType: Boolean,

    // 表格配置
    tableOptions: {
      type: Object,
      default: () => ({}),
    },
    search: {
      type: Object,
      default: () => ({}),
    },
    data: {
      type: Array,
      default: () => [],
    },
    total: Number,
    remote: Boolean,
    columns: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: "300px",
    },
    loading: Boolean,

    // 展示模式配置
    useDialog: Boolean,
    dialogOptions: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      showTable: false,
      tableData: [],
      initialized: false,
      keyWords: "",
      showPopper: false,
      internalValue: null,
      // 标记是否是内部更新
      _isInternalUpdate: false,
      // 防抖处理的getList方法
      debouncedGetList: null,
      // 弹窗相关
      dialogVisible: false,
      // 弹窗临时数据，用于确认前存储选择的值
      tempValue: null,
    };
  },

  computed: {
    // 显示值
    displayValue() {
      if (this.multiple && this.internalValue && this.internalValue.length) {
        return this.internalValue.map((item) => {
          // 如果item中有labelKey对应的值，直接返回
          if (item[this.labelKey]) {
            return item[this.labelKey];
          }
          // 否则从data中查找对应的值
          if (this.data && this.data.length) {
            const foundItem = this.data.find(
              (dataItem) => dataItem[this.valueKey] === item[this.valueKey]
            );
            return foundItem ? foundItem[this.labelKey] : item[this.valueKey];
          }
          // 如果data中也没有找到，返回valueKey对应的值
          return item[this.valueKey];
        });
      } else {
        // 单选模式
        if (this.internalValue) {
          if (this.internalValue[this.labelKey]) {
            return this.internalValue[this.labelKey];
          }
          if (this.data && this.data.length) {
            const foundItem = this.data.find(
              (dataItem) =>
                dataItem[this.valueKey] === this.internalValue[this.valueKey]
            );
            return foundItem
              ? foundItem[this.labelKey]
              : this.internalValue[this.valueKey];
          }
          return this.internalValue[this.valueKey];
        }
        return null;
      }
    },

    _placeholder() {
      return (
        this.placeholder ||
        "请选择" +
          ((this.crudOptions.renderColumns || []).find(
            (item) => item.prop === this.labelKey
          ).label || "")
      );
    },

    filteredData() {
      if (!this.keyWords) {
        return this.data;
      }
      return this.data.filter((item) => {
        return item[this.labelKey].includes(this.keyWords);
      });
    },

    // 表格配置
    crudOptions() {
      const baseOptions = {
        ...this.tableOptions,
        toolbar: false,
        menu: false, // 禁用操作列
        border: true,
        stripe: true,
        maxHeight: this.height,
        gap: 0,
        localSearch: !this.remote,
        renderColumns: this.tableOptions.renderColumns || this.columns,
      };

      if (this.multiple) {
        // 多选模式
        baseOptions.selection = {
          reserveSelection: true,
          banner: false,
          labelKey: this.labelKey,
          ...this.tableOptions.selection,
        };
      } else {
        // 单选模式
        baseOptions.singleSelection = {
          banner: false,
          ctrlSelect: true,
          ...this.tableOptions.singleSelection,
        };
      }

      return baseOptions;
    },
    tableScope() {
      return this;
    },
  },

  watch: {
    value: {
      handler(newVal, oldVal) {
        if (
          !this._isInternalUpdate &&
          JSON.stringify(newVal) !== JSON.stringify(oldVal)
        ) {
          this.syncValues();
        }
      },
      deep: true,
      immediate: true,
    },
    showPopper(val) {
      if (val) {
        this.showDropdown = true;
      } else {
        setTimeout(() => {
          this.showDropdown = false;
        }, 16);
      }
    },
  },

  mounted() {
    // 初始化内部值
    this.syncValues();

    // 初始化防抖处理的getList方法
    this.debouncedGetList = debounce(() => {
      this.$emit("getList");
    }, 300); // 300ms的防抖延迟，可根据需要调整

    // 修改 el-select 的关闭行为
    let handle = this.$refs.select.handleClose;
    this.$refs.select.handleClose = (val) => {
      setTimeout(() => {
        if (this.showDropdown) return;
        handle();
      }, 0);
    };
  },
  methods: {
    // 处理表格选中更新
    handleSelectedUpdate(val) {
      this._isInternalUpdate = true;
      this.internalValue = val;

      // 根据配置或原始输入值的类型，输出相应格式的值
      let outputValue = val;

      if (this.multiple) {
        // 多选模式
        if (
          this.basicType === true ||
          (this.basicType === undefined &&
            Array.isArray(this.value) &&
            this.value.length > 0 &&
            typeof this.value[0] !== "object")
        ) {
          outputValue = val.map((item) => item[this.valueKey]);
        }
      } else {
        // 单选模式
        if (
          this.basicType === true ||
          (this.basicType === undefined && typeof this.value !== "object")
        ) {
          outputValue = val ? val[this.valueKey] : null;
        }
      }

      this.$emit("input", outputValue);
      this.$emit("change", outputValue, val);
      this.$nextTick(() => {
        this._isInternalUpdate = false;
      });
    },

    _filterMethod(query) {
      if (this.remote) {
        if (this.remoteMethod) {
          this.remoteMethod(query);
        } else {
          this.search[this.searchKey || this.labelKey] = query;
        }
        // 使用防抖处理的getList方法
        this.debouncedGetList();
      } else if (this.filterMethod) {
        this.filterMethod(query);
      } else {
        this.keyWords = query;
      }
    },
    // 移除标签
    handleRemoveTag(removedValue) {
      if (this.multiple) {
        const selected = this.internalValue || [];
        const index = selected.findIndex(
          (item) => item[this.labelKey || this.valueKey] === removedValue
        );
        if (index > -1) {
          this._isInternalUpdate = true;
          this.internalValue.splice(index, 1);

          // 根据配置或原始输入值的类型，输出相应格式的值
          let outputValue = [...this.internalValue];

          // 如果明确设置了使用基本类型，或者原始值是基本类型数组
          if (
            this.basicType === true ||
            (this.basicType === undefined &&
              Array.isArray(this.value) &&
              this.value.length > 0 &&
              typeof this.value[0] !== "object")
          ) {
            outputValue = outputValue.map((item) => item[this.valueKey]);
          }

          this.$emit("input", outputValue);
          this.$refs.crud.removeSelection(selected[index]);
          this.$nextTick(() => {
            this._isInternalUpdate = false;
          });
        }
      }
    },

    // 清空选择
    handleClear() {
      this._isInternalUpdate = true;
      if (this.multiple) {
        this.internalValue = [];
        // 多选模式下始终输出空数组
        this.$emit("input", []);
        this.$refs.crud.clearSelection();
      } else {
        this.internalValue = null;
        // 单选模式下，根据配置或原始值类型决定输出 null 还是对应的空值
        let outputValue = null;
        // 如果明确设置了使用基本类型，或者原始值是基本类型
        if (
          this.basicType === true ||
          (this.basicType === undefined &&
            this.value !== null &&
            this.value !== undefined &&
            typeof this.value !== "object")
        ) {
          if (typeof this.value === "string") {
            outputValue = "";
          } else if (typeof this.value === "number") {
            outputValue = 0;
          }
        }
        this.$emit("input", outputValue);
        this.$refs.crud.removeSingleSelection();
      }
      this.$nextTick(() => {
        this._isInternalUpdate = false;
      });
    },

    /**
     * 同步内部值和外部值 - 处理不同类型的输入值并转换为组件内部统一格式
     *
     * 支持以下输入格式：
     * 1. 对象：{ id: 1, name: '名称' } - 直接使用
     * 2. 对象数组：[{ id: 1, name: '名称1' }, { id: 2, name: '名称2' }] - 直接使用
     * 3. 基本类型：1, '1' - 转换为 { [valueKey]: 值 }
     * 4. 基本类型数组：[1, 2, 3], ['1', '2', '3'] - 转换为 [{ [valueKey]: 值1 }, { [valueKey]: 值2 }]
     *
     * 输出时会根据 basicType 配置或保持与输入相同的格式，确保组件使用的一致性
     */
    syncValues() {
      if (this._isInternalUpdate) return;

      if (this.multiple) {
        // 处理多选模式
        if (!this.value) {
          // 空值处理
          this.internalValue = [];
        } else if (Array.isArray(this.value)) {
          // 数组类型处理
          if (this.value.length > 0) {
            // 如果明确设置了不使用基本类型，或者原始值是对象数组且未设置 basicType
            if (
              this.basicType === false ||
              (this.basicType === undefined &&
                typeof this.value[0] === "object")
            ) {
              // 对象数组，直接使用
              this.internalValue = [...this.value];
            } else {
              // 基本类型数组（如 ID 数组），转换为对象数组
              this.internalValue = this.value.map((val) => {
                const obj = {};
                obj[this.valueKey] = val;
                return obj;
              });
            }
          } else {
            this.internalValue = [];
          }
        } else {
          // 非数组转为单元素数组
          const obj = {};
          obj[this.valueKey] = this.value;
          this.internalValue = [obj];
        }
      } else {
        // 处理单选模式
        if (!this.value) {
          // 空值处理
          this.internalValue = null;
        } else if (
          // 如果明确设置了不使用基本类型，或者原始值是对象且未设置 basicType
          this.basicType === false ||
          (this.basicType === undefined && typeof this.value === "object")
        ) {
          // 对象类型，直接使用
          this.internalValue = { ...this.value };
        } else {
          // 基本类型（如 ID），转换为对象
          const obj = {};
          obj[this.valueKey] = this.value;
          this.internalValue = obj;
        }
      }
    },
    visibleChange(val) {
      if (!val) {
        this.keyWords = "";
      }
    },
    // 触发select隐藏
    blur() {
      this.$refs.select.blur();
    },
    // 触发select显示
    focus() {
      this.$refs.select.focus();
    },
    // 打开弹窗
    openDialog() {
      // 保存当前值作为临时值
      this.tempValue = this.multiple
        ? [...(this.internalValue || [])]
        : this.internalValue;

      this.$scDialog({
        ...this.dialogOptions,
        title: this.dialogOptions.title || this._placeholder,
        cancel: (cb) => {
          // 恢复到打开前的值
          this.internalValue = this.tempValue;
          this.tempValue = null;
          cb();
        },
        render: () => {
          const scopedSlots = {};
          Object.keys(this.$scopedSlots).forEach((name) => {
            scopedSlots[name] = (props) => this.$scopedSlots[name](props);
          });

          // 创建表格内容的方位组件
          const tableContent = (
            <sc-position
              slot-name="content"
              slots={this.$scopedSlots}
              scope={this.tableScope}
              inline={false}
            >
              <sc-crud
                ref="crud"
                init={true}
                search_sync={this.search}
                selected_sync={this.internalValue}
                loading_sync={this.loading}
                on={{
                  "update:selected": this.handleSelectedUpdate,
                  ...this.$listeners,
                }}
                data={this.filteredData}
                total={this.total}
                options={this.crudOptions}
                scopedSlots={scopedSlots}
              />
            </sc-position>
          );

          return tableContent;
        },
      }).show();
    },
  },
});
</script>
