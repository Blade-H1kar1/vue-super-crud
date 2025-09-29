<template>
  <div>
    <sc-crud
      :loading.sync="loading"
      :search.sync="search"
      :selected.sync="selectedRows"
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
      selectedRows: {
        id: 2,
      },
      search: {
        pageNum: 1,
        pageSize: 10,
      },
      options: {
        singleSelection: {
          banner: true,
          ctrlSelect: true,
          labelKey: "name",
          selectable: (row, index) => {
            return index !== 0;
          },
        },
        init: true,
        renderColumns: [
          { prop: "name", label: "姓名" },
          { prop: "gender", label: "性别" },
          { prop: "age", label: "年龄" },
          { prop: "city", label: "城市" },
        ],
      },
      data: [],
      total: 0,
    };
  },
  computed: {
    selectedNames() {
      return this.selectedRows.map((row) => row.name).join("、");
    },
  },
  methods: {
    async getList() {
      this.loading = true;
      const { data, total } = await mockApi.getList(40)(this.search);
      this.data = data;
      this.total = total;
      this.loading = false;
    },
  },
};
</script>
