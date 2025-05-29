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
    _sortedData(data, props) {
      const sortProps = [
        ...(props || this.crudOptions.sortProps || this.sameRowSpans),
      ];
      if (!sortProps.length) return;

      // 逐级排序
      sortProps.forEach((currentProp, index) => {
        // 获取当前级别之前的所有字段
        const previousFields = sortProps
          .slice(0, index)
          .map((prop) => (typeof prop === "string" ? prop : prop.prop));

        // 获取当前字段
        const currentField =
          typeof currentProp === "string" ? currentProp : currentProp.prop;

        // 对数据进行分组排序
        this.sortByFieldWithinGroups(
          currentField,
          previousFields,
          currentProp,
          data
        );
      });
    },

    // 在已有分组内进行排序
    sortByFieldWithinGroups(currentField, previousFields, currentProp, data) {
      if (!previousFields.length) {
        this.sortByFieldPreservingOrder(data, currentField);
        if (isFunction(currentProp?.sortMethod)) {
          data.sort((a, b) => {
            return currentProp?.sortMethod(a, b);
          });
        }
        if (currentProp?.order) {
          data.sort((a, b) =>
            this.compareValue(a, b, currentField, currentProp)
          );
        }
        return;
      }
      // 根据之前的字段分组
      const groups = this.groupByFields(data, previousFields);

      const sortedKeys = Object.keys(groups);

      // 记录每组的起始索引
      let currentIndex = 0;

      // 对每个分组内部进行排序并更新原数组
      sortedKeys.forEach((groupKey) => {
        const group = groups[groupKey];
        this.sortByFieldPreservingOrder(group, currentField);

        if (isFunction(currentProp?.sortMethod)) {
          group.sort((a, b) => {
            return currentProp?.sortMethod(a, b);
          });
        }
        if (currentProp?.order) {
          group.sort((a, b) =>
            this.compareValue(a, b, currentField, currentProp)
          );
        }
        // 将排序后的组数据写回原数组
        group.forEach((item, i) => {
          data[currentIndex + i] = item;
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
    compareValue(a, b, field, sortOptions = {}) {
      const { order = "asc", nullsPosition = "last" } = sortOptions;
      const aValue = a[field];
      const bValue = b[field];

      // 处理空值
      const aIsEmpty = aValue === null || aValue === undefined || aValue === "";
      const bIsEmpty = bValue === null || bValue === undefined || bValue === "";

      if (aIsEmpty && bIsEmpty) return 0;
      if (aIsEmpty) return nullsPosition === "first" ? -1 : 1;
      if (bIsEmpty) return nullsPosition === "first" ? 1 : -1;

      // 数字比较
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return order === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // 字符串比较
      if (typeof aValue === "string" && typeof bValue === "string") {
        const compareResult = aValue.localeCompare(bValue);
        return order === "asc" ? compareResult : -compareResult;
      }

      return 0;
    },
    // 相同字段排序
    sortByFieldPreservingOrder(data, field) {
      const processed = new Set();
      let currentIndex = 0;

      while (currentIndex < data.length) {
        if (processed.has(currentIndex)) {
          currentIndex++;
          continue;
        }

        const currentValue = data[currentIndex][field];
        processed.add(currentIndex);

        let insertPosition = currentIndex + 1;
        for (let i = insertPosition; i < data.length; i++) {
          if (processed.has(i)) continue;

          if (data[i][field] === currentValue) {
            if (i !== insertPosition) {
              // 保存要移动的元素
              const itemToMove = data[i];
              // 移动中间的元素
              for (let j = i; j > insertPosition; j--) {
                data[j] = data[j - 1];
              }
              // 放置到正确位置
              data[insertPosition] = itemToMove;
            }
            processed.add(insertPosition);
            insertPosition++;
          }
        }

        currentIndex = insertPosition;
      }

      return data;
    },
    spanMethod(params) {
      const { row, column, rowIndex } = params;
      const col = column.col;
      const options = column.options;
      if (!col && !options) return;

      if (options?.spanMethod) {
        const result = options.spanMethod(params);
        if (result) return result;
      }

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
