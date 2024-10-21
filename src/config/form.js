export default () => ({
  normal: {
    size: "small",
    labelWidth: "100px",
    labelPosition: "right",

    layout: "grid", //grid, el-row
    columns: 1,
    columnWidth: "",
    shrinkLabel: true,
    scrollError: true,
    // group: {  两种写法
    //   label: ["prop1", "prop2"],
    //   label2: { icon: "xx", children: ["prop3"] },
    // },
    renderColumns: [],
  },
  showConfig: {
    action: {
      align: "center",
    },
  },
});
