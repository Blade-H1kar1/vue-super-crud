<template>
  <sc-crud :options="options" :data="data">
    <template #slot="{row}">
      <div>
        {{ row.slot + "slot" }}
      </div>
    </template>
  </sc-crud>
</template>

<script>
export default {
  /**
   * 1
   *
   * **/
  data() {
    return {
      data: [
        {
          id: "1",
          default: "默认渲染",
          formatter: "formatter",
          slot: "插槽渲染",
          comp: "组件渲染",
          render: "",
        },
      ],
      options: {
        pagination: true,
        action: [
          {
            label: "操作",
            icon: "el-icon-edit",
            onClick: () => {},
          },
        ],
        renderColumns: [
          { prop: "default", label: "默认渲染" },
          {
            prop: "formatter",
            label: "展示数据格式化",
            formatter: (row) => row.formatter + "111",
          },
          {
            prop: "slot",
            label: "插槽渲染",
          },
          {
            prop: "comp",
            label: "组件渲染",
            comp: {
              name: "el-input",
            },
          },
          {
            prop: "render",
            label: "render函数渲染",
            render: (h, { row }) => <div>render渲染</div>,
          },
        ],
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
