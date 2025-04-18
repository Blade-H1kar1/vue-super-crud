<template>
  <div v-show="showBanner" :class="b()">
    <div :class="b('banner-content')" v-if="ctx.showSelection">
      <span>已选择 {{ selected.length }} 项</span>
      <template v-if="selected.length <= selection.maxDisplay">
        <span :class="b('selected-items')">
          <el-tag
            v-for="row in selected"
            :key="row[ctx.operateKey]"
            :class="b('remove-tag')"
            size="small"
            closable
            disable-transitions
            @close="ctx.removeSelection(row)"
            >{{ row[labelKey] }}</el-tag
          >
        </span>
      </template>
      <template v-else>
        <el-popover
          placement="bottom"
          trigger="hover"
          :popper-class="b('popover')"
        >
          <template #reference>
            <span :class="b('popover-selected-preview')">
              <el-tag
                v-for="row in selected.slice(0, selection.maxDisplay)"
                :key="row[ctx.operateKey]"
                :class="b('remove-tag')"
                size="small"
                closable
                disable-transitions
                @close="ctx.removeSelection(row)"
                >{{ row[labelKey] }}</el-tag
              >
              等 {{ selected.length }} 项
            </span>
          </template>
          <div :class="b('popover-list')">
            <div
              v-for="row in selected.slice(selection.maxDisplay)"
              :key="row[ctx.operateKey]"
              :class="b('popover-item')"
            >
              <span>{{ row[labelKey] }}</span>
              <el-tag
                :class="b('popover-remove-tag')"
                size="small"
                closable
                disable-transitions
                @close="ctx.removeSelection(row)"
              />
            </div>
          </div>
        </el-popover>
      </template>
      <div :class="b('banner-actions')">
        <el-button
          v-if="showClearAction"
          type="text"
          @click="ctx.clearSelection"
        >
          清空选择
        </el-button>
      </div>
    </div>
    <div :class="b('banner-content')" v-else-if="selected">
      <span>已选择</span>
      <span :class="b('selected-items')">
        <el-tag
          :class="b('remove-tag')"
          size="small"
          closable
          disable-transitions
          @close="ctx.removeSingleSelection"
          >{{ selected[labelKey] }}</el-tag
        >
      </span>
      <div :class="b('banner-actions')">
        <el-button
          v-if="showClearAction"
          type="text"
          @click="ctx.removeSingleSelection"
        >
          清空选择
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import create from "core/create";
import { uniqBy } from "lodash-es";
export default create({
  name: "crud-select-banner",
  inject: ["ctx"],
  computed: {
    selected() {
      if (this.ctx.showSelection) {
        return uniqBy(this.ctx.selected, this.ctx.operateKey);
      }

      if (this.ctx.showSingleSelection) {
        return this.ctx.selected;
      }
    },
    selection() {
      return this.ctx.selection;
    },
    labelKey() {
      return (
        this.selection.labelKey || this.ctx.operateKey || this.ctx.valueKey
      );
    },
    showClearAction() {
      if (this.ctx.showSelection) {
        return this.selection.clear;
      }

      if (this.ctx.showSingleSelection) {
        return this.ctx.singleSelection.clear;
      }
    },
    showBanner() {
      if (this.ctx.showSelection) {
        return this.selected.length > 0;
      }

      if (this.ctx.showSingleSelection) {
        return this.selected;
      }
      return false;
    },
  },
  methods: {},
});
</script>
