// 步骤管理器
export class StepManager {
  constructor(options = {}) {
    this.steps = options.steps || [];
    this.currentStep = 0;
    this.stepData = {};
    this.listeners = new Map();
  }

  // 跳转到指定步骤
  goToStep(stepIndex) {
    // 检查步骤索引是否有效
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      return false;
    }

    // 检查是否可以导航到该步骤
    if (!this.canNavigateToStep(stepIndex)) {
      return false;
    }

    // 更新当前步骤
    const prevStep = this.currentStep;
    this.currentStep = stepIndex;
    this.emit("step-change", {
      from: prevStep,
      to: stepIndex,
      step: this.getCurrentStep(),
    });
    return true;
  }

  // 前进到下一步
  next() {
    let nextStep = this.currentStep + 1;

    // 跳过不可见的步骤
    while (nextStep < this.steps.length && !this.isStepVisible(nextStep)) {
      nextStep++;
    }

    if (nextStep < this.steps.length) {
      this.goToStep(nextStep);
      return true;
    }

    return false;
  }

  // 返回上一步
  prev() {
    let prevStep = this.currentStep - 1;

    // 跳过不可见的步骤
    while (prevStep >= 0 && !this.isStepVisible(prevStep)) {
      prevStep--;
    }

    if (prevStep >= 0) {
      this.goToStep(prevStep);
      return true;
    }

    return false;
  }

  // 检查是否可以导航到指定步骤
  canNavigateToStep(stepIndex, data = this.stepData) {
    // 检查步骤是否存在且可见
    if (!this.isStepVisible(stepIndex, data)) {
      return false;
    }

    // 允许向后导航
    if (stepIndex < this.currentStep) return true;

    // 不再检查stepValidation
    return true;
  }

  // 获取当前步骤信息
  getCurrentStep() {
    return this.steps[this.currentStep];
  }

  // 设置步骤数据
  setStepData(stepIndex, data) {
    // 检查步骤索引是否有效
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      return false;
    }

    // 更新步骤数据
    if (typeof data === "object") {
      this.stepData = { ...this.stepData, ...data };
    } else {
      this.stepData = data;
    }

    // 触发数据变更事件
    this.emit("data-change", { stepIndex, data: this.stepData });
    return true;
  }

  // 这里移除了setStepValidation和isAllStepsValid方法

  // 判断步骤是否可见
  isStepVisible(stepIndex, data = this.stepData) {
    const step = this.steps[stepIndex];
    if (!step) return false;

    // 如果有condition函数，则根据函数结果决定是否显示
    if (typeof step.condition === "function") {
      return step.condition(data);
    }

    return true;
  }

  // 事件系统
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }
}
