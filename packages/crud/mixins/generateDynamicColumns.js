export default {
  methods: {
    insertColumns(newColumns, columns, position) {
      columns = [...columns];
      if (!Array.isArray(newColumns)) {
        return columns;
      }

      let insertIndex = -1;

      // 通过prop查找位置
      if (typeof position === "string") {
        insertIndex = columns.findIndex((col) => col.prop === position);
        insertIndex += 1;
        if (insertIndex === -1) {
          console.warn(`insertColumns: 未找到prop为${position}的列`);
          return columns;
        }
      }
      // 通过index指定位置
      else if (typeof position === "number") {
        if (position < 0 || position > columns.length) {
          console.warn("insertColumns: index超出范围");
          return columns;
        }
        insertIndex = position;
      }
      // 没有指定位置则追加到末尾
      else {
        insertIndex = columns.length;
      }

      // 处理新列配置
      newColumns.forEach((col) => {
        // 初始化列配置
        this.initColumn(col, insertIndex);
      });

      // 插入新列
      columns.splice(insertIndex, 0, ...newColumns);
      return columns;
    },
    // 预处理数据
    prepareData(rawData, config, level = 0, noProcessing) {
      if (!Array.isArray(rawData) || !config?.length) return [];

      if (noProcessing) return rawData;

      const currentConfig = config[level];
      if (!currentConfig) return [];

      // 使用自定义转换函数
      if (typeof currentConfig.dataTransformer === "function") {
        return currentConfig.dataTransformer(rawData);
      }

      // 按数据路径提取数据
      return rawData.flatMap((item) => {
        const result = item[currentConfig.childrenPath || "children"];
        return Array.isArray(result) ? result : [];
      });
    },
    /**
     * 生成动态列配置
     * @param {Array} data - 原始数据
     * @param {Array} levelConfig - 层级配置数组
     * @returns {Array} 生成的列配置数组
     */
    generateDynamicColumns(data, levelConfig) {
      /**
       * 处理每一层级的数据
       * @param {Array} currentData - 当前层级的数据
       * @param {number} currentLevel - 当前层级索引
       * @param {string} parentPath - 父级路径
       * @returns {Array} 当前层级的列配置
       */
      const processLevel = (currentData, currentLevel = 0, parentPath = "") => {
        // 如果没有数据或超出配置层级,返回空数组
        if (!currentData?.length || currentLevel >= levelConfig.length)
          return [];

        const config = levelConfig[currentLevel];
        // 用于去重的Map
        const uniqueMap = new Map();

        // 遍历当前层级数据
        currentData.forEach((item) => {
          // 获取prop值,支持函数或属性名
          const prop =
            typeof config.prop === "function"
              ? config.prop(item)
              : item[config.prop];

          // 获取label值,支持函数或属性名
          const label =
            typeof config.label === "function"
              ? config.label(item)
              : item[config.label];

          if (!prop) return;

          // 去重并收集源数据项
          if (!uniqueMap.has(prop)) {
            uniqueMap.set(prop, {
              prop,
              label: label || `未命名-${prop}`,
              sourceItems: [item],
            });
          } else {
            uniqueMap.get(prop).sourceItems.push(item);
          }
        });

        // 生成列配置
        return Array.from(uniqueMap.values()).map(
          ({ prop, label, sourceItems }) => {
            // 构建当前路径
            const currentPath = parentPath ? `${parentPath}.${prop}` : prop;
            const column = { label, prop: currentPath };

            // 处理子列
            if (currentLevel < levelConfig.length - 1) {
              // 递归处理下一层级
              const nextLevelData = this.prepareData(
                sourceItems,
                levelConfig,
                currentLevel + 1
              );
              column.children = processLevel(
                nextLevelData,
                currentLevel + 1,
                currentPath
              );
            } else if (config.children) {
              column.children = config.children(
                currentPath,
                sourceItems.find((item) => item[config.prop] === prop),
                sourceItems
              );
            }
            return column;
          }
        );
      };

      // 预处理初始数据
      const initialData = this.prepareData(
        data,
        levelConfig,
        0,
        levelConfig[0].root
      );
      return processLevel(initialData);
    },
    // 打平数据 - 将多层级的数据结构转换为扁平化的对象结构
    flattenData(data, levelConfig) {
      // 将单个对象打平的内部函数
      const flattenObject = (item, config, parentPath = "") => {
        // 创建结果对象,复制原始item的属性
        const result = item;

        // 处理每一层级数据的递归函数
        const processLevel = (currentItem, currentConfig, currentPath) => {
          // 如果没有配置信息则返回
          if (!currentConfig) return;

          // 获取当前层级的子节点数据
          const children =
            currentItem[currentConfig.childrenPath || "children"];
          // 如果子节点不是数组则返回
          if (!Array.isArray(children)) return;

          // 遍历每个子节点
          children.forEach((child) => {
            // 获取标识符 - 可以是函数或属性名
            const identifier =
              typeof currentConfig.prop === "function"
                ? currentConfig.prop(child)
                : child[currentConfig.prop];

            // 如果没有标识符则跳过
            if (!identifier) return;

            // 构建新的路径名
            const newPath = currentPath
              ? `${currentPath}-${identifier}`
              : identifier;

            // 遍历子节点的所有属性
            Object.entries(child).forEach(([key, value]) => {
              // 只处理非数组类型的值
              if (!Array.isArray(value)) {
                this.$set(result, `${newPath}-${key}`, value);
              }
            });

            // 获取下一层级的配置
            const nextConfig = config[config.indexOf(currentConfig) + 1];
            // 如果存在下一层级配置,则递归处理
            if (nextConfig) {
              processLevel(child, nextConfig, newPath);
            }
          });
        };

        // 从第一层配置开始处理
        processLevel(item, config[0], parentPath);
        return result;
      };

      // 对数据数组中的每个对象进行打平处理
      data.forEach((item) => flattenObject(item, levelConfig));
    },
    // 将数据映射为树形结构
    transformToTree(data, levelConfig) {
      const transformObject = (item, config) => {
        const processLevel = (currentItem, currentConfig, level = 0) => {
          if (!currentConfig) return;

          const children = currentItem[currentConfig.childrenPath];
          if (!Array.isArray(children)) return;

          children.forEach((child) => {
            const identifier =
              typeof currentConfig.prop === "function"
                ? currentConfig.prop(child)
                : child[currentConfig.prop];

            if (!identifier) return;

            // 直接使用原始对象，而不是创建新对象
            this.$set(currentItem, identifier, child);

            // 递归处理下一层级
            const nextConfig = config[level + 1];
            if (nextConfig && child[nextConfig.childrenPath]) {
              processLevel(child, nextConfig, level + 1);
            }
          });
        };

        processLevel(item, config[0], 0);
      };

      data.forEach((item) => transformObject(item, levelConfig));
    },
  },
};
