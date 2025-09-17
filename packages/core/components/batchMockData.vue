<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    :before-close="handleClose"
    :class="[b(), 'sc-dialog']"
  >
    <el-form :model="form" label-width="100px" size="small">
      <!-- 数据处理 -->
      <el-form-item label="数据处理" v-if="showBatchOptions">
        <el-row :gutter="10" type="flex" align="middle">
          <el-col :span="8" v-if="instanceType === 'table'">
            <el-input-number
              v-model="form.count"
              :min="1"
              controls-position="right"
              :disabled="form.mode === 'fill'"
            ></el-input-number>
            <span class="form-tip">条数据</span>
          </el-col>
          <el-col :span="16">
            <el-radio-group v-model="form.mode" size="small">
              <el-radio-button label="append" v-if="instanceType === 'table'">
                <i class="el-icon-plus"></i> 追加数据
              </el-radio-button>
              <el-radio-button label="replace">
                <i class="el-icon-refresh"></i> 替换数据
              </el-radio-button>
              <el-radio-button label="fill">
                <i class="el-icon-edit"></i> 补充空值
              </el-radio-button>
            </el-radio-group>
            <el-tooltip placement="top">
              <div slot="content">
                <p v-if="instanceType === 'table'">
                  追加：保留现有数据并添加新数据
                </p>
                <p>替换：清空现有数据后添加新数据</p>
                <p>补充：仅填充现有数据中的空值字段</p>
              </div>
              <i class="el-icon-question help-icon"></i>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 在字段配置标题部分添加添加字段按钮和重置按钮 -->
      <el-divider content-position="center">
        字段配置
        <div style="display: inline-block; margin-left: 10px">
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="showAddFieldDialog"
          >
            添加字段
          </el-button>
          <el-button
            type="text"
            icon="el-icon-refresh-right"
            size="mini"
            @click="resetFields"
          >
            重置字段
          </el-button>
        </div>
      </el-divider>

      <!-- 字段列表 -->
      <div class="fields-container">
        <el-form-item
          v-for="(field, index) in fields"
          :key="field.prop"
          :label="field.label || field.prop"
          class="field-item"
        >
          <el-row :gutter="10">
            <el-col :span="15">
              <el-select
                v-model="field.genType"
                placeholder="选择生成方式"
                class="gen-type-select"
                @change="() => refreshPreview(field)"
              >
                <el-option label="默认" value="auto"></el-option>
                <el-option label="手动输入" value="manual"></el-option>
                <el-option label="预设规则" value="preset"></el-option>
              </el-select>

              <!-- 手动输入 -->
              <template v-if="field.genType === 'manual'">
                <el-select
                  v-model="field.manualConfig.type"
                  class="mb-8 mt-8 full-width"
                  placeholder="选择数据类型"
                  @change="() => handleManualTypeChange(field)"
                >
                  <el-option label="文本" value="text"></el-option>
                  <el-option label="布尔值" value="boolean"></el-option>
                  <el-option label="数组" value="array"></el-option>
                  <el-option label="对象" value="object"></el-option>
                </el-select>

                <!-- 文本输入 -->
                <div
                  v-if="field.manualConfig.type === 'text'"
                  class="manual-text-input"
                >
                  <el-input
                    v-model="field.manualValue"
                    :type="
                      field.manualConfig.convertToNumber ? 'number' : 'textarea'
                    "
                    placeholder="请输入文本"
                    class="mt-8"
                    @input="() => refreshPreview(field)"
                  ></el-input>
                  <el-checkbox
                    v-model="field.manualConfig.convertToNumber"
                    class="mt-8"
                    @change="() => refreshPreview(field)"
                  >
                    数字
                  </el-checkbox>
                </div>

                <!-- 布尔值选择 -->
                <el-radio-group
                  v-if="field.manualConfig.type === 'boolean'"
                  v-model="field.manualValue"
                  class="mt-8"
                  @change="() => refreshPreview(field)"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>

                <!-- 数组输入 -->
                <div v-if="field.manualConfig.type === 'array'" class="mt-8">
                  <div
                    v-for="(item, index) in field.manualConfig.items"
                    :key="index"
                    class="array-item"
                  >
                    <el-input
                      v-model="field.manualConfig.items[index]"
                      placeholder="请输入数组项"
                      class="array-input"
                    >
                      <template slot="append">
                        <el-button
                          @click="removeArrayItem(field, index)"
                          icon="el-icon-delete"
                        ></el-button>
                      </template>
                    </el-input>
                  </div>
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    @click="addArrayItem(field)"
                    class="mt-8"
                  >
                    添加数组项
                  </el-button>
                </div>

                <!-- 对象输入 -->
                <div v-if="field.manualConfig.type === 'object'" class="mt-8">
                  <div
                    v-for="(value, key) in field.manualConfig.properties"
                    :key="key"
                    class="object-item"
                  >
                    <el-input
                      v-model="field.manualConfig.properties[key].key"
                      placeholder="键名"
                      class="object-key"
                    ></el-input>
                    <el-input
                      v-model="field.manualConfig.properties[key].value"
                      placeholder="值"
                      class="object-value"
                    >
                      <template slot="append">
                        <el-button
                          @click="removeObjectProperty(field, key)"
                          icon="el-icon-delete"
                        ></el-button>
                      </template>
                    </el-input>
                  </div>
                  <el-button
                    type="text"
                    icon="el-icon-plus"
                    @click="addObjectProperty(field)"
                    class="mt-8"
                  >
                    添加属性
                  </el-button>
                </div>
              </template>

              <!-- 预设规则 -->
              <template v-if="field.genType === 'preset'">
                <el-select
                  v-model="field.ruleId"
                  placeholder="选择规则类型"
                  class="mt-8 full-width"
                  @change="() => refreshPreview(field)"
                >
                  <el-option-group
                    v-for="category in ruleCategories"
                    :key="category.value"
                    :label="category.label"
                  >
                    <el-option
                      v-for="rule in getRulesByCategory(category.value)"
                      :key="rule.id"
                      :label="rule.name"
                      :value="rule.id"
                    >
                      <i :class="[b('rule-icon'), rule.icon]"></i>
                      <span>{{ rule.name }}</span>
                      <span :class="[b('rule-desc')]">{{
                        rule.description
                      }}</span>
                    </el-option>
                  </el-option-group>
                </el-select>

                <!-- 规则配置项 -->
                <div
                  v-if="field.ruleId && getRuleConfig(field.ruleId)"
                  :class="[b('rule-config'), 'mt-8']"
                >
                  <el-form-item
                    v-for="config in getRuleConfig(field.ruleId)"
                    :key="config.field"
                    :label="config.label"
                    label-width="90px"
                    :class="[b('rule-config-item')]"
                  >
                    <el-input
                      v-if="config.type === 'input'"
                      v-model="field.ruleConfig[config.field]"
                      :placeholder="config.placeholder"
                      @input="() => refreshPreview(field)"
                    ></el-input>
                    <el-input-number
                      v-else-if="config.type === 'number'"
                      v-model="field.ruleConfig[config.field]"
                      :min="config.min"
                      :max="config.max"
                      controls-position="right"
                      @change="() => refreshPreview(field)"
                    ></el-input-number>
                    <el-select
                      v-else-if="config.type === 'select'"
                      v-model="field.ruleConfig[config.field]"
                      placeholder="请选择"
                      @change="() => refreshPreview(field)"
                    >
                      <el-option
                        v-for="opt in config.options"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                      ></el-option>
                    </el-select>
                    <el-date-picker
                      v-else-if="config.type === 'date'"
                      v-model="field.ruleConfig[config.field]"
                      type="date"
                      placeholder="选择日期"
                      value-format="yyyy-MM-dd"
                      @change="() => refreshPreview(field)"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </template>
            </el-col>

            <el-col :span="8">
              <!-- 修改预览头部，为所有字段添加删除按钮 -->
              <div class="preview-container">
                <div class="preview-header">
                  <span>预览</span>
                  <div>
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-refresh"
                      @click="refreshPreview(field)"
                    ></el-button>
                    <!-- 删除按钮，所有字段都显示 -->
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-delete"
                      class="delete-btn"
                      @click="confirmDeleteField(index, field)"
                    ></el-button>
                  </div>
                </div>
                <!-- 修改预览值显示部分 -->
                <div class="preview-value">
                  <template v-if="isPreviewLoading(field.prop)">
                    <i class="el-icon-loading"></i>
                  </template>
                  <template v-else>
                    <template v-if="getPreviewType(field.prop) === 'text'">
                      <span>{{ getPreviewValue(field) }}</span>
                    </template>
                    <template
                      v-else-if="getPreviewType(field.prop) === 'number'"
                    >
                      <span class="preview-number">{{
                        getPreviewValue(field)
                      }}</span>
                    </template>
                    <template v-else-if="getPreviewType(field.prop) === 'date'">
                      <span class="preview-date">{{
                        getPreviewValue(field)
                      }}</span>
                    </template>
                    <template
                      v-else-if="
                        getPreviewType(field.prop) === 'array' ||
                        getPreviewType(field.prop) === 'object'
                      "
                    >
                      <span
                        :class="['preview-' + getPreviewType(field.prop)]"
                        >{{ getPreviewValue(field) }}</span
                      >
                    </template>
                    <template v-else>
                      <span>{{ getPreviewValue(field) }}</span>
                    </template>
                  </template>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </div>
    </el-form>

    <!-- 添加字段对话框 -->
    <el-dialog
      title="添加自定义字段"
      :visible.sync="addFieldDialogVisible"
      width="400px"
      append-to-body
      :class="['sc-dialog']"
    >
      <el-form :model="newField" label-width="80px" size="small">
        <el-form-item label="字段名称" required>
          <el-input
            v-model="newField.prop"
            placeholder="请输入字段名称(英文)"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input
            v-model="newField.label"
            placeholder="请输入显示名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFieldDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addCustomField">确定</el-button>
      </div>
    </el-dialog>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">
        {{ getConfirmButtonText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import Mock from "mockjs";
import {
  getAllRules,
  getRulesByCategory,
  getRuleById,
  executeRule,
} from "core/mock/ruleLibrary";
import { getComponentConfig } from "core/mock/genConfig";
import { generateMockData } from "core/mock/genData";
import cache from "utils/cache.js";
import { uniqueId } from "lodash-es";
import { isEmptyData, findComponentInstance } from "utils";
import { create } from "core";

export default create({
  name: "batch-mock-dialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 实例类型：table 或 form
    instanceType: {
      type: String,
      default: "table",
      validator: (value) => ["table", "form"].includes(value),
    },
    // 实例引用
    instanceRef: {
      type: Object,
      default: null,
    },
    // 表单初始值
    formInitialValue: {
      type: Object,
      default: () => ({}),
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 表格数据
    data: {
      type: Array,
      default: () => [],
    },
    // 主键字段
    valueKey: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      // 现有数据
      form: {
        count: 10,
        mode: this.instanceType === "table" ? "append" : "fill",
      },
      fields: [],
      // 新增数据
      addFieldDialogVisible: false,
      newField: {
        prop: "",
        label: "",
      },
      customFields: [], // 存储自定义添加的字段
      // 其他现有数据
      ruleCategories: [
        { label: "基础类型", value: "basic" },
        { label: "文本类型", value: "text" },
        { label: "数字类型", value: "number" },
        { label: "日期时间", value: "date" },
        { label: "特殊格式", value: "special" },
      ],
      previewValues: {},
      componentConfigs: {},
      loadingPreviews: {}, // 记录哪些字段正在加载预览
      defaultManualConfig: {
        type: "text",
        convertToNumber: false, // 新增：是否转为数字的标志
        items: [],
        properties: {},
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.initFields();
        this.loadLocalCache();
        this.$nextTick(() => {
          this.analyzeComponentConfigs();
        });
      }
    },
  },
  computed: {
    // 修改标题计算属性
    dialogTitle() {
      return this.instanceType === "form" ? "生成表单数据" : "批量生成表格数据";
    },

    // 修改确认按钮文本
    getConfirmButtonText() {
      const modeTexts = {
        append: "追加数据",
        replace: "替换数据",
        fill: "补充空值",
      };
      return modeTexts[this.form.mode] || "确定";
    },

    // 是否显示批量操作选项
    showBatchOptions() {
      // 表单模式下只显示替换和补充空值选项
      if (this.instanceType === "form") {
        this.form.mode =
          this.form.mode === "append" ? "replace" : this.form.mode;
        return true;
      }
      return true;
    },
  },
  methods: {
    // 初始化字段配置 - 简化版
    initFields() {
      const getSelectOptions = (col) => {
        if (col.comp?.options) {
          return col.comp.options;
        }
        if (typeof col.dict === "string") {
          return this.$scDict[col.dict];
        }
        return [];
      };

      // 获取已删除的原始字段列表
      const cacheKey = this.getCacheKey();
      const mockConfig = cache.local.getJSON("mockDataConfig") || {};
      const config = mockConfig[cacheKey] || {};
      const deletedOriginalFields = config.deletedOriginalFields || [];

      // 处理从columns获取的字段，排除已删除的字段
      const columnsFields = this.columns
        .filter((col) => col.prop && !col.type) // 排除特殊列如选择列、序号列等
        .filter((col) => !deletedOriginalFields.includes(col.prop)) // 排除已删除的原始字段
        .map((col) => {
          return {
            prop: col.prop,
            label: col.label,
            selectOptions: getSelectOptions(col),
            genType: "auto", // 默认使用自动分析
            manualValue: "",
            regexPattern: "",
            ruleId: "",
            ruleConfig: {},
            manualConfig: { ...this.defaultManualConfig },
            col,
            isCustom: false, // 标记为非自定义字段
          };
        });

      // 加载自定义字段
      const customFieldsFromCache = this.loadCustomFieldsFromCache();

      // 合并字段
      this.fields = [...columnsFields, ...customFieldsFromCache];

      // 初始化预览值
      this.$nextTick(() => {
        this.fields.forEach((field) => {
          this.refreshPreview(field);
        });
      });
    },
    getPattern(rules) {
      if (rules) {
        const pattern = rules.find((rule) => rule.regular);
        if (pattern) return pattern.regular;
      }
    },
    // 分析组件配置
    analyzeComponentConfigs() {
      if (!this.instanceRef) return;

      // 获取组件配置的通用方法
      const getComponentInfo = (vnode) => {
        if (!vnode) return null;

        const renderInstance = findComponentInstance(
          vnode.parent?.componentInstance,
          "render"
        );
        if (!renderInstance) return null;

        return {
          config: getComponentConfig(vnode.parent),
          pattern: this.getPattern(renderInstance.rawRules),
          setFormatValue: renderInstance.setFormatValue,
        };
      };

      // 处理单个元素的配置
      const processElement = (element) => {
        const prop = element.getAttribute("data-prop");
        if (!prop || this.componentConfigs[prop]) return;

        const vnode = element.__vue__?.$vnode;
        if (!vnode) return;

        const info = getComponentInfo(vnode);
        if (info?.config) {
          this.componentConfigs[prop] = info;
        }
      };

      // 根据实例类型获取元素
      const elements =
        this.instanceType === "form"
          ? this.instanceRef.$el.querySelectorAll("[data-prop]")
          : this.instanceRef.$el.querySelectorAll(
              ".el-table__body-wrapper td [data-prop]"
            );

      // 处理所有元素
      elements.forEach(processElement);

      // 分析完组件配置后刷新所有预览
      this.refreshAllPreviews();
    },

    // 刷新所有预览
    refreshAllPreviews() {
      this.fields.forEach((field) => {
        this.refreshPreview(field);
      });
    },

    // 获取规则
    getRulesByCategory(category) {
      return getRulesByCategory(category);
    },

    // 获取规则配置
    getRuleConfig(ruleId) {
      const rule = getRuleById(ruleId);
      return rule && rule.configurable ? rule.configSchema : null;
    },

    // 判断预览是否正在加载
    isPreviewLoading(prop) {
      return this.loadingPreviews[prop] === true;
    },

    // 刷新预览
    refreshPreview(field) {
      // 设置加载状态
      this.$set(this.loadingPreviews, field.prop, true);

      // 使用setTimeout来模拟异步操作，让UI有时间显示加载状态
      setTimeout(() => {
        try {
          const value = this.generateFieldValue(field);
          this.$set(this.previewValues, field.prop, value);
        } catch (e) {
          console.error("预览生成错误:", e);
          this.$set(this.previewValues, field.prop, "生成错误");
        } finally {
          this.$set(this.loadingPreviews, field.prop, false);
        }
      }, 100);
    },

    // 获取预览类型
    getPreviewType(prop) {
      const value = this.previewValues[prop];

      if (value === undefined || value === null) {
        return "unknown";
      }

      if (Array.isArray(value)) {
        return "array";
      }

      if (typeof value === "number") {
        return "number";
      }

      if (typeof value === "object") {
        return "object";
      }

      // 检查是否为日期格式
      if (
        typeof value === "string" &&
        (value.match(/^\d{4}-\d{2}-\d{2}$/) ||
          value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/))
      ) {
        return "date";
      }

      return "text";
    },

    // 获取预览值
    getPreviewValue(field) {
      const value = this.previewValues[field.prop];

      if (value === undefined || value === null) {
        return "-";
      }

      // 数组和对象都使用 JSON 格式化显示
      if (Array.isArray(value) || typeof value === "object") {
        try {
          return JSON.stringify(value, null, 2)
            .split("\n")
            .map((line) => line.trim())
            .join("");
        } catch (e) {
          return String(value);
        }
      }

      return String(value);
    },

    // 生成字段值
    generateFieldValue(field) {
      const getValue = () => {
        switch (field.genType) {
          case "auto":
            return this.generateAutoValue(field);

          case "manual":
            return this.generateManualValue(field);

          case "regex":
            try {
              return field.regexPattern
                ? Mock.mock(new RegExp(field.regexPattern))
                : null;
            } catch (e) {
              return "正则表达式错误";
            }

          case "preset":
            if (!field.ruleId) return null;
            try {
              return executeRule(field.ruleId, field.ruleConfig);
            } catch (e) {
              return "规则执行错误";
            }

          default:
            return null;
        }
      };

      if (this.componentConfigs[field.prop]) {
        return this.componentConfigs[field.prop].setFormatValue(
          getValue(),
          true
        );
      }
      return getValue();
    },

    // 自动生成字段值
    generateAutoValue(field) {
      if (field.prop === this.valueKey) {
        return `mock_${uniqueId()}`;
      }
      // 1. 优先使用组件配置生成
      if (this.componentConfigs[field.prop]) {
        return generateMockData(this.componentConfigs[field.prop].config, {
          pattern: this.componentConfigs[field.prop].pattern,
        });
      }

      // 2. 如果有字典选项，随机选择一个
      if (field.selectOptions && field.selectOptions.length > 0) {
        return Mock.Random.pick(field.selectOptions.map((opt) => opt.value));
      }

      // 3. 如果有现有数据，使用数据分析器
      if (this.instanceType === "table" && this.data && this.data.length > 0) {
        // 表格模式：从现有数据中分析
        const existingValues = this.data
          .map((item) => item[field.prop])
          .filter((value) => !isEmptyData(value));

        if (existingValues.length > 0) {
          return Mock.Random.pick(existingValues);
        }
      }

      const fieldName = field.prop.toLowerCase();
      const fieldLabel = (field.label || "").toLowerCase();
      const combinedText = fieldName + fieldLabel;

      // 判断是否为数字类型
      if (this.isNumberField(combinedText)) {
        return this.generateNumberByFieldName(combinedText);
      }
      // 判断是否为日期/时间类型
      if (this.isDateField(combinedText)) {
        return this.generateDateByFieldName(combinedText);
      }

      // 默认生成文本
      return Mock.Random.cword(2, 8);
    },
    isNumberField(text) {
      const numberKeywords = [
        "数量",
        "个数",
        "份数",
        "件数",
        "条数",
        "金额",
        "价格",
        "单价",
        "总价",
        "成本",
        "费用",
        "工资",
        "薪资",
        "年龄",
        "分数",
        "得分",
        "评分",
        "积分",
        "比例",
        "编码",
        "编号",
        "排名",
        "等级",
        "星级",
        "长度",
        "宽度",
        "高度",
        "重量",
        "面积",
        "体积",
        "容量",
      ];
      return numberKeywords.some((keyword) => text.includes(keyword));
    },

    // 根据字段名生成对应的数值
    generateNumberByFieldName(text) {
      return Math.floor(Math.random() * 1000);
    },
    // 判断是否为日期类型字段
    isDateField(text) {
      const dateKeywords = [
        "日期",
        "时间",
        "年份",
        "月份",
        "date",
        "time",
        "year",
        "month",
        "day",
      ];

      return dateKeywords.some((keyword) => text.includes(keyword));
    },

    // 根据字段名生成对应的日期
    generateDateByFieldName(text) {
      // 判断是否包含时间关键词
      const needTime = /时间|time/.test(text);

      // 根据是否需要时间返回不同格式
      if (needTime) {
        return Mock.Random.datetime("yyyy-MM-dd HH:mm:ss");
      } else {
        return Mock.Random.date("yyyy-MM-dd");
      }
    },

    // 处理手动输入类型变更
    handleManualTypeChange(field) {
      // 重置手动输入的值
      field.manualValue = null;

      // 根据类型初始化配置
      switch (field.manualConfig.type) {
        case "text":
          field.manualConfig.convertToNumber = false;
          break;
        case "array":
          field.manualConfig.items = [];
          break;
        case "object":
          field.manualConfig.properties = {};
          break;
      }

      this.refreshPreview(field);
    },

    // 数组操作方法
    addArrayItem(field) {
      field.manualConfig.items.push("");
      this.$nextTick(() => this.refreshPreview(field));
    },

    removeArrayItem(field, index) {
      field.manualConfig.items.splice(index, 1);
      this.$nextTick(() => this.refreshPreview(field));
    },

    // 对象操作方法
    addObjectProperty(field) {
      const newKey = `prop${
        Object.keys(field.manualConfig.properties).length + 1
      }`;
      this.$set(field.manualConfig.properties, newKey, { key: "", value: "" });
      this.$nextTick(() => this.refreshPreview(field));
    },

    removeObjectProperty(field, key) {
      this.$delete(field.manualConfig.properties, key);
      this.$nextTick(() => this.refreshPreview(field));
    },

    // 生成手动输入的值
    generateManualValue(field) {
      const config = field.manualConfig;

      switch (config.type) {
        case "text":
          // 如果需要转换为数字且输入的是有效数字
          if (config.convertToNumber && !isNaN(field.manualValue)) {
            return Number(field.manualValue);
          }
          return field.manualValue;

        case "boolean":
          return field.manualValue;

        case "array":
          return config.items.filter((item) => item !== "");

        case "object":
          const obj = {};
          Object.values(config.properties).forEach((prop) => {
            if (prop.key && prop.value !== "") {
              obj[prop.key] = prop.value;
            }
          });
          return obj;

        default:
          return field.manualValue;
      }
    },

    // 关闭对话框
    handleClose() {
      this.$emit("update:visible", false);
      this.$emit("close");
    },

    // 确认生成 - 修改以处理自定义字段
    handleConfirm() {
      let result;

      if (this.instanceType === "form") {
        // 表单模式：根据模式生成数据
        if (this.form.mode === "fill") {
          // 补充空值模式
          result = this.fillEmptyFields(this.formInitialValue);
        } else {
          // 替换模式
          result = this.generateSingleData();
        }
      } else {
        // 表格模式：根据模式生成数据
        if (this.form.mode === "fill") {
          result = this.fillEmptyFields(this.data);
        } else {
          result = this.generateTableData();
        }
      }

      this.saveLocalCache();
      this.$emit("generate", result, this.form.mode);
      this.handleClose();
    },

    // 生成单条数据
    generateSingleData() {
      const data = {};

      // 为每个字段生成数据
      this.fields.forEach((field) => {
        data[field.prop] = this.generateFieldValue(field);
      });

      return data;
    },

    // 生成表格数据
    generateTableData() {
      const newData = [];
      const count = this.form.count;

      for (let i = 0; i < count; i++) {
        const row = {};

        // 为每个字段生成数据
        this.fields.forEach((field) => {
          row[field.prop] = this.generateFieldValue(field);
        });

        // 标记为mock数据
        row.$mock = true;
        newData.push(row);
      }

      return newData;
    },

    // 修改补充空值的方法，使其同时支持表单和表格
    fillEmptyFields(sourceData) {
      if (this.instanceType === "form") {
        // 表单模式：处理单个对象
        const filledData = { ...sourceData };
        this.fields.forEach((field) => {
          if (isEmptyData(filledData[field.prop])) {
            filledData[field.prop] = this.generateFieldValue(field);
          }
        });
        return filledData;
      } else {
        // 表格模式：处理数组
        const filledData = [...sourceData];
        filledData.forEach((row) => {
          this.fields.forEach((field) => {
            if (isEmptyData(row[field.prop])) {
              row[field.prop] = this.generateFieldValue(field);
            }
          });
        });
        return filledData;
      }
    },

    // 加载本地缓存
    loadLocalCache() {
      const cacheKey = this.getCacheKey();
      if (!cacheKey) return;

      const mockConfig = cache.local.getJSON("mockDataConfig") || {};
      const config = mockConfig[cacheKey];

      if (config) {
        this.form.count = config.count || 10;
        this.form.mode = config.mode || "append"; // 加载缓存的模式

        // 合并已保存的字段配置
        if (config.fields) {
          this.fields.forEach((field) => {
            const savedField = config.fields.find((f) => f.prop === field.prop);
            if (savedField) {
              Object.assign(field, {
                genType: savedField.genType || "auto",
                manualValue: savedField.manualValue,
                regexPattern: savedField.regexPattern,
                ruleId: savedField.ruleId,
                ruleConfig: savedField.ruleConfig || {},
                manualConfig: savedField.manualConfig || {
                  ...this.defaultManualConfig,
                }, // 加载缓存时也合并手动配置
              });
            }
          });
        }
        // 合并已删除的原始字段
        if (config.deletedOriginalFields) {
          this.fields = this.fields.filter(
            (field) => !config.deletedOriginalFields.includes(field.prop)
          );
        }
      }
    },

    // 保存本地缓存 - 修改以包含自定义字段标记
    saveLocalCache() {
      const cacheKey = this.getCacheKey();
      if (!cacheKey) return;

      let mockConfig = cache.local.getJSON("mockDataConfig") || {};

      // 找出已删除的原始字段
      const currentOriginalFieldProps = this.fields
        .filter((field) => !field.isCustom)
        .map((field) => field.prop);

      const allOriginalFieldProps = this.columns
        .filter((col) => col.prop && !col.type)
        .map((col) => col.prop);

      const deletedOriginalFields = allOriginalFieldProps.filter(
        (prop) => !currentOriginalFieldProps.includes(prop)
      );

      mockConfig[cacheKey] = {
        count: this.form.count,
        mode: this.form.mode,
        fields: this.fields.map((field) => ({
          prop: field.prop,
          genType: field.genType,
          manualValue: field.manualValue,
          regexPattern: field.regexPattern,
          ruleId: field.ruleId,
          ruleConfig: field.ruleConfig,
          manualConfig: field.manualConfig,
          isCustom: field.isCustom || false, // 保存自定义字段标记
        })),
        deletedOriginalFields, // 添加已删除的原始字段记录
      };

      cache.local.setJSON("mockDataConfig", mockConfig);

      // 同时保存自定义字段
      this.saveCustomFieldsToCache();
    },

    // 获取缓存key
    getCacheKey() {
      if (!this.$parent.$route) return "";
      const path = this.$parent.$route.path.replace(/\/?\d+$/, "");
      return `${this.instanceType}_${path}`;
    },

    // 加载自定义字段缓存 - 简化版
    loadCustomFieldsFromCache() {
      const cacheKey = this.getCustomFieldsCacheKey();
      const cachedFields = cache.local.getJSON(cacheKey) || [];

      return cachedFields.map((field) => ({
        ...field,
        manualConfig: field.manualConfig || { ...this.defaultManualConfig },
        isCustom: true,
      }));
    },

    // 保存自定义字段到缓存 - 简化版
    saveCustomFieldsToCache() {
      const cacheKey = this.getCustomFieldsCacheKey();
      const customFields = this.fields
        .filter((field) => field.isCustom)
        .map((field) => ({
          prop: field.prop,
          label: field.label,
          genType: field.genType,
          manualValue: field.manualValue,
          regexPattern: field.regexPattern,
          ruleId: field.ruleId,
          ruleConfig: field.ruleConfig,
          manualConfig: field.manualConfig,
        }));

      cache.local.setJSON(cacheKey, customFields);
    },

    // 获取自定义字段缓存key
    getCustomFieldsCacheKey() {
      const baseCacheKey = this.getCacheKey();
      return `${baseCacheKey}_custom_fields`;
    },

    quickGenerateData() {
      // 初始化字段
      this.initFields();

      // 加载缓存配置
      this.loadLocalCache();

      // 分析组件配置
      this.analyzeComponentConfigs();

      // 生成数据
      this.handleConfirm();
    },

    // 显示添加字段对话框 - 简化版
    showAddFieldDialog() {
      this.newField = {
        prop: "",
        label: "",
      };
      this.addFieldDialogVisible = true;
    },

    // 添加自定义字段 - 简化版
    addCustomField() {
      // 验证字段名
      if (!this.newField.prop) {
        this.$message.error("字段名称不能为空");
        return;
      }

      // 检查字段名是否已存在
      if (this.fields.some((field) => field.prop === this.newField.prop)) {
        this.$message.error("字段名称已存在");
        return;
      }

      // 创建新字段配置
      const newField = {
        prop: this.newField.prop,
        label: this.newField.label || this.newField.prop,
        selectOptions: [],
        genType: "auto", // 使用自动分析方式
        manualValue: "",
        regexPattern: "",
        ruleId: "",
        ruleConfig: {},
        manualConfig: { ...this.defaultManualConfig },
        isCustom: true, // 标记为自定义字段
      };

      // 添加到字段列表
      this.fields.push(newField);

      // 保存自定义字段到缓存
      this.saveCustomFieldsToCache();

      // 初始化预览
      this.refreshPreview(newField);

      // 关闭对话框
      this.addFieldDialogVisible = false;

      this.$message.success("字段添加成功");
    },

    // 确认删除字段 - 修改提示信息
    confirmDeleteField(index, field) {
      const message = field.isCustom
        ? `确定要删除自定义字段 "${field.label || field.prop}" 吗?`
        : `确定要删除原始字段 "${
            field.label || field.prop
          }" 吗?\n删除后可通过重置恢复`;

      this.$confirm(message, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteField(index);
        })
        .catch(() => {
          // 用户取消删除，不做任何操作
        });
    },

    // 删除字段 - 修改以允许删除所有类型字段
    deleteField(index) {
      const field = this.fields[index];

      // 从字段列表中移除
      this.fields.splice(index, 1);

      // 删除预览值
      this.$delete(this.previewValues, field.prop);
      this.$delete(this.loadingPreviews, field.prop);

      // 如果是自定义字段，更新自定义字段缓存
      if (field.isCustom) {
        this.saveCustomFieldsToCache();
      }

      // 保存字段配置缓存（包括删除的字段信息）
      this.saveLocalCache();

      this.$message.success("字段已删除");
    },

    // 添加重置字段功能
    resetFields() {
      this.$confirm(
        "确定要重置所有字段吗？这将恢复所有原始字段并删除所有自定义字段",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          // 清除缓存
          const cacheKey = this.getCacheKey();
          const customFieldsCacheKey = this.getCustomFieldsCacheKey();

          let mockConfig = cache.local.getJSON("mockDataConfig") || {};
          if (mockConfig[cacheKey]) {
            mockConfig[cacheKey].deletedOriginalFields = [];
            cache.local.setJSON("mockDataConfig", mockConfig);
          }

          // 清除自定义字段缓存
          cache.local.setJSON(customFieldsCacheKey, []);

          // 重新初始化字段
          this.initFields();

          this.$message.success("已重置所有字段");
        })
        .catch(() => {});
    },
  },
});
</script>
