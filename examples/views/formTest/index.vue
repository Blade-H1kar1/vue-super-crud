<template>
  <div>
    <sc-form v-model="formData" ref="form" :options="options"> </sc-form>
    <el-button type="primary" size="default" @click="openDialog(false)"
      >Dialog</el-button
    >
    <el-button type="primary" size="default" @click="openDialog(true)"
      >Drawer</el-button
    >
    <div>字典数据：{{ $sc_dicts.data["sys_notice_status"] }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkList: [],
      formData: {
        checkList1: ["张三", "李四"],
        dateStart: "2022-01-03",
        dateEnd: "2022-01-25",
      },
      dictData: [
        {
          value: "张三",
          label: "1111",
        },
        {
          value: "李四",
          label: "2222",
        },
      ],
      a: {
        value: "张三",
        label: "1111",
      },
    };
  },
  mounted() {
    this.$sc_dicts.get(["sys_status", "sys_notice_status", "listAll"]);

    setTimeout(() => {
      console.log(this.$sc_dicts.getMap("listAll"));
    }, 1000);
  },
  computed: {
    options() {
      return {
        // detail: true,
        action: {
          search: {},
          reset: {},
        },
        renderColumns: [
          {
            label: "11111",
            icon: "el-icon-user",
            collapse: false,
            children: [
              {
                label: "年龄",
                prop: "name",
                labelPosition: "top",
                comp: (scope) => {
                  return {
                    name: "el-select",
                    clearable: true,
                    on: {
                      change(v, a, vm) {
                        console.log(v, a, vm, scope);
                      },
                    },
                    children: (this.$sc_dicts.data["sys_notice_status"] || []).map(
                      (i) => ({
                        name: "el-option",
                        label: i.label,
                        value: i.value,
                      })
                    ),
                  };
                },
                rules: {
                  required: {},
                },
              },
              {
                label: "日期",
                prop: "dateStart-dateEnd",
                formatTemp: {
                  inner: (value, key, inner, outer) => {
                    return value;
                  },
                  outer: (value, key, outer, inner) => {
                    return value;
                  },
                },
                render: (h, { form }) => {
                  return (
                    <el-date-picker
                      v-model={form["dateStart-dateEnd"]}
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  );
                },
              },
            ],
          },
          {
            label: "11111",
            children: [
              {
                label: "年龄",
                prop: "checkList",
                rules: {
                  required: {},
                },
                formatTemp: "str2array",
                comp: (scope) => {
                  return {
                    name: "el-checkbox-group",
                    children: this.dictData.map((i) => ({
                      name: "el-checkbox",
                      label: i.value,
                      children: i.label,
                    })),
                  };
                },
              },
            ],
          },
        ],
      };
    },
  },
  methods: {
    openDialog(drawer) {
      const dialog = this.$dialog({
        drawer,
        presetType: "success-msg",
        // class: "1231231",
        // title: "测试",
        // width: "1000px",
        // cache: true,
        // comp: {
        //   name: "div",
        //   children: "12321312",
        // },
        // render: () => {
        //   return <div ref="test">23423432</div>;
        // },
        beforeClose: (done, val) => {
          if (val === "cancel") {
            done();
          }
        },
      });
      dialog.show().then((res) => {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
