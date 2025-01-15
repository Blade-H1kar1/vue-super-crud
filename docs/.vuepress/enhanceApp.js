// enhanceApp.js
import VueHighlightJS from "vue-highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// import Package from "../../lib/sc-crud";
// import "../../lib/index.css";
import Package from "../../src/index";
import Contextmenu from "vue-contextmenujs";
import "../../styles/index.scss";

export default ({ Vue }) => {
  Vue.use(VueHighlightJS);
  Vue.use(ElementUI);
  Vue.use(Package, {
    size: "small",
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
};
