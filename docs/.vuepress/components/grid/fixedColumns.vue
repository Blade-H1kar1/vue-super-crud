<template>
  <div class="grid-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-row">
        <div class="control-group">
          <label>列数:</label>
          <el-slider
            v-model="columns"
            :min="1"
            :max="6"
            :step="1"
            show-input
            :input-size="'small'"
          />
        </div>

        <div class="control-group">
          <label>列宽模式:</label>
          <el-select
            v-model="columnMode"
            placeholder="选择列宽模式"
            size="small"
          >
            <el-option label="平均分配 (1fr)" value="auto"></el-option>
            <el-option label="固定宽度" value="fixed"></el-option>
            <el-option label="最小宽度约束" value="minmax"></el-option>
            <el-option label="独立列宽" value="independent"></el-option>
          </el-select>
        </div>
      </div>

      <div class="control-row" v-if="columnMode === 'fixed'">
        <div class="control-group">
          <label>列宽 (px):</label>
          <el-slider
            v-model="columnWidth"
            :min="80"
            :max="300"
            :step="10"
            show-input
            :input-size="'small'"
          />
        </div>
      </div>

      <div class="control-row" v-if="columnMode === 'minmax'">
        <div class="control-group">
          <label>最小列宽 (px):</label>
          <el-slider
            v-model="minColumnWidth"
            :min="50"
            :max="200"
            :step="10"
            show-input
            :input-size="'small'"
          />
        </div>

        <div class="control-group">
          <label>最大列宽 (px):</label>
          <el-slider
            v-model="maxColumnWidth"
            :min="150"
            :max="400"
            :step="10"
            show-input
            :input-size="'small'"
          />
        </div>
      </div>

      <div class="control-row" v-if="columnMode === 'independent'">
        <div
          class="control-group"
          v-for="(width, index) in independentWidths"
          :key="index"
        >
          <label>第{{ index + 1 }}列宽度 (px):</label>
          <el-select v-model="independentWidths[index]" size="small">
            <el-option label="1fr(默认)" value="1fr"></el-option>
            <el-option label="100px" value="100px"></el-option>
            <el-option label="200px" value="200px"></el-option>
            <el-option label="300px" value="300px"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- 网格展示区域 -->
    <div class="grid-container">
      <h4>{{ getModeTitle() }}</h4>
      <sc-grid
        :columns="columns"
        :column-width="getColumnWidthConfig()"
        :column-gap="columnGap"
        :row-gap="rowGap"
      >
        <sc-cell v-for="i in cellCount" :key="i" :center="true">
          <div class="grid-item" :style="{ height: cellHeight + 'px' }">
            <div class="item-content">
              <div class="item-number">{{ i }}</div>
              <div class="item-size" v-if="columnMode !== 'auto'">
                {{ getItemSizeText() }}
              </div>
            </div>
          </div>
        </sc-cell>
      </sc-grid>
    </div>

    <p class="demo-desc">
      {{ getFullDescription() }}
    </p>
  </div>
</template>

<script>
export default {
  name: "GridFixedColumns",
  data() {
    return {
      columns: 3,
      columnMode: "auto", // auto, fixed, minmax, independent
      columnWidth: 150,
      minColumnWidth: 100,
      maxColumnWidth: 250,
      columnGap: 20,
      rowGap: 20,
      cellCount: 9,
      cellHeight: 80,
      independentWidths: ["1fr", "200px", "100px"], // 独立列宽数组
    };
  },
  watch: {
    columns(newVal) {
      // 当列数改变时，调整独立列宽数组的长度
      if (this.columnMode === "independent") {
        this.adjustIndependentWidths(newVal);
      }
    },
    columnMode(newVal) {
      // 当切换到独立列宽模式时，确保数组长度正确
      if (newVal === "independent") {
        this.adjustIndependentWidths(this.columns);
      }
    },
  },
  methods: {
    adjustIndependentWidths(columnCount) {
      // 调整独立列宽数组的长度
      const currentLength = this.independentWidths.length;
      if (currentLength < columnCount) {
        // 如果数组长度不足，用默认值填充
        const defaultWidth = 150;
        for (let i = currentLength; i < columnCount; i++) {
          this.independentWidths.push(defaultWidth);
        }
      } else if (currentLength > columnCount) {
        // 如果数组长度过多，截断多余部分
        this.independentWidths = this.independentWidths.slice(0, columnCount);
      }
    },
    getModeTitle() {
      const titles = {
        auto: "平均分配列宽布局",
        fixed: "固定列宽布局",
        minmax: "最小最大列宽约束布局",
        independent: "独立列宽布局",
      };
      return titles[this.columnMode] || "未知模式";
    },
    getModeDescription() {
      const descriptions = {
        auto: "1fr平均分配",
        fixed: "固定宽度",
        minmax: "最小最大约束",
      };
      return descriptions[this.columnMode] || "";
    },
    getColumnWidthConfig() {
      switch (this.columnMode) {
        case 'fixed':
          return this.columnWidth;
        case 'minmax':
          return { min: this.minColumnWidth, max: this.maxColumnWidth };
        case 'independent':
          return this.independentWidths;
        case 'auto':
        default:
          return '1fr';
      }
    },
    getColumnWidth() {
      return this.columnMode === "fixed" ? this.columnWidth : null;
    },
    getMinColumnWidth() {
      return this.columnMode === "minmax" ? this.minColumnWidth : null;
    },
    getMaxColumnWidth() {
      return this.columnMode === "minmax" ? this.maxColumnWidth : null;
    },
    getItemSizeText() {
      if (this.columnMode === "fixed") {
        return `${this.columnWidth}px`;
      } else if (this.columnMode === "minmax") {
        return `${this.minColumnWidth}-${this.maxColumnWidth}px`;
      }
      return "";
    },
    getFullDescription() {
      const modeTexts = {
        auto: "平均分配模式：所有列均等分配可用空间，每列宽度为 1fr",
        fixed: `固定宽度模式：每列固定宽度为 ${this.columnWidth}px，超出容器宽度时会出现水平滚动`,
        minmax: `最小最大约束模式：列宽在 ${this.minColumnWidth}px 到 ${this.maxColumnWidth}px 之间自适应调整`,
        independent: "独立列宽模式：每列可以设置不同的宽度值，支持混合使用固定值和弹性值"
      };
      return modeTexts[this.columnMode] || "";
    },
  },
};
</script>

<style scoped>
@import "./common-styles.scss";
</style>
