<template>
  <div>
    <el-button type="primary" @click="handleRender" :disabled="loading">
      开始渲染
    </el-button>
    <el-switch
      v-model="delayRender"
      active-text="延迟渲染"
      inactive-text="普通渲染"
      style="margin-left: 20px;"
      :disabled="loading"
    />
    <span v-if="renderTime !== null" style="margin-left: 16px;">
      渲染耗时：<b>{{ renderTime }}</b> ms
    </span>
    <sc-crud
      v-if="showTable"
      :loading.sync="loading"
      :options="crudOptions"
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
      showTable: false,
      renderTime: null,
      startTime: 0,
      delayRender: true, // 控制开关
      options: {
        border: true,
        init: true,
        editConfig: {
          mode: "free",
        },
        height: "500px",
        renderColumns: [
          { prop: "name", label: "姓名" },
          {
            prop: "gender",
            label: "性别",
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "男", value: "男" },
                  { label: "女", value: "女" },
                ],
              },
            },
          },
          { prop: "age", label: "年龄" },
          {
            prop: "birthday",
            label: "生日",
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                valueFormat: "yyyy-MM-dd",
              },
            },
          },
          {
            prop: "city",
            label: "城市",
            width: 100,
            form: {
              comp: {
                name: "el-select",
                options: [
                  { label: "北京", value: "北京" },
                  { label: "上海", value: "上海" },
                  { label: "广州", value: "广州" },
                  { label: "深圳", value: "深圳" },
                ],
              },
            },
          },
          { prop: "email", label: "邮箱" },
          { prop: "status", label: "状态" },
          { prop: "score", label: "分数" },
        ],
      },
      data: [],
      total: 0,
    };
  },
  computed: {
    crudOptions() {
      return {
        ...this.options,
        delayRender: this.delayRender,
      };
    },
  },
  methods: {
    async handleRender() {
      this.renderTime = null;
      this.showTable = false;
      this.data = [];
      this.total = 0;
      await this.$nextTick();
      this.showTable = true;
    },
    async getList() {
      this.loading = true;
      this.startTime = performance.now();
      try {
        const { data, total } = await mockApi.getList(10000)({
          pageNum: 1,
          pageSize: 500,
        });
        this.data = data;
        this.total = total;
        // 统计首屏渲染耗时
        this.$nextTick(() => {
          this.renderTime = Math.round(performance.now() - this.startTime);
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
