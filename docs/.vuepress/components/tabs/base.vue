<template>
  <sc-tabs
    v-model="activeTab"
    :tab-list="tabList"
    all
    refresh
    type="card"
    @tab-click="handleTabClick"
  >
    <template #tab1>
      <div>标签1的内容</div>
    </template>

    <template #tab2-label="scope">
      <i class="el-icon-date"></i>
      {{ scope.label }}
    </template>

    <template #tab2>
      <div>标签2的内容</div>
    </template>
  </sc-tabs>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "tab1",
      tabList: [
        {
          label: "标签1",
          name: "tab1",
          icon: "el-icon-date",
          cache: true,
        },
        {
          label: "标签2",
          name: "tab2",
        },
        {
          label: "标签3",
          name: "tab3",
          render: () => {
            return <div>标签3的内容</div>;
          },
        },
      ],
    };
  },
  methods: {
    handleTabClick(tab, item) {
      console.log("点击的标签：", tab, item);
    },
  },
};
</script>
