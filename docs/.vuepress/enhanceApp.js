// // enhanceApp.js
// import VueHighlightJS from "vue-highlight.js";
import "highlight.js/styles/atom-one-dark.css";
// import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// // import Package from "../../lib/sc-crud";
// // import "../../lib/index.css";
// import Package from "../../src/index";
// // import Contextmenu from "vue-contextmenujs";
import "../../styles/index.scss";

export default async ({ Vue }) => {
  if (typeof window !== "undefined") {
    // 动态导入插件
    const [
      { default: VueHighlightJS },
      { default: ElementUI },
      { default: Package },
      { default: Contextmenu },
    ] = await Promise.all([
      import("vue-highlight.js"),
      import("element-ui"),
      import("../../src/index"),
      import("vue-contextmenujs"),
    ]);

    // // 导入样式
    // await Promise.all([
    //   import("highlight.js/styles/atom-one-dark.css"),
    //   import("element-ui/lib/theme-chalk/index.css"),
    //   import("../../lib/index.css"),
    // ]);

    Vue.use(VueHighlightJS);
    Vue.use(ElementUI, {
      size: "small",
    });
    Vue.use(Package, {
      crudOptions: {
        gap: 0,
        border: true,
      },
      dict: {
        request: (key) => {
          const data = {
            cascade: [
              {
                label: "选项1",
                value: "1",
                children: [
                  {
                    label: "选项1-1",
                    value: "1-1",
                  },
                  {
                    label: "选项1-2",
                    value: "1-2",
                  },
                ],
              },
              {
                label: "选项2",
                value: "2",
              },
            ],
            gender: [
              {
                label: "男",
                value: "1",
              },
              {
                label: "女",
                value: "2",
              },
            ],
            gender1: [
              {
                label: "男",
                value: "1",
              },
              {
                label: "女",
                value: "2",
              },
            ],
          };
          return Promise.resolve({ data: data[key] });
        },
      },
      template: {
        crud: {
          uniqueId: true,
          handleRow: {
            tempGlobalButton: {
              label: "自定义temp按钮",
              icon: "el-icon-eleme",
              onClick: () => {
                console.log("自定义temp按钮");
              },
            },
          },
        },
        dicts: {
          getList: (item) => ({
            request: (params, done) => {
              const data = [
                {
                  label: "男",
                  value: "1",
                },
                {
                  label: "女",
                  value: "2",
                },
              ];
              setTimeout(() => {
                done(data);
              }, 500);
            },
          }),
        },
        render: {
          testCodeTemplate: (item) => ({
            search: {
              comp: {
                name: item.searchCompName,
                type: item.SearchCompType,
              },
            },
            form: {
              comp: {
                name: item.formCompName,
              },
            },
            formatter: (row) => row[item.prop] + "自定义格式化",
          }),
        },
      },
    });
    Vue.use(Contextmenu);
  }
};
