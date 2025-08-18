<template>
  <div>
    <h3>表单</h3>
    <sc-form v-model="form" :options="options">
      <template #test-left>
        <el-button>渲染单元格左侧</el-button>
      </template>
      <template #test-right>
        <el-button>渲染单元格右侧</el-button>
      </template>
      <template #test-top="scope">
        <el-button style="width: 100%">{{
          scope.row.test || "渲染单元格顶部"
        }}</el-button>
      </template>
      <template #test-bottom>
        <el-button style="width: 100%">渲染单元格底部</el-button>
      </template>
    </sc-form>
    <h3>表格</h3>
    <sc-crud :options="tableOptions" :data="data"
      ><template #test-left>
        <el-button>渲染单元格左侧 </el-button>
      </template>
      <template #test-right>
        <el-button>渲染单元格右侧</el-button>
      </template>
      <template #test-top="scope">
        <el-button style="width: 100%">{{
          scope.row.test || "渲染单元格顶部"
        }}</el-button>
      </template>
      <template #test-bottom>
        <el-button style="width: 100%">渲染单元格底部</el-button>
      </template>
    </sc-crud>
    <h3>可编辑表格</h3>
    <sc-crud :options="editTableOptions" :data="data"
      ><template #test-left>
        <el-button>编辑渲染单元格左侧 </el-button>
      </template>
      <template #test-right>
        <el-button>编辑渲染单元格右侧</el-button>
      </template>
      <template #test-top="scope">
        <el-button style="width: 100%">{{
          scope.row.test || "编辑渲染单元格顶部"
        }}</el-button>
      </template>
      <template #test-bottom>
        <el-button style="width: 100%">编辑渲染单元格底部</el-button>
      </template>
    </sc-crud>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      data: [
        {
          test: "测试",
          test2: "11111",
        },
      ],
      options: {
        labelWidth: "160px",
        renderColumns: [
          {
            label: "渲染单元格",
            prop: "test",
            position: true,
            comp: {
              name: "el-input",
            },
          },
          {
            label: "普通单元格",
            prop: "test2",
          },
        ],
      },
      tableOptions: {
        labelWidth: "160px",
        renderColumns: [
          {
            label: "渲染单元格",
            prop: "test",
            position: true,
          },
          {
            label: "普通单元格",
            prop: "test2",
          },
        ],
      },
      editTableOptions: {
        labelWidth: "160px",
        editConfig: {
          mode: "free",
        },
        renderColumns: [
          {
            label: "编辑渲染单元格",
            prop: "test",
            form: {
              position: true,
              comp: {
                name: "el-input",
              },
            },
          },
          {
            label: "普通单元格",
            prop: "test2",
          },
        ],
      },
    };
  },
};
</script>
