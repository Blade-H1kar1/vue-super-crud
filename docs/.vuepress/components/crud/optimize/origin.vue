<template>
  <div>
    <el-button type="primary" @click="handleRender" :disabled="loading">
      开始渲染
    </el-button>
    <span v-if="renderTime !== null" style="margin-left: 16px;">
      渲染耗时：<b>{{ renderTime }}</b> ms
    </span>
    <el-table
      v-if="showTable"
      :data="data"
      border
      height="500px"
      style="width: 100%; margin-top: 16px;"
      ref="elTable"
    >
      <el-table-column prop="name" label="姓名">
        <template #default="scope">
          <el-input v-model="scope.row.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别">
        <template #default="scope">
          <el-select
            v-model="scope.row.gender"
            size="small"
            style="width: 100%;"
          >
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <template #default="scope">
          <el-input v-model="scope.row.age" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="birthday" label="生日">
        <template #default="scope">
          <el-date-picker
            v-model="scope.row.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            size="small"
            style="width: 100%;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="100">
        <template #default="scope">
          <el-select v-model="scope.row.city" size="small" style="width: 100%;">
            <el-option label="北京" value="北京" />
            <el-option label="上海" value="上海" />
            <el-option label="广州" value="广州" />
            <el-option label="深圳" value="深圳" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template #default="scope">
          <el-input v-model="scope.row.email" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-input v-model="scope.row.status" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数">
        <template #default="scope">
          <el-input v-model="scope.row.score" size="small" />
        </template>
      </el-table-column>
    </el-table>
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
      data: [],
    };
  },
  methods: {
    async handleRender() {
      this.renderTime = null;
      this.showTable = false;
      this.data = [];
      await this.$nextTick();
      this.showTable = true;
      this.getList();
    },
    async getList() {
      this.loading = true;
      this.startTime = performance.now();
      try {
        const { data } = await mockApi.getList(10000)({
          pageNum: 1,
          pageSize: 500,
        });
        this.data = data;
        this.$nextTick(() => {
          this.$nextTick(() => {
            this.renderTime = Math.round(performance.now() - this.startTime);
          });
        });
      } finally {
        this.loading = false;
      }
    },
    // 也可以用这个事件辅助判断表头渲染
    onTableRendered() {
      // if (this.startTime) {
      //   this.renderTime = Math.round(performance.now() - this.startTime);
      //   this.startTime = 0;
      // }
    },
  },
};
</script>
