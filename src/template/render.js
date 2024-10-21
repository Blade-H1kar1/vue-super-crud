export default {
  "el-select": (item) => {
    return {
      comp: {
        name: "el-select",
        clearable: true,
        children: (scope) => {
          const options = item.options || scope.dict?.options;
          const props = item.props || {
            label: "label",
            value: "value",
          };
          return options.map((i) => ({
            name: "el-option",
            label: i[props.label],
            value: i[props.value],
          }));
        },
      },
    };
  },
  "el-radio-group": (item, scope) => {
    return {
      comp: {
        name: "el-radio-group",
        children: (scope) => {
          const options = item.options || scope.dict?.options;
          const props = item.props || {
            label: "label",
            value: "value",
          };
          return options.map((i) => ({
            name: "el-radio",
            label: i[props.value],
            children: i[props.label],
          }));
        },
      },
    };
  },
  "el-checkbox-group": (item) => {
    return {
      comp: {
        name: "el-checkbox-group",
        children: (scope) => {
          const options = item.options || scope.dict?.options;
          const props = item.props || {
            label: "label",
            value: "value",
          };
          return options.map((i) => ({
            name: "el-checkbox",
            label: i[props.value],
            children: i[props.label],
          }));
        },
      },
    };
  },
  date: {
    comp: {
      name: "el-date-picker",
      type: "date",
      valueFormat: "yyyy-MM-dd",
    },
  },
  dateRange: () => ({
    comp: () => {
      return {
        name: "el-date-picker",
        type: "daterange",
        "range-separator": "-",
        "start-placeholder": "开始",
        "end-placeholder": "结束",
        valueFormat: "yyyy-MM-dd",
      };
    },
  }),
  textLink(item) {
    return {
      render: (h, { row }) => {
        return row[item.prop] ? (
          <el-button
            class="sc-default-formatter"
            type="text"
            onClick={() => {
              if (item.onClick) {
                item.onClick(row);
              }
            }}
          >
            {row[item.prop]}
          </el-button>
        ) : null;
      },
    };
  },
  successBack: (item) => {
    return {
      title: "提交成功",
      footer: {
        hidden: true,
      },
      render: (h) => (
        <el-result icon="success" title="提交成功" subTitle="是否立即返回？">
          <template slot="extra">
            <el-button
              type="primary"
              style="width: 100px;"
              size="small"
              onClick={item.backClick}
            >
              返回
            </el-button>
          </template>
        </el-result>
      ),
    };
  },
  confirmTip: (item) => {
    return {
      title: "提示",
      width: "400px",
      render: (h) => {
        return (
          <div style="display:flex">
            <div
              class="el-icon-question"
              style="color:#E6A23C;font-size:24px;margin-right:15px"
            ></div>
            <div style="flex:1;padding-right:20px">
              <div style="margin-top:5px;">
                {item.label || "此操作将永久删除该文件, 是否继续?"}
              </div>
              {item.content ? (
                typeof item.content !== "function" ? (
                  <div style="margin-top:10px;">{item.content}</div>
                ) : (
                  <div style="margin-top:10px;">{item.content(h)}</div>
                )
              ) : null}
            </div>
          </div>
        );
      },
    };
  },
};
