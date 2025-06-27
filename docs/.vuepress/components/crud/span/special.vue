<template>
  <div>
    <h3>选中数据：{{ JSON.stringify(selected) }}</h3>
    <sc-crud
      :loading.sync="loading"
      :search.sync="search"
      :selected.sync="selected"
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
        pageSize: 15,
      },
      selected: [],
      options: {
        border: true,
        init: true,
        selection: {
          banner: true,
          reserveSelection: true,
          spanProp: "city", // 开启该列合并
        },
        index: {
          label: "序号",
          spanProp: "gender",
        },
        renderColumns: [
          {
            prop: "city",
            label: "城市",
            spanProp: "city", // 开启该列合并
          },
          {
            prop: "gender",
            label: "性别",
            spanProp: "gender", // 开启该列合并
          },
          {
            prop: "age",
            label: "年龄",
          },
        ],
        showSummary: true, // 启用合计行
      },
      data: [],
      total: 0,
    };
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data } = await mockApi.getList(40)(this.search);
        this.data = data;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
