<template>
  <sc-crud ref="crud" default-expand-all :options="options" :data="data">
  </sc-crud>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          name: "总数量",
          number: 100,
          children: [
            {
              id: 11,
              name: "子数量",
              number: 50,
            },
            {
              id: 12,
              name: "子数量",
              number: 30,
            },
            {
              id: 13,
              name: "子数量",
              number: "",
            },
          ],
        },
      ],
    };
  },
  computed: {
    options() {
      return {
        renderColumns: [
          {
            prop: "name",
            label: "名称",
          },
          {
            prop: "number",
            label: "数量",
            isEdit: ({ row }) => row.name !== "总数量",
            required: true,
            form: {
              comp: {
                type: "number",
                onBlur: (v, { row }) => {
                  const father = this.data[0];
                  father.children.forEach((i) => {
                    if (row === i) return;
                    this.$refs.crud.validateField({
                      row: i,
                      prop: "number",
                    });
                  });
                },
              },
            },
            rules: [
              {
                validator: (rule, value, callback) => {
                  const father = this.data[0];
                  if (father.children.some((i) => !i.number)) {
                    callback();
                    return;
                  }
                  let totalNumber = 0;
                  father.children.forEach((item) => {
                    totalNumber += Number(item.number);
                  });
                  if (totalNumber !== father.number) {
                    callback(new Error("【子数量】总和不等于【总数量】"));
                  } else {
                    callback();
                  }
                },
              },
            ],
          },
        ],
      };
    },
  },
  methods: {},
};
</script>
