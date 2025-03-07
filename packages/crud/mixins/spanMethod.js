import { isFunction } from "lodash-es";

export default {
  computed: {
    sameRowMap() {
      const sameRowSpans = Array.from(new Set(this.sameRowSpans));
      if (!sameRowSpans.length) return {};
      const map = {};
      sameRowSpans.forEach((field) => {
        const groupMap = this.createGroupMap(this.list, field, sameRowSpans);
        this.addSpanIndex(groupMap);
        map[field] = groupMap;
      });
      return map;
    },
    sumColumnList() {
      return this.trueRenderColumns.filter((item) => item.summary);
    },
    showSummary() {
      return (
        this.crudOptions.showSummary ||
        this.crudOptions.showSummary === "" ||
        this._showSummary ||
        isFunction(this.crudOptions.summaryMethod)
      );
    },
  },
  methods: {
    // 分组排序索引
    addSpanIndex(groupMap) {
      if (!groupMap) return;

      // 收集所有分组
      const allGroups = [];
      Object.keys(groupMap).forEach((key) => {
        groupMap[key].forEach((group) => {
          allGroups.push(group);
        });
      });

      // 按 firstIndex 排序
      allGroups.sort((a, b) => a.firstIndex - b.firstIndex);

      // 添加 spanIndex
      allGroups.forEach((group, index) => {
        group.spanIndex = index;
      });
    },
    // 多级排序实现
    sortedData() {
      const sortFields = [...(this.crudOptions.sortProps || this.sameRowSpans)];
      if (!sortFields.length) return;

      // 逐级排序
      sortFields.forEach((currentField, index) => {
        // 获取当前级别之前的所有字段
        const previousFields = sortFields.slice(0, index);

        // 对数据进行分组排序
        this.sortByFieldWithinGroups(currentField, previousFields);
      });
    },

    // 在已有分组内进行排序
    sortByFieldWithinGroups(currentField, previousFields) {
      if (!previousFields.length) {
        // 第一个字段直接排序
        this.sortByField(currentField);
        return;
      }

      // 根据之前的字段分组
      const groups = this.groupByFields(this.list, previousFields);

      // 记录每组的起始索引
      let currentIndex = 0;

      // 对每个分组内部进行排序并更新原数组
      Object.values(groups).forEach((group) => {
        // 对当前组按字段排序
        group.sort((a, b) => this.compareValue(a, b, currentField));

        // 将排序后的组数据写回原数组
        group.forEach((item, i) => {
          this.list[currentIndex + i] = item;
        });

        currentIndex += group.length;
      });
    },

    // 根据多个字段进行分组
    groupByFields(data, fields) {
      return data.reduce((groups, item) => {
        // 使用所有分组字段的值组合作为key
        const groupKey = fields.map((field) => item[field]).join("_");
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
      }, {});
    },

    // 单字段排序 - 直接修改原数组
    sortByField(field) {
      this.list.sort((a, b) => this.compareValue(a, b, field));
    }, // 通用比较函数
    compareValue(a, b, field) {
      // 检查是否有自定义排序
      const sortMethod = this.crudOptions.sortMethod;
      if (sortMethod) {
        const result = sortMethod(field, a, b);
        if (result !== undefined) return result;
      }
      const aValue = a[field];
      const bValue = b[field];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return -1;
      if (bValue === null || bValue === undefined) return 1;

      // 数字比较
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return Number(aValue) - Number(bValue);
      }
      // 字符串比较
      return String(aValue).localeCompare(String(bValue));
    },
    spanMethod(params) {
      const { row, column, rowIndex } = params;
      if (this.crudOptions.spanMethod) {
        const result = this.crudOptions.spanMethod(params);
        if (result) return result;
      }
      const col = column.col;
      if (!col) return;

      if (col.spanMethod) {
        return col.spanMethod(params);
      }
      const span = col.spanProp || col.sameRowSpan;
      if (span) {
        const field = typeof span === "string" ? span : col.prop;
        const map = this.sameRowMap[field];

        if (map) {
          // 查找当前行所在的分组
          const groupKey = row[field];
          const groups = map[groupKey] || [];

          // 查找包含当前行索引的分组
          const group = groups.find(
            (g) => rowIndex >= g.firstIndex && rowIndex < g.firstIndex + g.span
          );

          if (group) {
            if (rowIndex === group.firstIndex) {
              // 分组的第一行显示,并跨越整个分组
              return {
                rowspan: group.span,
                colspan: 1,
              };
            } else {
              // 其他行隐藏
              return {
                rowspan: 0,
                colspan: 0,
              };
            }
          }
        }
      }
    },
    // 创建分组映射
    createGroupMap(data, currentField, allFields) {
      const map = {};
      let currentGroup = [];
      let currentValues = {};

      // 遍历数据,按照所有合并字段的值组合来分组
      data.forEach((item, index) => {
        const groupChanged = this.isGroupChanged(
          item,
          currentValues,
          allFields,
          currentField
        );

        if (groupChanged) {
          // 如果组发生变化,处理前一组数据
          if (currentGroup.length > 0) {
            this.processGroup(map, currentGroup, currentValues[currentField]);
          }
          // 开始新的一组
          currentGroup = [{ item, index }];
          // 更新当前值
          allFields.forEach((field) => {
            currentValues[field] = item[field];
          });
        } else {
          // 继续添加到当前组
          currentGroup.push({ item, index });
        }
      });

      // 处理最后一组
      if (currentGroup.length > 0) {
        this.processGroup(map, currentGroup, currentValues[currentField]);
      }

      return map;
    },
    // 判断是否需要开始新的分组
    isGroupChanged(item, currentValues, allFields, currentField) {
      if (Object.keys(currentValues).length === 0) return true;

      // 检查当前字段之前的所有字段值是否相同
      const fieldIndex = allFields.indexOf(currentField);
      for (let i = 0; i <= fieldIndex; i++) {
        const field = allFields[i];
        if (item[field] !== currentValues[field]) {
          return true;
        }
      }
      return false;
    },

    // 处理分组数据
    processGroup(map, group, key) {
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push({
        firstIndex: group[0].index,
        span: group.length,
        items: group.map((g) => g.item),
      });
    },
  },
};
