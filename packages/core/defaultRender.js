import tooltip from "../tooltip";
export default {
  input: (h, { item, config, self }) => {
    return h("el-input", {
      class: "sc-default-input",
      props: {
        value: self.$value,
        size: config?.size,
        clearable: true,
      },
      attrs: {
        placeholder: `请输入${item.label}`,
      },
      on: {
        input: (v) => {
          self.$value = v;
        },
      },
    });
  },
  formatter: (h, { row, column, $index, item, $value }) => {
    let value = item.formatter
      ? typeof item.formatter === "function"
        ? item.formatter(row, column, $value.get, $index)
        : item.formatter
      : $value.get;
    let vm;
    const tooltipEvents = {
      mouseenter: (e) => {
        vm = tooltip({
          content: value + "",
          placement: "top",
          target: e.target,
          overflow: true,
        });
        vm.show();
      },
      mouseleave: (e) => {
        vm && vm.hide();
      },
    };
    if (item.suffix && value) value = value + " " + item.suffix;
    if (item.html) {
      return h("div", {
        class: "sc-default-formatter",
        domProps: {
          innerHTML: value,
        },
        style: {
          display: "inline",
        },
        on: tooltipEvents,
      });
    }

    return h(
      "div",
      {
        class: "sc-default-formatter",
        on: tooltipEvents,
      },
      value
    );
  },
};
