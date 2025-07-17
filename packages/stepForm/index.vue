<template>
  <div :class="b()">
    <!-- 步骤指示器 -->
    <div v-if="showStep" :class="b('indicator')">
      <div
        v-for="(step, index) in visibleSteps"
        :key="index"
        :class="
          b('indicator-item', {
            active: getVisibleStepIndex(currentStep) === index,
            completed: getVisibleStepIndex(currentStep) > index,
            disabled:
              !allowDirect || !canNavigateToStep(getActualStepIndex(index)),
          })
        "
        @click="allowDirect && handleStepClick(getActualStepIndex(index))"
      >
        <div :class="b('indicator-number')">
          <i
            v-if="getVisibleStepIndex(currentStep) > index"
            class="el-icon-check"
          ></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div :class="b('indicator-title')">{{ step.title }}</div>
      </div>
    </div>

    <!-- 表单内容区域 -->
    <div :class="b('content')">
      <transition :name="transitionName" mode="out-in">
        <div :key="currentStep" :class="b('step')">
          <!-- 步骤标题 - 使用position组件 -->
          <sc-position
            :class="b('step-title')"
            :slot-name="'step-title'"
            :slot-suffixes="[currentStep + '']"
            :slots="$scopedSlots"
            :scope="contentScope"
            :inline="false"
          >
            <!-- 默认标题内容 -->
            <template v-slot:default>
              <div v-if="currentStepConfig.title">
                <h3>{{ currentStepConfig.title }}</h3>
                <p v-if="currentStepConfig.description">
                  {{ currentStepConfig.description }}
                </p>
              </div>
            </template>
          </sc-position>

          <!-- 表单内容 -->
          <sc-position
            :slot-name="'step-content'"
            :slot-suffixes="[currentStep + '']"
            :slots="$scopedSlots"
            :scope="contentScope"
            :inline="false"
          >
            <!-- 默认内容 -->
            <sc-form
              ref="stepForm"
              v-model="currentStepData"
              :options="currentStepFormOptions"
            >
              <!-- 将当前步骤的插槽传递给sc-form，合并原有参数和步骤表单参数 -->
              <template
                v-for="(_, slotName) in formScopedSlots"
                v-slot:[slotName]="slotScope"
              >
                <slot
                  :name="`form-${currentStep}-${slotName}`"
                  v-bind="mergeSlotScope(slotScope, contentScope)"
                ></slot>
              </template>
            </sc-form>
          </sc-position>

          <!-- 用于自定义步骤插槽全量校验时使用 -->
          <div
            v-for="(step, index) in visibleSteps"
            :key="'hidden-slot' + index"
            v-show="false"
          >
            <slot :name="'step-content-' + index"></slot>
          </div>
        </div>
      </transition>
    </div>

    <!-- 底部按钮 -->
    <div v-if="showFooter" :class="b('footer')">
      <sc-position
        :slot-name="'step-footer'"
        :slot-suffixes="[currentStep + '']"
        :slots="$scopedSlots"
        :scope="footerScope"
      >
        <!-- 默认导航按钮 -->
        <template v-slot:default>
          <el-button v-if="currentStep > 0" @click="prev" :disabled="loading">
            {{ prevButtonText }}
          </el-button>

          <el-button
            v-if="currentStep < steps.length - 1"
            type="primary"
            @click="next"
            :loading="loading"
          >
            {{ nextButtonText }}
          </el-button>

          <el-button
            v-if="currentStep === steps.length - 1 && showSubmit"
            type="primary"
            @click="submit"
            :loading="loading"
          >
            {{ submitButtonText }}
          </el-button>
        </template>
      </sc-position>
    </div>
  </div>
</template>

<script>
import { create } from "core";
import { StepManager } from "./stepManager";
import validateMixin from "./mixins/validate";

