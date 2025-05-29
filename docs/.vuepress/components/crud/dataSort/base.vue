<template>
  <div>
    <sc-crud title="原始数据" :options="rawOptions" :data="rawData" />

    <sc-crud title="排序后数据" :options="options" :data="tableData" />
  </div>
</template>

<script>
export default {
  data() {
    const columns = [
      {
        prop: "province",
        label: "省份",
        render: (h, { row }) => {
          // 使用不同颜色区分不同省份
          const colors = {
            浙江: "#409EFF", // 蓝色
            江苏: "#67C23A", // 绿色
          };
          return (
            <span
              style={{
                color: colors[row.province] || "#909399",
                fontWeight: "bold",
              }}
            >
              {row.province}
            </span>
          );
        },
      },
      {
        prop: "city",
        label: "城市",
      },
      { prop: "amount", label: "交易金额" },
      { prop: "company", label: "公司名称" },
    ];
    return {
      rawOptions: {
        renderColumns: columns,
      },
      options: {
        // 按省份、城市、交易金额的顺序进行多层级排序
        sortProps: [
          "province",
          "city",
          {
            prop: "amount",
            sortMethod: (a, b) => {
              return b.amount - a.amount;
            },
          },
        ],
        renderColumns: columns,
      },
      tableData: [],
      rawData: [
        {
          province: "浙江",
          city: "宁波",
          company: "宁波中百",
          amount: 3000,
        },
        {
          province: "江苏",
          city: "南京",
          company: "南京银行",
          amount: 9000,
        },
        {
          province: "江苏",
          city: "南京",
          company: "南京银行",
          amount: 4000,
        },
        {
          province: "江苏",
          city: "南京",
          company: "南京银行",
          amount: 3000,
        },
        {
          province: "浙江",
          city: "杭州",
          company: "网易",
          amount: 8000,
        },
        {
          province: "江苏",
          city: "苏州",
          company: "苏州工业园",
          amount: 4000,
        },
        {
          province: "浙江",
          city: "杭州",
          company: "大华",
          amount: 6000,
        },
        {
          province: "浙江",
          city: "宁波",
          company: "杉杉股份",
          amount: 5000,
        },
        {
          province: "浙江",
          city: "宁波",
          company: "宁波中百",
          amount: 1000,
        },
        {
          province: "江苏",
          city: "南京",
          company: "南瑞集团",
          amount: 7000,
        },
        {
          province: "浙江",
          city: "杭州",
          company: "阿里巴巴",
          amount: 10000,
        },
        {
          province: "浙江",
          city: "宁波",
          company: "宁波中百",
          amount: 2000,
        },
        {
          province: "浙江",
          city: "宁波",
          company: "宁波中百",
          amount: 3000,
        },
      ],
    };
  },
  mounted() {
    this.tableData = [...this.rawData];
  },
};
</script>
