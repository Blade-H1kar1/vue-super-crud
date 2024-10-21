<template>
  <div>
    <div style="margin-bottom: 15px;">queryForm:：{{ searchForm }}</div>
    <sc-crud
      :search.sync="searchForm"
      :options="options"
      :data="data"
      @search="handleSearch"
      @reset="handleReset"
    >
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //搜索的表单对象，
      searchForm: {
        name: "defaultName", //仅第一次搜索默认值，重置后清除
      },
      options: {
        searchForm: true, //是否显示搜索表单
        searchHeader: true, // 是否显示表格搜索头
        renderColumns: [
          { prop: "name", label: "昵称", search: true },
          {
            prop: "username",
            label: "姓名",
            search: {
              reset: () => {
                console.log("重置事件");
              },
              comp: {
                name: "el-date-picker",
              },
            },
          },
          {
            prop: "gender",
            label: "性别",
          },
        ],
      },
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
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
        },
      ],
    };
  },
  methods: {
    /**
     * 搜索触发。
     * @param {Function} done - 回调函数，完成时调用
     */
    handleSearch(done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
    /**
     * 重置触发。
     * @param {Function} done - 回调函数，完成时调用
     * @param {Object} prop - 单个重置的列属性名。
     */
    handleReset(done, prop) {
      console.log(prop, "handleReset");
      setTimeout(() => {
        done();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
