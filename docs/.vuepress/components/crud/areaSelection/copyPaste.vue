<template>
  <div>
    <sc-crud
      ref="crud"
      :data="tableData"
      :search.sync="searchForm"
      :options="options"
      @area-copy="handleCopy"
      @area-paste="handlePaste"
      @area-cut="handleCut"
      @area-selection-change="handleSelectionChange"
    >
    </sc-crud>

    <div style="margin-top: 20px">
      <el-card header="外部数据测试">
        <p style="margin-bottom: 10px">
          可以从下面的文本框复制数据，然后粘贴到表格中测试：
        </p>
        <el-input
          type="textarea"
          :rows="6"
          v-model="externalData"
          placeholder="可以粘贴Excel数据到这里，然后复制到表格中测试"
        ></el-input>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "CrudAreaSelectionCopyPaste",
  data() {
    return {
      searchForm: {},
      selectedInfo: {
        count: 0,
        range: "",
        dataTypes: [],
      },
      clipboardData: null,
      clipboardPreview: "",
      hasSelection: false,
      externalData: `产品名称\t价格\t库存\t状态\n笔记本电脑\t5999\t50\t在售\n台式机\t3999\t30\t在售\n显示器\t1299\t100\t在售\n键盘\t299\t200\t在售`,
      tableData: [
        {
          id: 1,
          name: "产品A",
          price: 1299,
          stock: 100,
          status: "在售",
          category: "电子产品",
          supplier: "供应商A",
          date: "2024-01-15",
        },
        {
          id: 2,
          name: "产品B",
          price: 2599,
          stock: 50,
          status: "在售",
          category: "电子产品",
          supplier: "供应商B",
          date: "2024-01-16",
        },
        {
          id: 3,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
        {
          id: 4,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
        {
          id: 5,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
        {
          id: 6,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
        {
          id: 7,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
        {
          id: 8,
          name: "",
          price: "",
          stock: "",
          status: "",
          category: "",
          supplier: "",
          date: "",
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        index: true,
        areaSelection: {},
        editConfig: {
          trigger: "click",
          mode: "cell",
        },
        height: "400px",
        renderColumns: [
          {
            prop: "name",
            label: "产品名称",
            width: 120,
            form: {
              comp: {
                name: "el-input",
                placeholder: "请输入产品名称",
              },
            },
          },
          {
            prop: "price",
            label: "价格",
            width: 100,
            form: {
              comp: {
                name: "el-input-number",
                min: 0,
                precision: 2,
                placeholder: "请输入价格",
              },
            },
          },
          {
            prop: "stock",
            label: "库存",
            width: 80,
            form: {
              comp: {
                name: "el-input-number",
                min: 0,
                placeholder: "请输入库存",
              },
            },
          },
          {
            prop: "status",
            label: "状态",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                placeholder: "请选择状态",
                options: [
                  { label: "在售", value: "在售" },
                  { label: "下架", value: "下架" },
                  { label: "缺货", value: "缺货" },
                ],
              },
            },
          },
          {
            prop: "category",
            label: "分类",
            width: 120,
            form: {
              comp: {
                name: "el-select",
                placeholder: "请选择分类",
                options: [
                  { label: "电子产品", value: "电子产品" },
                  { label: "服装", value: "服装" },
                  { label: "食品", value: "食品" },
                  { label: "图书", value: "图书" },
                ],
              },
            },
          },
          {
            prop: "supplier",
            label: "供应商",
            form: {
              comp: {
                name: "el-input",
                placeholder: "请输入供应商",
              },
            },
          },
          {
            prop: "date",
            label: "日期",
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                placeholder: "请选择日期",
                format: "yyyy-MM-dd",
                "value-format": "yyyy-MM-dd",
              },
            },
          },
        ],
      };
    },
  },
  methods: {
    handleCopy(data) {
      console.log("handleCopy", data);
    },

    handlePaste(data) {
      console.log("handlePaste", data);
    },

    handleCut(data) {
      console.log("handleCut", data);
    },

    handleSelectionChange(selectedCells) {
      console.log("selectedCells", selectedCells);
    },
  },
};
</script>

<style scoped>
.el-alert {
  margin-bottom: 20px;
}

.el-alert p {
  margin: 2px 0;
  font-size: 13px;
}

.el-card p {
  margin: 5px 0;
  font-size: 13px;
}

pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  margin: 0;
}

.el-button-group {
  display: flex;
  flex-wrap: wrap;
}

.el-button-group .el-button {
  margin-bottom: 5px;
}
</style>
