<template>
  <div>
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
        init: true,
        dynamicConfig: [
          {
            path: "firstChildren",
            prop: "id",
            label: "name",
            columnConfig: (path, source) => {
              return {
                render: () => <div>空</div>,
              };
            },
          },
          {
            path: "secondChildren",
            prop: "sort",
            label: (item) => `第${item.sort}轮报价`,
            columnConfig: (path, source) => {
              return {
                children: [
                  {
                    label: "入选",
                    prop: `${path}.choose`,
                    comp: {
                      name: "el-checkbox",
                      trueLabel: "Y",
                      falseLabel: "N",
                    },
                  },
                  {
                    label: "单价",
                    prop: `${path}.productUnitPrice`,
                    render: (h, { row }) => {
                      return (
                        <el-input
                          v-model={source[row.$index].productUnitPrice}
                        />
                      );
                    },
                  },
                  {
                    label: "跟价",
                    prop: `${path}.priceFollow`,
                    render: (h, { row }) => {
                      if (!source[row.$index].priceFollow) return;
                      const isFollow = source[row.$index].priceFollow === "Y";
                      return (
                        <span
                          style={{ color: isFollow ? "#67C23A" : "#F56C6C" }}
                        >
                          {isFollow ? "是" : "否"}
                        </span>
                      );
                    },
                  },
                  {
                    label: "降幅比例",
                    prop: `${path}.pricePercentageChange`,
                    formatter: (row) =>
                      source[row.$index].pricePercentageChange &&
                      source[row.$index].pricePercentageChange * 100 + "%",
                  },
                ],
              };
            },
          },
        ],
        renderColumns: [
          { prop: "materialCode", label: "编码" },
          { prop: "materialName", label: "名称" },
        ],
      },
      data: [],
      total: 0,
    };
  },
  methods: {
    async getList() {
      this.loading = true;
      const { data, total } = await mockApi.getDynamicData(this.search);
      this.data = data;
      this.total = total;
      this.loading = false;
    },
  },
};
</script>
