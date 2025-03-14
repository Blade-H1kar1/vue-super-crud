<template>
  <div>
    <div style="margin-bottom: 10px;">
      搜索参数:
      <div>{{ JSON.stringify(search) }}</div>
    </div>
    <sc-crud
      :loading.sync="loading"
      :search.sync="search"
      :options="options"
      :data="data"
      :total="total"
      @getList="getList"
    >
    </sc-crud>
  </div>
</template>

<script>
import { mockApi } from "../../mock";
export default {
  data() {
    return {
      loading: false,
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      options: {
        border: true,
        init: true,
        expandSearch: true, // 初始展开搜索框
        localSearch: true, // 启用本地搜索
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
            search: true, // 启用搜索
          },
          {
            prop: "gender",
            label: "性别",
            search: {
              comp: {
                name: "el-select", // 使用下拉选择
                options: [
                  { label: "男", value: "男" },
                  { label: "女", value: "女" },
                ],
              },
            },
          },
          {
            prop: "age",
            label: "年龄",
            search: {
              filter: (cellValue, searchValue, row) => {
                console.log(cellValue, searchValue, row);
                // 返回 true 表示匹配，false 表示不匹配
                return cellValue > 30;
              },
            },
          },
          {
            prop: "is30",
            label: "大于30",
            search: {
              comp: {
                name: "el-select",
                options: [
                  { label: "是", value: "是" },
                  { label: "否", value: "否" },
                ],
              },
            },
          },
          {
            prop: "city",
            label: "城市",
            search: {
              comp: {
                name: "el-select",
                options: [
                  { label: "北京", value: "北京" },
                  { label: "上海", value: "上海" },
                  { label: "广州", value: "广州" },
                ],
              },
            },
          },
          {
            prop: "date",
            label: "日期",
            search: {
              comp: {
                name: "el-date-picker",
                type: "daterange",
                startPlaceholder: "开始日期",
                endPlaceholder: "结束日期",
                valueFormat: "yyyy-MM-dd",
              },
            },
          },
        ],
      },
      data: [],
      total: 0,
    };
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data, total } = await mockApi.getList(this.search);
        this.data = data;
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
