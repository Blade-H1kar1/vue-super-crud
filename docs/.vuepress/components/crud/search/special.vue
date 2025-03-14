<template>
  <div>
    <div style="margin-bottom: 15px;">搜索参数：{{ search }}</div>
    <sc-crud
      :loading.sync="loading"
      :search.sync="search"
      :options="options"
      :data="data"
      :total="total"
      @getList="getList"
    >
      <!-- 自定义城市搜索组件 -->
      <template #city-search>
        <el-cascader
          v-model="search.city"
          :options="cityTreeData"
          :props="{ checkStrictly: true }"
          clearable
        ></el-cascader>
      </template>

      <!-- 自定义年龄搜索标题 -->
      <template #age-search-label>
        <span>自定义年龄搜索标题 <i class="el-icon-warning"></i></span>
      </template>

      <!-- 自定义搜索头 -->
      <template #date-searchHeader>
        <div>
          自定义搜索头
        </div>
      </template>
    </sc-crud>
  </div>
</template>

<script>
import { mockApi, cityTreeData } from "../../mock";

export default {
  data() {
    return {
      loading: false,
      cityTreeData,
      search: {
        pageNum: 1,
        pageSize: 10,
        city: [],
        status: "",
      },
      options: {
        border: true,
        init: true,
        expandSearch: true,
        // 搜索表单配置
        searchForm: {
          columnWidth: "300px",
          labelWidth: "100px",
          // 自定义操作按钮
          action: {
            search: {
              label: "查询",
              icon: "el-icon-search",
            },
            reset: {
              label: "清空",
              icon: "el-icon-delete",
            },
            handles: [
              {
                label: "导出搜索结果",
                icon: "el-icon-download",
                type: "success",
                onClick: (search) => {
                  console.log("导出搜索条件：", search);
                },
              },
            ],
          },
        },
        // 表头搜索配置
        searchHeader: {
          trigger: "click",
          placement: "bottom",
        },
        renderColumns: [
          {
            prop: "name",
            label: "姓名",
            search: {
              // 自定义渲染函数
              labelRender: () => (
                <span>
                  自定义姓名标题 <i class="el-icon-warning"></i>
                </span>
              ),
            },
          },
          {
            prop: "age",
            label: "年龄",
            search: true,
          },
          {
            prop: "city",
            label: "城市",
            search: true, // 使用插槽自定义
          },
          {
            prop: "status",
            label: "状态",
            search: {
              comp: {
                name: "el-radio-group",
                options: [
                  { label: "全部", value: "" },
                  { label: "启用", value: 1 },
                  { label: "禁用", value: 0 },
                ],
              },
            },
          },
          {
            prop: "date",
            label: "测试",
            search: true,
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
