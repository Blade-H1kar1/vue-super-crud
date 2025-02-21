<template>
  <div v-show="selectionRow.length" :class="b()">
    <div :class="b('banner-content')">
      <span>已选择 {{ selectionRow.length }} 项</span>
      <template v-if="selectionRow.length <= selection.maxDisplay">
        <span :class="b('selected-items')">
          <el-tag
            v-for="row in selectionRow"
            :key="row[valueKey]"
            :class="b('remove-tag')"
            size="small"
            closable
            @close="removeSelection(row)"
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
                v-for="row in selectionRow.slice(0, selection.maxDisplay)"
                :key="row[valueKey]"
                :class="b('remove-tag')"
                size="small"
                closable
                @close="removeSelection(row)"
                >{{ row[labelKey] }}</el-tag
              >
              等 {{ selectionRow.length }} 项
            </span>
          </template>
          <div :class="b('popover-list')">
            <div
              v-for="row in selectionRow.slice(selection.maxDisplay)"
              :key="row[valueKey]"
              :class="b('popover-item')"
            >
              <span>{{ row[labelKey] }}</span>
              <el-tag
                :class="b('popover-remove-tag')"
                size="small"
                closable
                @close="removeSelection(row)"
              />
            </div>
          </div>
        </el-popover>
      </template>
      <div :class="b('banner-actions')">
        <el-button v-if="showClearAction" type="text" @click="clearSelection">
          清空选择
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import create from "core/create";
export default create({
  name: "crud-select-banner",
  props: {
    selectionRow: {
      type: Array,
    },
    selection: {
      type: Object,
    },
    valueKey: {},
  },
  computed: {
    labelKey() {
      return this.selection.labelKey || this.valueKey;
    },
    showClearAction() {
      return this.selection.clear;
    },
  },
  methods: {
    removeSelection(row) {
      this.$emit("remove-selection", row);
    },
    clearSelection() {
      this.$emit("clear-selection");
    },
  },
});
</script>
