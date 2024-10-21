<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      options: {
        batchRowEdit: true,
        isRowEdit: ({ row, $index }) => ($index !== 3 ? true : false),
        renderColumns: [
          {
            prop: "name",
            label: "昵称",
            isEdit: ({ row, $index }) => row.id === 56, // isEdit 函数 控制该单元格是否可编辑
            search: true,
          },
          {
            prop: "username",
            label: "姓名",
          },
          {
            prop: "gender",
            label: "性别",
            isEdit: false, // isEdit  控制该单元格是否可编辑
          },
        ],
      },
      data: [
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "单元格可编辑",
          password: "sed laboris",
          phone: "18157668675",
          gender: "该列不可编辑",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
        },
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 57,
          idNumber: "8",
          name: "不可编辑",
          password: "sed laboris",
          phone: "18157668675",
          gender: "该列不可编辑",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
        },
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 58,
          idNumber: "8",
          name: "不可编辑",
          password: "sed laboris",
          phone: "18157668675",
          gender: "该列不可编辑",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
        },
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 59,
          idNumber: "8",
          name: "整行不可编辑",
          password: "sed laboris",
          phone: "18157668675",
          gender: "整行不可编辑",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "整行不可编辑",
        },
      ],
    };
  },
  methods: {},
};
</script>
