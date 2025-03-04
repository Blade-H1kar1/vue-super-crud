export default {
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
  // 返回指定页
  successBack: (item) => {
    return {
      title: "提交成功",
      footer: {
        hidden: true,
      },
      render: (h, scope) => (
        <el-result icon="success" title="提交成功" subTitle="是否立即返回？">
          <template slot="extra">
            <el-button
              type="primary"
              style="width: 100px;"
              size="small"
              onClick={item.onClick}
            >
              返回
            </el-button>
          </template>
        </el-result>
      ),
    };
  },
  // 确认提示
  confirmTip: (item) => {
    return {
      title: item.title || "提示",
      width: "400px",
      render: (h, scope) => {
        return (
          <div style="display:flex">
            <div
              class="el-icon-warning"
              style="color:#E6A23C;font-size:24px;margin-right:15px"
            ></div>
            <div style="flex:1;padding-right:20px">
              <div style="margin-top:2px;">
                {item.label || "确定要执行此操作吗？"}
              </div>
              {item.content ? (
                typeof item.content !== "function" ? (
                  <div style="margin-top:10px;">{item.content || ""}</div>
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
  // 文本提交
  textSubmit: (item) => {
    let formRef = null;
    return {
      title: item.title || "提示",
      width: item.width || "400px",
      comp: {
        name: "sc-form",
        labelPosition: "top",
        mounted: (scope, instance) => {
          formRef = instance;
        },
        renderColumns: [
          {
            prop: "input",
            label: item.label || item.title || "原因",
            required: item.required || true,
            comp: {
              type: item.type || "textarea",
              rows: item.rows || 4,
              maxlength: item.maxlength || 200,
              showWordLimit: item.showWordLimit || true,
            },
          },
        ],
      },
      confirm: async (cb, d) => {
        await formRef.validate();
        item.submit(cb, d.value.input);
      },
    };
  },
};
