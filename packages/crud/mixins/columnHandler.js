import { isPlainObject, get, merge, cloneDeep, pick } from "lodash-es";
import { mergeTemp, singleMerge } from "utils";
export default {
  methods: {
    initColumn(item, index) {
      if (
        (item.form || this.isEdit || item.isEdit) &&
        item.form !== false &&
        item.isEdit !== false
      ) {
        item.form = this.extendsOption(
          item,
          item.form,
          pick(item, ["label", "prop", "required", "regular", "rules"])
        );
      }
      if ((item.form || item.add) && item.add !== false) {
        item.add = this.extendsOption(item, item.add, item.form);
      }
      if ((item.form || item.edit) && item.edit !== false) {
        item.edit = this.extendsOption(item, item.edit, item.form);
      }
      if ((item.form || item.view) && item.view !== false) {
        item.view = this.extendsOption(item, item.view, item.form);
      }
      if (item.search) {
        item.search = this.extendsOption(item, item.search, {});
      }
      if ((item.search || item.searchHeader) && item.searchHeader !== false) {
        item.searchHeader = this.extendsOption(
          item,
          item.searchHeader,
          item.search
        );
      }
      const order = this.setOptions?.sort[item.prop];
      item.order = order === 0 || order ? order : index;

      // 行合并
      const span = item.spanProp || item.sameRowSpan;
      if (span && !this.sameRowSpans.includes(span)) {
        if (typeof span === "string") {
          this.sameRowSpans.push(span);
        } else {
          this.sameRowSpans.push(item.prop);
        }
      }
      // 统计
      if (item.summary) {
        this._showSummary = true;
      }
      if (!item.minWidth && !item.width) {
        item.minWidth = this.getDefaultColumnMinWidth(item);
      }
    },
    extendsOption(item, current, extendsObj) {
      if (current === false) return;
      // current 可能为 undefined || true 转换为 {}
      current = isPlainObject(current) ? current : {};
      current = mergeTemp("render", current.presetType, current);
      const formatData = get(current, "formatData.type") || current.formatData;
      if (typeof formatData === "string") {
        current.formatData = Object.assign(
          {},
          current.formatData,
          singleMerge("formatData", formatData, current)
        );
      }
      extendsObj = cloneDeep(extendsObj);
      if (current.hidden !== true) {
        return merge(
          {
            label: item.label,
            prop: item.prop,
            dict: item.dict,
            ...extendsObj,
          },
          current
        );
      }
    },
    isDefaultColumn(col) {
      return this._runWithoutDeps(() => {
        if (
          col.comp ||
          col.render ||
          col.html ||
          col.isEdit ||
          this.extendsScopedSlots[col.prop] ||
          col.position ||
          col.formatData ||
          col.prop.includes(".")
        ) {
          return false;
        }
        if (this.editConfig.mode && col.isEdit !== false) {
          return false;
        }
        return true;
      });
    },
    getDefaultColumnMinWidth(col) {
      if (this.labelMinWidthMap.has(col.label)) {
        return this.labelMinWidthMap.get(col.label);
      }
      const labelSpan = document.createElement("span");
      labelSpan.innerText = col.label;
      document.body.appendChild(labelSpan);
      let labelMinWidth = labelSpan.getBoundingClientRect().width + 20;
      col.search && (labelMinWidth += 20);
      col.sortable && (labelMinWidth += 25);
      document.body.removeChild(labelSpan);
      labelMinWidth = Math.max(Math.round(labelMinWidth), 80);
      this.labelMinWidthMap.set(col.label, labelMinWidth);
      return labelMinWidth;
    },
    extendsSlots(slots, name, extendsName) {
      Object.keys(slots).forEach((slot) => {
        if (slot.endsWith(`-${extendsName}`)) {
          const baseName = slot.slice(0, -(extendsName.length + 1));
          const searchSlotName = `${baseName}-${name}`;
          if (!slots[searchSlotName]) {
            slots[searchSlotName] = slots[slot];
          }
        }
      });
    },
  },
};
