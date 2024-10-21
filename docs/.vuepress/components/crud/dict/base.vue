<template>
  <div>
    <sc-crud :search.sync="searchForm" :options="options" :data="data">
    </sc-crud>
  </div>
</template>

<script>
/***
 * "getList" 匹配到的全局请求的模板
 * @param {Object} item - 当前配置对象
 * @param {Object} params - 请求参数
 * @param {Object} done - 请求结束回调
 * 
 *getList: (item) => ({
    request: (params, done) => {
      const data = [
        {
          label: "男",
          value: "1",
        },
        {
          label: "女",
          value: "2",
        },
      ];
      setTimeout(() => {
        done(data);
      }, 500);
    },
    label: "label",
    value: "value"
  }),
 * * */
export default {
  data() {
    return {
      searchForm: {},
      options: {
        searchHeader: true,
        renderColumns: [
          {
            prop: "sexValue",
            label: "通用字典请求key",
            // 通用字典请求key
            dict: "gender",
            render: (h, scope) => {
              return (
                <el-select v-model={scope.row.sexValue}>
                  {scope.dict.options.map((item) => (
                    <el-option
                      label={item.label}
                      value={item.value}
                    ></el-option>
                  ))}
                </el-select>
              );
            },
          },
          {
            prop: "test",
            label: "使用其他其他全局请求",
            dict: {
              presetType: "getList",
              // 配置请求参数
              params: {
                status: 1,
              },
            },
            render: (h, scope) => {
              return (
                <el-select v-model={scope.row.test}>
                  {scope.dict.options.map((item) => (
                    <el-option
                      label={item.label}
                      value={item.value}
                    ></el-option>
                  ))}
                </el-select>
              );
            },
          },
          {
            prop: "test1",
            label: "完整字典配置",
            dict: {
              request: (key, done) => {
                setTimeout(() => {
                  done([
                    {
                      label: "111",
                      value: "1",
                    },
                    {
                      label: "222",
                      value: "2",
                    },
                  ]);
                }, 500);
              },
            },
            render: (h, scope) => {
              return (
                <el-select v-model={scope.row.test}>
                  {scope.dict.options.map((item) => (
                    <el-option
                      label={item.label}
                      value={item.value}
                    ></el-option>
                  ))}
                </el-select>
              );
            },
          },
        ],
      },
      data: [
        {
          createTime: "2018-06-02 12:28:47",
          createUser: 94,
          id: 56,
          idNumber: "8",
          name: "识间华中张认",
          password: "sed laboris",
          phone: "18157668675",
          gender: "男",
          sexValue: "1",
          age: 20,
          status: 35,
          updateTime: "2018-09-08 16:33:19",
          updateUser: 58,
          username: "石洋",
          cascade: "1,1-1",
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>
