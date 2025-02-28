<template>
  <div>
    <div>
      {{ JSON.stringify(form) }}
    </div>
    <sc-form v-model="form" :options="options"> </sc-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
    };
  },
  computed: {
    options() {
      return {
        renderColumns: [
          {
            prop: "input",
            label: "整数生成",
            comp: {
              name: "el-input",
            },
            mock: ({ Random, Mock, Preset }, scope) => {
              return Random.integer(1, 100);
            },
          },
          {
            prop: "image",
            label: "图片生成",
            comp: {
              name: "el-image",
              bind: ({ row }) => {
                return {
                  src: row.image,
                };
              },
            },
            mock: ({ Random, Mock, Preset }, scope) => {
              return Preset.imageUrl();
            },
          },
          {
            prop: "array",
            label: "数组生成",
            formatter: (row) => {
              return (row.array || [])
                .map((item) => {
                  return item?.name;
                })
                .join(",");
            },
            mock: ({ Random, Mock, Preset }, scope) => {
              return Preset.array(() => {
                return {
                  name: Random.cword(5, 10),
                };
              }, 10);
            },
          },
        ],
      };
    },
  },
};
</script>
