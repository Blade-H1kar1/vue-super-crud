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
          <!-- 步骤标题 -->
          <sc-position
            :class="b('step-title')"
            :slot-name="'step-title'"
            :slot-suffixes="[currentStep + '']"
            :slots="$scopedSlots"
            :scope="contentScope"
            :inline="false"
          >
            <!-- 默认标题 -->
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
              <!-- 传递插槽 -->
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
        <!-- 导航按钮 -->
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
    // 自定义校验函数 (callback, stepIndex)
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

    // 内容区域作用域
    contentScope() {
      return {
        currentStep: this.currentStep,
        stepConfig: this.currentStepConfig,
        data: this.currentStepData,
        validate: this.validate,
      };
    },

    // 导航按钮作用域
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

    // 当前步骤表单插槽
    formScopedSlots() {
      const formSlots = {};

      Object.keys(this.$scopedSlots || {}).forEach((slotName) => {
        if (slotName.startsWith(`form-${this.currentStep}-`)) {
          // 提取实际插槽名称
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

    // 可见步骤
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

    // 获取步骤prop
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

    // 检查是否可导航到指定步骤
    canNavigateToStep(stepIndex) {
      // 检查步骤是否可见
      if (!this.isStepVisible(stepIndex)) {
        return false;
      }

      return this.stepManager.canNavigateToStep(stepIndex, this.value);
    },

    // 跳转到指定步骤
    goToStep(stepIndex) {
      if (!this.isStepVisible(stepIndex)) {
        return false;
      }

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
      // 扁平模式下只传递当前步骤相关字段
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
        // 全量校验
        await this.validate();

        await this.$emit("submit", this.value);
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },

    // 合并插槽作用域
    mergeSlotScope(originalScope, additionalScope) {
      return { ...originalScope, ...additionalScope };
    },

    // 判断步骤是否可见
    isStepVisible(stepIndex) {
      return this.stepManager.isStepVisible(stepIndex, this.value);
    },

    // 获取可见步骤索引
    getVisibleStepIndex(actualIndex) {
      let visibleIndex = 0;
      for (let i = 0; i < actualIndex; i++) {
        if (this.stepManager.isStepVisible(i, this.value)) {
          visibleIndex++;
        }
      }
      return visibleIndex;
    },

    // 获取实际步骤索引
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

      // 确保找到可见步骤
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
