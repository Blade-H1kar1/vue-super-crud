export default {
  data() {
    return {
      curIndex: 0,
    };
  },
  created() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
  },
  methods: {
    getCharacterWidth(char, font = "12px Arial") {
      this.context.font = font;
      return Math.ceil(this.context.measureText(char).width);
    },

    // 获取最大宽度
    getMaxContentWidth(tableData, property, font, padding) {
      let maxWidth = 0;
      for (let index = 0; index < tableData.length; index++) {
        const row = tableData[index];
        if (row[property] != null) {
          const contentWidth = this.getCharacterWidth(
            String(row[property]),
            font
          );
          if (contentWidth > maxWidth) {
            maxWidth = contentWidth;
            this.curIndex = index;
          }
        }
      }
      return maxWidth + padding;
    },

    // 获取第一个内容不为空的宽度
    getFirstContentWidth(tableData, property, font, padding) {
      for (let index = 0; index < tableData.length; index++) {
        const row = tableData[index];
        if (row[property] != null && row[property].toString().length > 0) {
          this.curIndex = index;
          return this.getCharacterWidth(String(row[property]), font) + padding;
        }
      }
      return 0;
    },

    calcColumnWidth(property, tableData, type = "first", font, padding = 20) {
      if (!property || !Array.isArray(tableData) || tableData.length === 0) {
        return "80px";
      }

      let contentWidth;
      if (type === "first") {
        contentWidth = this.getFirstContentWidth(
          tableData,
          property,
          font,
          padding
        );
      } else {
        contentWidth = this.getMaxContentWidth(
          tableData,
          property,
          font,
          padding
        );
      }
      let flexWidth = contentWidth < 80 ? 80 : contentWidth;
      return `${flexWidth}px`;
    },
    getColumnWidth(width, prop, data, type, font, padding) {
      if (width === "auto") {
        return this.calcColumnWidth(prop, data, type, font, padding);
      }
      return width;
    },
  },
};
