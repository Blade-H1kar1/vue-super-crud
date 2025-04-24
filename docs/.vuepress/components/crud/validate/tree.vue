<template>
  <sc-crud
    default-expand-all
    :search.sync="search"
    :options="options"
    :data="data"
    :total="total"
    @getList="getList"
  >
  </sc-crud>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          name: "部门A",
          manager: "张三",
          children: [
            {
              id: 11,
              name: "小组A-1",
              manager: "李四",
              children: [
                {
                  id: 111,
                  name: "成员A-1-1",
                  manager: "",
                },
              ],
            },
            {
              id: 12,
              name: "小组A-2",
              manager: "王五",
            },
          ],
        },
        {
          id: 2,
          name: "部门B",
          manager: "赵六",
          children: [
            {
              id: 21,
              name: "小组B-1",
              manager: "",
            },
          ],
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        editConfig: {
          mode: "row",
          trigger: "manual",
          edit: {},
        },
        renderColumns: [
          {
            prop: "name",
            label: "名称",
            isEdit: false,
          },
          {
            prop: "manager",
            label: "负责人",
            required: true,
          },
        ],
      };
    },
  },
  methods: {},
};
</script>
