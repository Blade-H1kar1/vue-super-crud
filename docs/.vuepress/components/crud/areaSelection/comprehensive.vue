<template>
  <div>
    <h3>固定列 + 表头嵌套 + 单元格合并 + 树级数据</h3>
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
export default {
  data() {
    return {
      loading: false,
      search: {
        pageNum: 1,
        pageSize: 20,
      },
      options: {
        init: true,
        height: "600px",
        rowKey: "id",
        treeProps: {
          children: "children",
          hasChildren: "hasChildren",
        },
        // 默认展开所有树级数据
        defaultExpandAll: true,
        showSummary: true,
        // 启用区域选择功能
        areaSelection: true,
        // 启用选择列
        selection: {
          fixed: true,
        },
        // 启用序号列
        index: {
          fixed: true,
        },
        // 启用单元格合并
        spanMethod: this.objectSpanMethod,
        renderColumns: [
          {
            prop: "department",
            label: "部门",
            width: 120,
            search: true,
            fixed: true,
          },
          {
            label: "员工基本信息",
            children: [
              {
                prop: "name",
                label: "姓名",
                width: 100,
                search: true,
              },
              {
                prop: "gender",
                label: "性别",
                width: 80,
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
              {
                prop: "age",
                label: "年龄",
                width: 80,
                form: {
                  comp: {
                    name: "el-input-number",
                    min: 18,
                    max: 65,
                  },
                },
              },
            ],
          },
          {
            label: "职位信息",
            children: [
              {
                prop: "position",
                label: "职位",
                width: 120,
              },
              {
                prop: "level",
                label: "级别",
                width: 100,
                form: {
                  comp: {
                    name: "el-select",
                    options: [
                      { label: "初级", value: "初级" },
                      { label: "中级", value: "中级" },
                      { label: "高级", value: "高级" },
                      { label: "专家", value: "专家" },
                    ],
                  },
                },
              },
            ],
          },
          {
            label: "薪资信息",
            children: [
              {
                prop: "baseSalary",
                label: "基本工资",
                width: 120,
                form: {
                  comp: {
                    name: "el-input-number",
                    min: 0,
                    precision: 2,
                  },
                },
                formatter: (row, column, cellValue) => {
                  return cellValue ? `¥${cellValue.toLocaleString()}` : "-";
                },
                summary: {
                  type: "sum",
                  prefix: "¥",
                  decimals: 2,
                },
              },
              {
                prop: "bonus",
                label: "奖金",
                width: 100,
                form: {
                  comp: {
                    name: "el-input-number",
                    min: 0,
                    precision: 2,
                  },
                },
                formatter: (row, column, cellValue) => {
                  return cellValue ? `¥${cellValue.toLocaleString()}` : "-";
                },
                summary: {
                  type: "sum",
                  prefix: "¥",
                  decimals: 2,
                },
              },
              {
                prop: "totalSalary",
                label: "总薪资",
                width: 120,
                formatter: (row) => {
                  const total = (row.baseSalary || 0) + (row.bonus || 0);
                  return `¥${total.toLocaleString()}`;
                },
                summary: {
                  type: "custom",
                  method: (data) => {
                    const total = data.reduce((sum, row) => {
                      return sum + (row.baseSalary || 0) + (row.bonus || 0);
                    }, 0);
                    return `¥${total.toLocaleString()}`;
                  },
                },
              },
            ],
          },
          {
            label: "联系方式",
            children: [
              {
                prop: "phone",
                label: "电话",
                width: 130,
              },
              {
                prop: "email",
                label: "邮箱",
                width: 180,
              },
            ],
          },
          {
            prop: "joinDate",
            label: "入职日期",
            width: 120,
            form: {
              comp: {
                name: "el-date-picker",
                type: "date",
                format: "yyyy-MM-dd",
                valueFormat: "yyyy-MM-dd",
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
                options: [
                  { label: "在职", value: "在职" },
                  { label: "离职", value: "离职" },
                  { label: "休假", value: "休假" },
                ],
              },
            },
            render: (h, { row }) => {
              const cellValue = row.status;
              const statusMap = {
                在职: { color: "#67C23A", text: "在职" },
                离职: { color: "#F56C6C", text: "离职" },
                休假: { color: "#E6A23C", text: "休假" },
              };
              const status = statusMap[cellValue] || {
                color: "#909399",
                text: cellValue,
              };
              return h(
                "span",
                {
                  style: {
                    color: `${status.color}`,
                    fontWeight: "bold",
                  },
                },
                `${status.text}`
              );
            },
          },
        ],
        // 启用行编辑
        editConfig: {
          mode: "row",
        },
        // 工具栏配置
        toolbar: {
          handles: [
            {
              label: "新增员工",
              type: "primary",
              icon: "el-icon-plus",
              onClick: () => {
                this.addEmployee();
              },
            },
          ],
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
        // 模拟复杂的树形数据
        const mockData = this.generateMockData();
        this.data = mockData;
        this.total = mockData.length;
      } finally {
        this.loading = false;
      }
    },

    generateMockData() {
      const departments = ["技术部", "产品部", "运营部", "人事部"];
      const positions = {
        技术部: ["前端工程师", "后端工程师", "测试工程师", "架构师"],
        产品部: ["产品经理", "UI设计师", "交互设计师", "产品助理"],
        运营部: ["运营专员", "市场推广", "数据分析师", "客服专员"],
        人事部: ["HR专员", "招聘专员", "培训师", "薪酬专员"],
      };
      const levels = ["初级", "中级", "高级", "专家"];
      const genders = ["男", "女"];
      const statuses = ["在职", "在职", "在职", "休假", "离职"];

      const data = [];
      let id = 1;

      departments.forEach((dept, deptIndex) => {
        // 部门主管
        const manager = {
          id: id++,
          department: dept,
          name: `${dept}主管`,
          gender: genders[Math.floor(Math.random() * genders.length)],
          age: 35 + Math.floor(Math.random() * 10),
          position: "部门主管",
          level: "专家",
          baseSalary: 15000 + Math.floor(Math.random() * 10000),
          bonus: 3000 + Math.floor(Math.random() * 5000),
          phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(
            8,
            "0"
          )}`,
          email: `manager${deptIndex}@company.com`,
          joinDate: "2020-01-15",
          status: "在职",
          children: [],
        };

        // 部门员工
        const employeeCount = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < employeeCount; i++) {
          const employee = {
            id: id++,
            department: dept,
            name: `员工${id - 1}`,
            gender: genders[Math.floor(Math.random() * genders.length)],
            age: 22 + Math.floor(Math.random() * 15),
            position:
              positions[dept][
                Math.floor(Math.random() * positions[dept].length)
              ],
            level: levels[Math.floor(Math.random() * levels.length)],
            baseSalary: 8000 + Math.floor(Math.random() * 12000),
            bonus: Math.floor(Math.random() * 3000),
            phone: `139${String(Math.floor(Math.random() * 100000000)).padStart(
              8,
              "0"
            )}`,
            email: `employee${id - 1}@company.com`,
            joinDate: `202${Math.floor(Math.random() * 4)}-${String(
              Math.floor(Math.random() * 12) + 1
            ).padStart(2, "0")}-${String(
              Math.floor(Math.random() * 28) + 1
            ).padStart(2, "0")}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
          };
          manager.children.push(employee);
        }

        data.push(manager);
      });

      return data;
    },

    addEmployee() {
      const newEmployee = {
        id: Date.now(),
        department: "技术部",
        name: "新员工",
        gender: "男",
        age: 25,
        position: "前端工程师",
        level: "初级",
        baseSalary: 8000,
        bonus: 0,
        phone: "",
        email: "",
        joinDate: new Date().toISOString().split("T")[0],
        status: "在职",
      };
      this.data.unshift(newEmployee);
      this.$message.success("新增员工成功");
    },

    // 获取扁平化数据（将树形结构展开，并添加层级信息）
    getFlatDataWithLevel(data) {
      const result = [];

      const flatten = (items, level = 0) => {
        items.forEach((item) => {
          const flatItem = { ...item, _level: level };
          result.push(flatItem);
          if (item.children && item.children.length > 0) {
            flatten(item.children, level + 1);
          }
        });
      };

      flatten(data);
      return result;
    },

    // el-table原生单元格合并方法 - 只合并部门列且相同层级
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 只处理部门列的合并
      if (column.property !== "department") {
        return [1, 1];
      }

      // 获取扁平化的数据（包含层级信息）
      const flatData = this.getFlatDataWithLevel(this.data);
      const currentRowData = flatData[rowIndex];

      if (!currentRowData) return [1, 1];

      const currentValue = currentRowData.department;
      const currentLevel = currentRowData._level;
      let rowspan = 1;

      // 向下查找相同层级且相同部门的行
      for (let i = rowIndex + 1; i < flatData.length; i++) {
        const nextRow = flatData[i];
        // 只在相同层级中合并
        if (
          nextRow._level === currentLevel &&
          nextRow.department === currentValue
        ) {
          rowspan++;
        } else {
          break;
        }
      }

      // 检查是否是合并区域的第一行（向上查找相同层级和部门）
      let isFirstRow = true;
      for (let i = rowIndex - 1; i >= 0; i--) {
        const prevRow = flatData[i];
        if (
          prevRow._level === currentLevel &&
          prevRow.department === currentValue
        ) {
          isFirstRow = false;
          break;
        } else if (prevRow._level !== currentLevel) {
          // 不同层级则停止查找
          break;
        }
      }

      if (isFirstRow) {
        return [rowspan, 1];
      } else {
        return [0, 0]; // 隐藏重复的单元格
      }
    },
  },
};
</script>

<style scoped>
.el-table {
  font-size: 12px;
}

.el-table th {
  background-color: #f5f7fa;
  font-weight: bold;
}

.el-table .cell {
  padding: 0 8px;
}

/* 区域选择样式优化 */
::v-deep .area-selection-overlay {
  border: 2px solid #409eff;
  background-color: rgba(64, 158, 255, 0.1);
}

::v-deep .area-selection-copy {
  border: 2px dashed #67c23a;
  background-color: rgba(103, 194, 58, 0.1);
}
</style>
