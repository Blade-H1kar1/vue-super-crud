<template>
  <div class="dashboard-container">
    <sc-crud
      ref="crud"
      :options="options"
      @beforeOpen="beforeOpen"
      @afterOpen="afterOpen"
      @beforeDelete="beforeDelete"
      :data="data"
    >
      <!-- <template #handle-row="scope">
        <el-button :size="scope.crudOptions.size">test</el-button>
      </template>
      <template #name-search="{form}">
        <el-input v-model="form.name" placeholder="searchSlots" />
      </template> -->
      <template #name-header="col">
        <div>{{ col.label + "header" }}</div>
      </template>
    </sc-crud>
  </div>
</template>

<script>
import test from "./test";
export default {
  name: "Dashboard",
  data() {
    return {
      data: [
        {
          name: "张三dsa311",
          nameF: "张三F",
          age: 18,
          address: "北京",
          userName: "王五",
          userId: 1,
          checkList: "张三",
        },
        // {
        //   name: "李四",
        //   nameF: "李四F",
        //   age: 19,
        //   address: "上海",
        //   userName: "李四GDFGDFsadas123123",
        //   userId: 2,
        //   hasPermission: true,
        // },
        // {
        //   name: "王五",
        //   nameF: "王五F",
        //   age: 20,
        //   address: "广州",
        //   userName: "王五",
        //   userId: 3,
        // },
      ],
      dictData: [],
      isEdit: true,
      columns: [],
    };
  },
  computed: {
    options() {
      return {
        shiftSelect: true,
        index: true,
        // action: {
        //   view: {
        //     hidden: ({ row }) => row.name === "李四",
        //   },
        //   rowDelete: {},
        // },
        selection: true,
        height: "auto",
        calcHeight: 40,
        action: [
          "edit",
          {
            presetType: "view",
          },
        ],
        rowEdit: true,
        cellEdit: {},
        // rowEdit: true,
        // TODO :handleRow下的rowAdd、dialogAdd不能为true
        handleRow: {
          rowAdd: true,
          add: true,
        },
        pagination: {},
        formOptions: {
          columns: 1,
          group: {
            "1232": ["name", "checkList"],
            "3333": ["userName"],
          },
        },
        searchHeader: true,
        searchForm: true,
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
            search: {
              comp: {
                name: "el-select",
                options: this.dictData,
              },
            },
          },
          // {
          //   // isEdit: this.isEdit,
          //   label: "姓名",
          //   prop: "name",
          //   search: {},
          //   form: {
          //     presetType: "el-select",
          //     options: this.dictData,
          //     // comp: ({ row }) => {
          //     //   return {
          //     //     name: "el-select",
          //     //     clearable: true,
          //     //     on: {
          //     //       change(v, a, vm) {
          //     //         console.log(v, a, vm);
          //     //       },
          //     //     },
          //     //     children: this.dictData.map((i) => ({
          //     //       name: "el-option",
          //     //       label: i.label,
          //     //       value: i.value,
          //     //     })),
          //     //   };
          //     // },
          //     rules: {
          //       required: {},
          //       trigger: "change",
          //     },
          //     // render: (h, { row }) => <el-select></el-select>,
          //   },
          // },
          // {
          //   label: "checkList",
          //   prop: "checkList",
          //   initValue: [],
          //   form: {
          //     required: true,
          //     formatTemp: "str2array",
          //     comp: (scope) => {
          //       return {
          //         name: "el-checkbox-group",
          //         children: this.dictData.map((i) => ({
          //           name: "el-checkbox",
          //           label: i.value,
          //           children: i.label,
          //         })),
          //       };
          //     },
          //   },
          // },
          // {
          //   // isEdit: true,
          //   label: "用户",
          //   prop: "userName",
          //   search: {
          //     prop: "userId",
          //     presetType: "el-select",
          //     options: this.dictData,
          //   },
          //   form: {
          //     rules: {
          //       required: {},
          //       // integer: {},
          //     },
          //   },
          // },
          // {
          //   label: "年龄",
          //   prop: "age",
          //   form: true,
          // },
        ],
        selectOptions: [],
      };
    },
  },
  mounted() {
    setTimeout(() => {
      this.dictData = [
        {
          value: "张三",
          label: "1111",
        },
        {
          value: "李四",
          label: "2222",
        },
      ];
    }, 2000);
    // setTimeout(() => {
    //   for (let index = 0; index < 5; index++) {
    //     this.data = [...this.data, ...this.data];
    //   }
    // }, 500);
  },
  methods: {
    beforeOpen(cb, val) {
      setTimeout(() => {
        // console.log(val, "beforeOpen");
        cb();
      }, 500);
    },
    afterOpen(val) {
      // console.log(val, "afterOpen");
    },
    beforeDelete(done, scope) {
      setTimeout(() => {
        done();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
