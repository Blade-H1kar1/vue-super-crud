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
    // 检查索引有效性
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      return false;
    }

    // 检查是否可导航
    if (!this.canNavigateToStep(stepIndex)) {
      return false;
    }

    // 更新步骤
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

    // 跳过不可见步骤
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

    // 跳过不可见步骤
    while (prevStep >= 0 && !this.isStepVisible(prevStep)) {
      prevStep--;
    }

    if (prevStep >= 0) {
      this.goToStep(prevStep);
      return true;
    }

    return false;
  }

  // 检查是否可导航到指定步骤
  canNavigateToStep(stepIndex, data = this.stepData) {
    // 检查步骤可见性
    if (!this.isStepVisible(stepIndex, data)) {
      return false;
    }

    // 允许向后导航
    if (stepIndex < this.currentStep) return true;

    return true;
  }

  // 获取当前步骤
  getCurrentStep() {
    return this.steps[this.currentStep];
  }

  // 设置步骤数据
  setStepData(stepIndex, data) {
    // 检查索引有效性
    if (stepIndex < 0 || stepIndex >= this.steps.length) {
      return false;
    }

    // 更新数据
    if (typeof data === "object") {
      this.stepData = { ...this.stepData, ...data };
    } else {
      this.stepData = data;
    }

    // 触发事件
    this.emit("data-change", { stepIndex, data: this.stepData });
    return true;
  }

  // 判断步骤是否可见
  isStepVisible(stepIndex, data = this.stepData) {
    const step = this.steps[stepIndex];
    if (!step) return false;

    // 根据条件函数判断
    if (typeof step.condition === "function") {
      return step.condition(data);
    }

    return true;
  }

  // 注册事件
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // 触发事件
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }
}
