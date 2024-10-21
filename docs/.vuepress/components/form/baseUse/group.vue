<template>
  <div>
    <sc-form :options="options" :loading.sync="loading" v-model="data">
      <template #custom>
        自定义内容
      </template>
    </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      data: {},
      options: {
        group: true,
        action: {
          submit: true,
        },
        renderColumns: [
          {
            label: "slot自定义内容",
            prop: "custom",
          },
          {
            label: "render自定义内容",
            render: (h, scope) => {
              return "自定义内容";
            },
          },
          {
            label: "分组1",
            columns: 2,
            children: [
              {
                label: "子项1",
                prop: "1",
              },
              {
                label: "子项2",
                prop: "2",
              },
            ],
          },
          {
            label: "分组2",
            children: [
              {
                label: "子项1",
                prop: "3",
              },
              {
                label: "子项2",
                prop: "4",
              },
            ],
          },
        ],
      },
    };
  },
  computed: {},
};
</script>
