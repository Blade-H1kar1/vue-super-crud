<template>
  <el-drawer
    :class="b('drawer-column')"
    title="列设置"
    :visible.sync="active"
    size="300px"
    append-to-body
  >
    <div class="wrapper">
      <el-card shadow="never">
        <div class="header">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckedChange"
            >{{ show.length }} / {{ columns.length }}</el-checkbox
          >
          <span class="title">固定 / 排序</span>
        </div>
        <el-checkbox-group
          class="col-list"
          v-model="show"
          @change="handleCheckedChange"
        >
          <draggable
            ghost-class="ghost"
            handle=".sort-drag"
            filter=".unMover"
            animation="150"
            v-model="currentValue"
            @end="onEnd"
          >
            <div class="col-item" v-for="(i, index) in columns" :key="index">
              <el-checkbox
                class="col-item--left"
                :label="i.prop"
                :title="i.label"
              >
                {{ i.label }}
              </el-checkbox>
              <div class="col-item--right">
                <el-button-group>
                  <el-button
                    class="fixed-btn"
                    icon="el-icon-arrow-left"
                    :type="fixed[i.prop] === 'left' ? 'primary' : 'default'"
                    @click="changeFixed(i.prop, 'left')"
                  ></el-button>
                  <el-button
                    class="fixed-btn"
                    icon="el-icon-close"
                    :type="!fixed[i.prop] ? 'primary' : 'default'"
                    @click="changeFixed(i.prop, false)"
                  ></el-button>
                  <el-button
                    class="fixed-btn"
                    icon="el-icon-arrow-right"
                    :type="fixed[i.prop] === 'right' ? 'primary' : 'default'"
                    @click="changeFixed(i.prop, 'right')"
                  ></el-button>
                </el-button-group>
                <div :class="['el-icon-sort', 'sort-drag', 'mover']"></div>
              </div>
            </div>
          </draggable>
        </el-checkbox-group>
      </el-card>
      <el-button
        class="reset-btn"
        size="default"
        icon="el-icon-refresh"
        @click="reset"
        >重置</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import create from "core/create";
import draggable from "vuedraggable";
import cache from "utils/cache.js";
export default create({
  name: "crud",
  components: { draggable },
  inject: ["ctx"],
  data() {
    return {
      active: false,
      title: "",
      currentValue: [],
    };
  },
  computed: {
    columns() {
      return this.ctx.columns.filter((item) => !item.hiddenList);
    },
    fixed() {
      return this.ctx.setOptions.fixed;
    },
    hidden: {
      get() {
        return this.ctx.setOptions.hidden;
      },
      set(val) {
        this.ctx.setOptions.hidden = val;
      },
    },
    show: {
      get() {
        return this.columns
          .filter((i) => !this.hidden.includes(i.prop))
          .map((i) => i.prop);
      },
      set(val) {
        this.hidden = this.columns
          .filter((i) => !val.includes(i.prop))
          .map((i) => i.prop);
      },
    },
    isIndeterminate() {
      return this.hidden.length > 0 && this.hidden.length < this.columns.length;
    },
    checkAll: {
      get() {
        return this.show.length === this.columns.length;
      },
      set(val) {
        this.hidden = val ? [] : this.columns.map((i) => i.prop);
      },
    },
  },
  methods: {
    flatColumn(columns) {
      const flattenColumns = [];
      columns.forEach((col) => {
        flattenColumns.push(col);
        if (col.children) {
          const children = this.flatColumn(col.children);
          flattenColumns.push(...children);
        }
      });
      return flattenColumns;
    },
    showDrawer() {
      this.active = true;
    },
    reset() {
      this.ctx.resetLocalCache();
    },
    changeFixed(property, type) {
      this.$set(this.ctx.setOptions.fixed, property, type);
      this.ctx.saveLocalCache();
    },
    handleCheckedChange(value) {
      this.ctx.saveLocalCache();
    },
    saveTableOptions() {
      if (!this.$route) return;
      let cacheData = cache.local.getJSON("tableOptions");
      cacheData[this.$route.path] = this.ctx.setOptions;
      cache.local.setJSON("tableOptions", cacheData);
    },
    onEnd({ newIndex, oldIndex }) {
      const sort = this.ctx.setOptions.sort;
      const endProp = this.columns[newIndex].prop;
      const prop = this.columns[oldIndex].prop;
      let startIndex, endIndex, adjustment;
      if (oldIndex < newIndex) {
        startIndex = oldIndex + 1;
        endIndex = newIndex + 1;
        adjustment = -1;
      } else if (oldIndex > newIndex) {
        startIndex = newIndex;
        endIndex = oldIndex;
        adjustment = 1;
      } else {
        return;
      }
      const clipColumns = this.columns.slice(startIndex, endIndex);
      clipColumns.forEach((item) => {
        if (item.prop !== prop) {
          this.$set(sort, item.prop, item.order + adjustment);
        }
      });
      this.$set(sort, prop, newIndex);
      this.ctx.saveLocalCache();
    },
  },
});
</script>

<style lang="scss" scoped></style>
