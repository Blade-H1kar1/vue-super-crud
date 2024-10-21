<template>
  <div>
    <sc-form :options="options" :loading.sync="loading" v-model="data">
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      options: {
        columns: 2,
        action: {
          submit: {},
          reset: {},
        },
        renderColumns: [
          {
            label: "必填项",
            prop: "required",
            required: true,
          },
          {
            label: "正则",
            prop: "regulars",
            rules: ["number"],
          },
          {
            label: "自定义",
            prop: "custom",
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value) {
                    callback();
                  } else {
                    callback(new Error("error1"));
                  }
                },
                trigger: "change",
              },
            ],
          },
        ],
      },
      data: {},
    };
  },
};
</script>
