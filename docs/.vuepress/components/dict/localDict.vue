<template>
  <sc-crud v-if="isMounted" :data.sync="data" :options="options"> </sc-crud>
</template>

<script>
import { mockApi } from "../mock";
export default {
  name: "AddressSelect",
  data() {
    return {
      isMounted: false,
      data: [
        {
          province: "",
          city: "",
        },
        {
          province: "",
          city: "",
        },
      ],
    };
  },
  mounted() {
    this.isMounted = true;
    this.$scDict.register("provinces", {
      request: mockApi.getProvinces,
      immediate: true,
    });
  },
  computed: {
    options() {
      if (!this.isMounted) return {};
      return {
        renderColumns: [
          {
            label: "省份",
            prop: "pro",
            comp: {
              name: "el-select",
              options: this.$scDict.provinces,
              on: {
                change: (val, { row }) => {
                  row.city = "";
                },
              },
            },
          },
          {
            label: "城市",
            prop: "city",
            dict: {
              local: true,
              request: mockApi.getCities,
              // 监听省份变化，返回请求参数
              params: ({ row }) => row.pro,
              immediate: false,
            },
            comp: {
              name: "el-select",
            },
          },
        ],
      };
    },
  },
};
</script>
