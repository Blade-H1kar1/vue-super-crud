<template>
  <div class="grid-demo">
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-row">
        <!-- 定位控制面板 -->
        <div class="control-row">
          <div class="control-group">
            <label>左侧位置 (left):</label>
            <el-slider
              v-model="positionLeft"
              :min="1"
              :max="4"
              :step="1"
              show-input
              :input-size="'small'"
            />
          </div>

          <div class="control-group">
            <label>顶部位置 (top):</label>
            <el-slider
              v-model="positionTop"
              :min="1"
              :max="3"
              :step="1"
              show-input
              :input-size="'small'"
            />
          </div>
        </div>

        <div class="control-row">
          <div class="control-group">
            <label>宽度跨度 (widthSize):</label>
            <el-slider
              v-model="widthSize"
              :min="1"
              :max="4"
              :step="1"
              show-input
              :input-size="'small'"
            />
          </div>

          <div class="control-group">
            <label>高度跨度 (heightSize):</label>
            <el-slider
              v-model="heightSize"
              :min="1"
              :max="3"
              :step="1"
              show-input
              :input-size="'small'"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 网格展示区域 -->
    <div class="grid-container">
      <sc-grid :columns="4" :gap="gap">
        <sc-cell
          :left="positionLeft"
          :top="positionTop"
          :width-size="widthSize"
          :height-size="heightSize"
          :center="true"
        >
          <div
            class="grid-item position-demo"
            :style="{ height: getPositionCellHeight + 'px' }"
          >
            <div class="position-info">
              <div class="position-coords">
                位置: ({{ positionLeft }}, {{ positionTop }})
              </div>
              <div class="position-size">
                尺寸: {{ widthSize }} × {{ heightSize }}
              </div>
              <div class="position-desc">定位演示单元格</div>
            </div>
          </div>
        </sc-cell>

        <sc-cell
          v-for="index in positionFillCellCount"
          :key="`fill-${index}`"
          :center="true"
        >
          <div class="grid-item" :style="{ height: cellHeight + 'px' }">
            {{ index }}
          </div>
        </sc-cell>
      </sc-grid>
    </div>

    <p class="demo-desc">
      {{ getModeDescription() }}
    </p>
  </div>
</template>

<script>
export default {
  name: "GridCellDemo",
  data() {
    return {
      cellCount: 12, // 基础模式单元格数量
      cellHeight: 60, // 单元格高度
      gap: 10, // 网格间距
      positionLeft: 1, // 左侧位置
      positionTop: 1, // 顶部位置
      widthSize: 2, // 单元格宽度
      heightSize: 1, // 单元格高度
    };
  },
  computed: {
    // 计算定位模式填充单元格数量
    positionFillCellCount() {
      const totalCells = 12;
      const occupiedCells = this.widthSize * this.heightSize;
      return Math.max(0, totalCells - occupiedCells);
    },

    // 计算定位单元格的高度
    getPositionCellHeight() {
      return (
        this.cellHeight * this.heightSize + this.gap * (this.heightSize - 1)
      );
    },
  },
  methods: {
    getModeDescription() {
      return `当前演示单元格位于 (${this.positionLeft},${this.positionTop})，跨越 ${this.widthSize} 列和 ${this.heightSize} 行，可通过滑块调整位置和尺寸。`;
    },
  },
};
</script>

<style scoped>
@import "./common-styles.scss";

/* 跨行跨列演示单元格特殊样式 */
.span-demo {
  background-color: #fdf6ec !important;
  color: #e6a23c !important;
  border-color: #e6a23c !important;
  flex-direction: column;
  gap: 8px;
}

.span-demo:hover {
  background-color: #faecd8 !important;
  color: #cf9236 !important;
  border-color: #cf9236 !important;
}

.span-info {
  text-align: center;
}

.span-size {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.span-desc {
  font-size: 12px;
  opacity: 0.9;
}

/* 定位演示单元格特殊样式 */
.position-demo {
  background-color: #f0f9ff !important;
  color: #409eff !important;
  border-color: #409eff !important;
  flex-direction: column;
  gap: 8px;
}

.position-demo:hover {
  background-color: #e1f3ff !important;
  color: #337ecc !important;
  border-color: #337ecc !important;
}

.position-info {
  text-align: center;
}

.position-coords {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 3px;
}

.position-size {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 3px;
}

.position-desc {
  font-size: 11px;
  opacity: 0.9;
}

/* Element UI 滑块样式优化 */
.control-group .el-slider {
  width: 200px;
}

.control-group .el-slider__input {
  width: 80px;
}
</style>
