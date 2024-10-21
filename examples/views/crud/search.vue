<template>
  <div>
    <div>{{ queryForm }}</div>
    <sc-crud
      :search.sync="queryForm"
      :options="options"
      :data="data"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template slot="date2-search-label">
        <div>slot-label</div>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  /**
   * 0.search.sync 搜索的表单对象
   * 1.searchForm 控制初始化搜索框的显示
   * 2.searchHeader 控制表格头搜索框的显示
   * 3.searchForm 自定义搜索框的配置 其余配置同Form表单
   * 4.search 搜索前方法 reset重置前方法， 调用done继续执行，传递参数会覆盖原来的queryForm
   * 5.queryForm 设置默认搜索条件
   * 6. search 配置
   *  a. labelRender label jsx渲染
   *  b. #[prop]-search-label label插槽
   *  c. #[prop]-search 内容插槽
   *  d. render 内容jsx渲染
   *  e. label label文字
   *  f. prop search独有字段
   */
  data() {
    return {
      queryForm: {
        name: "defaultName",
      },
      data: [
        {
          id: "1",
          date: "2019-09-25",
          name: "张三",
          status: "2",
          address: "广东省广州市天河区",
        },
        {
          id: "2",
          date: "2019-09-26",
          name: "张三1",
          status: "1",
          address: "广东省广州市天广东省广州市天河区2广东省广州市天河区2河区2",
        },
        {
          id: "3",
          date: "2019-09-27",
          name: "张三2",
          status: "3",
          address: "广东省广州市天河区3",
        },
      ],
      options: {
        searchForm: {
          initShow: true, // 初始化是否展开搜索框
        },
        searchHeader: true, // 是否显示表格头搜索框
        searchForm: {
          action: {
            search: {
              //修改按钮配置
              label: "查询1",
            },
          },
        },
        renderColumns: [
          { prop: "name", label: "姓名", search: true },
          {
            prop: "date",
            label: "日期",
            search: {
              prop: "date",
              label: "搜索日期",
              name: "el-date-picker",
              format: "yyyy-MM-dd",
              valueFormat: "yyyy-MM-dd",
            },
          },
          {
            prop: "address",
            label: "地址",
            search: {
              labelRender: () => <div>地址Render</div>,
            },
          },
          { prop: "date2", label: "日期", search: true },
        ],
      },
    };
  },
  methods: {
    handleSearch(done, param) {
      setTimeout(() => {
        done({ ...param, handles: "custom" });
      }, 1000);
    },
    handleReset(done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped></style>
