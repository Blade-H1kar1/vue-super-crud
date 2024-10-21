<template>
  <div>
    <sc-crud :options="options" :data="data"> </sc-crud>
  </div>
</template>

<script>
export default {
  /**
   *
   */
  data() {
    return {
      data: [
        {
          id: "1",
          date: "2019-09-25",
          name: "张三",
          status: "2",
          address: "广东省广州市天河区",
        },
        {
          id: "2",
          date: "2019-09-26",
          name: "张三1",
          status: "1",
          address: "广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2",
        },
        {
          id: "3",
          date: "2019-09-27",
          name: "张三2",
          status: "3",
          address: "广东省广州市天河区3",
        },
      ],
      options: {
        handleRow: {
          add: true,
          batchDelete: {
            label: "删除-自定义",
          },
          handles: [
            {
              label: "自定义",
              icon: "el-icon-edit",
              onClick: (row) => {
                console.log(row);
              },
            },
          ],
        },
        toolbar: {
          reset: false,
          handles: [
            {
              label: "自定义",
              icon: "el-icon-edit",
              onClick: () => {
                console.log("自定义");
              },
            },
          ],
        },
        renderColumns: [
          { prop: "name", label: "姓名" },
          {
            prop: "date",
            label: "日期",
          },
          {
            prop: "address",
            label: "地址",
          },
          { prop: "date2", label: "日期" },
        ],
      },
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
