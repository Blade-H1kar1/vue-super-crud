<template>
  <sc-step-form v-model="formData" :steps="steps" @step-change="onStepChange">
    <!-- 自定义第一步的标题 -->
    <template v-slot:step-title-0>
      <div class="custom-title">
        <div><i class="el-icon-user"></i> 用户信息</div>
        <el-alert type="info" :closable="false">请填写您的基本信息</el-alert>
      </div>
    </template>

    <!-- 在第二步标题上方添加内容 -->
    <template v-slot:step-title-1-left>
      <el-tag type="success">重要信息</el-tag>
    </template>

    <!-- 在第二步表单下方添加内容 -->
    <template v-slot:step-content-1-bottom>
      <el-alert
        title="联系方式将用于接收重要通知，请确保信息准确"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
    </template>

    <!-- 自定义第三步的整个内容 -->
    <template #step-content-2>
      <div class="summary">
        <h3>信息确认</h3>
        <sc-form v-model="formData" :options="formOptions" />

        <div class="agreement-section">
          <el-checkbox
            v-model="agreement"
            @change="(val) => updateStepData({ agree: val })"
          >
            我已阅读并同意<el-link type="primary">服务协议</el-link>
          </el-checkbox>
        </div>
      </div>
    </template>
  </sc-step-form>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        basicInfo: {
          name: "",
          age: null,
        },
        contact: {
          phone: "",
          email: "",
          address: "",
        },
        confirm: {
          agree: false,
        },
      },
      agreement: false,
      currentStep: 0,
      steps: [
        {
          title: "基本信息",
          prop: "basicInfo",
          columns: [
            {
              prop: "name",
              label: "姓名",
              required: true,
            },
            {
              prop: "age",
              label: "年龄",
              comp: {
                name: "el-input-number",
                min: 18,
                max: 100,
              },
            },
          ],
        },
        {
          title: "联系方式",
          prop: "contact",
          columns: [
            {
              prop: "phone",
              label: "电话",
              required: true,
              rules: [
                { required: true, message: "请输入电话号码" },
                { regular: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码" },
              ],
            },
            {
              prop: "email",
              label: "邮箱",
              required: true,
              rules: [
                {
                  regular: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "请输入正确的邮箱地址",
                },
              ],
            },
            {
              prop: "address",
              label: "地址",
              comp: {
                rows: 3,
                placeholder: "请输入详细地址（选填）",
                type: "textarea",
              },
            },
          ],
        },
        {
          title: "确认信息",
          prop: "confirm",
          columns: [
            {
              prop: "agree",
              label: "同意协议",
              comp: {
                name: "el-checkbox",
              },
            },
          ],
        },
      ],
      formOptions: {
        detail: true,
        border: true,
        renderColumns: [
          {
            label: "姓名",
            prop: "basicInfo.name",
          },
          {
            label: "年龄",
            prop: "basicInfo.age",
          },
          {
            label: "电话",
            prop: "contact.phone",
          },
          {
            label: "邮箱",
            prop: "contact.email",
          },
          {
            label: "地址",
            prop: "contact.address",
          },
        ],
      },
    };
  },
  methods: {
    onStepChange({ from, to }) {
      this.currentStep = to;

      // 如果到了最后一步，重置协议勾选状态为当前值
      if (to === 2) {
        this.agreement = this.formData.confirm.agree || false;
      }
    },
    updateStepData(data) {
      // 更新当前步骤的数据
      if (this.currentStep === 2) {
        this.$set(this.formData.confirm, "agree", data.agree);
      }
    },
    getFormData(formData) {
      console.log(formData, "formData");

      return JSON.stringify(formData);
    },
  },
};
</script>

<style scoped>
.custom-title {
  margin-bottom: 20px;
}

.custom-title > div {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  color: #409eff;
}

.summary {
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.summary h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  color: #303133;
}

.agreement-section {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}
</style>