export default create({
  name: "step-form",
  mixins: [validateMixin],
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    steps: {
      type: Array,
      required: true,
    },
    showStep: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showSubmit: {
      type: Boolean,
      default: true,
    },
    flattenMode: {
      type: Boolean,
      default: false,
    },
    allowDirect: {
      type: Boolean,
      default: false,
    },
    // 自定义校验函数，可以对整个步骤的数据进行校验
    // 函数签名: (stepData, stepIndex, stepConfig) => Promise<boolean|Error>
    customValidator: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      stepManager: null,
      currentStep: 0,
      loading: false,
      transitionName: "slide-left",
    };
  },

  created() {
    this.initStepManager();
  },

  computed: {
    currentStepConfig() {
      return this.steps[this.currentStep] || {};
    },

    currentStepProp() {
      return this.currentStepConfig.prop !== undefined
        ? this.currentStepConfig.prop
        : this.currentStep;
    },

    currentStepData: {
      get() {
        if (this.flattenMode) {
          return this.value;
        } else {
          return this.value[this.currentStepProp] || {};
        }
      },
      set(val) {
        if (this.flattenMode) {
          Object.keys(val).forEach((key) => {
            this.$set(this.value, key, val[key]);
          });
        } else {
          this.$set(this.value, this.currentStepProp, val);
        }
      },
    },

    currentStepFormOptions() {
      const stepConfig = this.currentStepConfig;
      return {
        ...stepConfig.formOptions,
        renderColumns: stepConfig.columns || [],
      };
    },

    prevButtonText() {
      return this.currentStepConfig.prevText || "上一步";
    },
    nextButtonText() {
      return this.currentStepConfig.nextText || "下一步";
    },
    submitButtonText() {
      return this.currentStepConfig.submitText || "提交";
    },

    // 内容区域的作用域数据
    contentScope() {
      return {
        currentStep: this.currentStep,
        stepConfig: this.currentStepConfig,
        data: this.currentStepData,
        validate: this.validate,
      };
    },

    // 导航按钮的作用域数据
    footerScope() {
      return {
        currentStep: this.currentStep,
        totalSteps: this.steps.length,
        prev: this.prev,
        next: this.next,
        submit: this.submit,
        loading: this.loading,
      };
    },

    // 获取当前步骤表单可能的插槽
    formScopedSlots() {
      // 获取sc-form组件的所有可用插槽
      const formSlots = {};

      // 遍历所有插槽
      Object.keys(this.$scopedSlots || {}).forEach((slotName) => {
        if (slotName.startsWith(`form-${this.currentStep}-`)) {
          // 提取出实际的表单插槽名称（去掉前缀）
          const actualSlotName = slotName.substring(
            `form-${this.currentStep}-`.length
          );
          if (actualSlotName) {
            formSlots[actualSlotName] = true;
          }
        }
      });

      return formSlots;
    },

    // 获取可见的步骤
    visibleSteps() {
      return this.steps.filter((step, index) => this.isStepVisible(index));
    },
  },

  watch: {
    currentStepData: {
      handler(val) {
        this.handleStepDataChange(val);
      },
      deep: true,
    },
  },

  methods: {
    // 初始化步骤管理器
    initStepManager() {
      this.stepManager = new StepManager({
        steps: this.steps,
      });

      // 监听步骤变化
      this.stepManager.on("step-change", ({ from, to }) => {
        this.transitionName = to > from ? "slide-left" : "slide-right";
        this.currentStep = to;

        this.$emit("step-change", { from, to, step: this.currentStepConfig });
      });

      // 监听数据变化
      this.stepManager.on("data-change", ({ stepIndex, data }) => {});
    },

    // 获取步骤对应的prop
    getStepProp(stepIndex) {
      const step = this.steps[stepIndex];
      return step && step.prop !== undefined ? step.prop : stepIndex;
    },

    // 处理步骤点击
    handleStepClick(stepIndex) {
      if (this.canNavigateToStep(stepIndex)) {
        this.goToStep(stepIndex);
      }
    },

    // 检查是否可以导航到指定步骤
    canNavigateToStep(stepIndex) {
      // 首先检查步骤是否可见
      if (!this.isStepVisible(stepIndex)) {
        return false;
      }

      // 使用stepManager的导航检查逻辑，传递当前表单值
      return this.stepManager.canNavigateToStep(stepIndex, this.value);
    },

    // 跳转到指定步骤
    goToStep(stepIndex) {
      // 检查是否可以导航到该步骤
      if (!this.isStepVisible(stepIndex)) {
        return false;
      }

      // 使用stepManager进行导航
      return this.stepManager.goToStep(stepIndex);
    },

    // 下一步
    async next() {
      await this.validate(this.currentStep);
      this.stepManager.next();
    },

    // 上一步
    prev() {
      return this.stepManager.prev();
    },

    // 处理步骤数据变化
    handleStepDataChange(data) {
      // 在扁平模式下，只传递当前步骤相关的字段
      if (this.flattenMode && this.currentStepConfig.fields) {
        const stepFields = this.currentStepConfig.fields;
        const stepData = {};
        stepFields.forEach((field) => {
          if (data[field] !== undefined) {
            stepData[field] = data[field];
          }
        });
        this.stepManager.setStepData(this.currentStep, stepData);
      } else {
        this.stepManager.setStepData(this.currentStep, data);
      }
    },

    // 提交表单
    async submit() {
      this.loading = true;
      try {
        // 使用validate方法进行全量校验，发现错误会自动跳转到对应步骤
        await this.validate();

        await this.$emit("submit", this.value);
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },

    // 合并插槽作用域
    mergeSlotScope(originalScope, additionalScope) {
      // 创建一个新对象，合并原始插槽作用域和额外作用域
      return { ...originalScope, ...additionalScope };
    },

    // 判断步骤是否可见
    isStepVisible(stepIndex) {
      return this.stepManager.isStepVisible(stepIndex, this.value);
    },

    // 获取可见步骤的索引
    getVisibleStepIndex(actualIndex) {
      let visibleIndex = 0;
      for (let i = 0; i < actualIndex; i++) {
        if (this.stepManager.isStepVisible(i, this.value)) {
          visibleIndex++;
        }
      }
      return visibleIndex;
    },

    // 获取可见步骤索引对应的实际步骤索引
    getActualStepIndex(visibleIndex) {
      let actualIndex = 0;
      let currentVisibleIndex = 0;

      while (
        currentVisibleIndex < visibleIndex &&
        actualIndex < this.steps.length
      ) {
        if (this.stepManager.isStepVisible(actualIndex, this.value)) {
          currentVisibleIndex++;
        }
        actualIndex++;
      }

      // 确保找到可见的步骤
      while (
        actualIndex < this.steps.length &&
        !this.stepManager.isStepVisible(actualIndex, this.value)
      ) {
        actualIndex++;
      }

      return actualIndex;
    },
  },
});
</script>
