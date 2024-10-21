<template>
  <div>
    <div>gender：{{ $scDicts.dictsData.gender }}</div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {},
      data: [
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "识间华中张认",
          password: "sed laboris",
          phone: "18157668675",
          gender: "男",
          sexValue: "1",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
          cascade: "1,1-1",
        },
      ],
      dictsData: {
        gender: [],
        gender1: [],
      },
    };
  },
  created() {
    this.$scDicts.get("gender");

    this.$scDicts.get(["gender", "gender1"]).then((res) => {
      console.log(res, "在页面中使用多个字典");
    });
  },
  computed: {
    options() {
      return {
        searchHeader: true,
        renderColumns: [
          {
            prop: "sexValue",
            label: "通用字典请求key",
            comp: {
              name: "el-select",
              options: this.$scDicts.dictsData.gender,
            },
          },
          {
            prop: "sexValue",
            label: "通用字典请求key",
            comp: {
              name: "el-select",
              options: this.$scDicts.dictsData.gender1,
            },
          },
        ],
      };
    },
  },
  methods: {},
};
</script>
