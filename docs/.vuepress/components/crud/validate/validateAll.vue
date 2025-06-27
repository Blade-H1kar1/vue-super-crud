<template>
  <sc-crud
    ref="crud"
    :loading.sync="loading"
    :options="options"
    :data="data"
    :total="total"
    @getList="getList"
  >
  </sc-crud>
</template>

<script>
import { mockApi } from "../../mock";
export default {
  data() {
    return {
      loading: false,
      options: {
        border: true,
        init: true,
        localPagination: true,
        handleRow: {
          handles: [
            {
              label: "全量校验",
              type: "primary",
              onClick: () => {
                this.$refs.crud.validateAll();
              },
            },
          ],
        },
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
          },
          {
            prop: "gender",
            label: "性别",
          },
          {
            prop: "age",
            label: "年龄",
          },
          {
            prop: "empty",
            label: "空数据",
            isEdit: true,
            required: true,
          },
          {
            prop: "city",
            label: "城市",
          },
          {
            prop: "date",
            label: "日期",
          },
        ],
        searchForm: {
          columnWidth: "220px",
          labelWidth: "80px",
        },
      },
      data: [],
      total: 0,
    };
  },

  methods: {
    async getList() {
      this.loading = true;
      try {
        const { data, total } = await mockApi.getList(300)({
          pageNum: 1,
          pageSize: 300,
        });
        this.data = data;
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
