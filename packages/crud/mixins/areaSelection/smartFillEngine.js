/**
 * 智能填充引擎
 * 支持数值序列和基础日期格式的智能识别
 */
import dayjs from "dayjs";

// 支持的日期格式
const DATE_FORMATS = ["YYYY-MM-DD", "YYYY/MM/DD"];

/**
 * 分析数据模式
 * @param {Array} sourceData - 源数据数组
 * @param {Object} customLists - 自定义列表
 * @returns {Object} 模式分析结果
 */
export function analyzePattern(sourceData, customLists = []) {
  if (!sourceData || sourceData.length === 0) {
    return { type: "copy", confidence: 1.0 };
  }

  // 提取值数组
  const values = sourceData
    .map((item) => item.value)
    .filter((v) => v !== null && v !== undefined && v !== "");

  if (values.length < 2) {
    return { type: "copy", confidence: 1.0 };
  }

  // 检测数值序列
  const numericPattern = detectNumericSequence(values);
  if (numericPattern.confidence > 0.8) {
    return numericPattern;
  }

  // 检测自定义列表序列
  const customListPattern = detectCustomListSequence(values, customLists);
  if (customListPattern.confidence > 0.8) {
    return customListPattern;
  }

  // 检测文本+数字序列
  const textNumericPattern = detectTextNumericSequence(values);
  if (textNumericPattern.confidence > 0.8) {
    return textNumericPattern;
  }

  // 检测日期序列
  const datePattern = detectDateSequence(values);
  if (datePattern.confidence > 0.8) {
    return datePattern;
  }

  // 默认返回复制模式
  return { type: "copy", confidence: 1.0 };
}

/**
 * 检测数值序列模式
 * @param {Array} values - 值数组
 * @returns {Object} 检测结果
 */
function detectNumericSequence(values) {
  const numbers = [];

  // 尝试将值转换为数字
  for (const value of values) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return { type: "copy", confidence: 0 };
    }
    numbers.push(num);
  }

  if (numbers.length < 2) {
    return { type: "copy", confidence: 0 };
  }

  // 检测等差数列
  const differences = [];
  for (let i = 1; i < numbers.length; i++) {
    differences.push(numbers[i] - numbers[i - 1]);
  }

  // 检查差值是否一致
  const firstDiff = differences[0];
  const isArithmetic = differences.every(
    (diff) => Math.abs(diff - firstDiff) < 1e-10
  );

  if (isArithmetic && firstDiff !== 0) {
    return {
      type: "numeric",
      subType: "arithmetic",
      step: firstDiff,
      startValue: numbers[0],
      confidence: 0.9,
    };
  }

  // 检测等比数列（简单情况）
  if (numbers.every((n) => n !== 0)) {
    const ratios = [];
    for (let i = 1; i < numbers.length; i++) {
      ratios.push(numbers[i] / numbers[i - 1]);
    }

    const firstRatio = ratios[0];
    const isGeometric = ratios.every(
      (ratio) => Math.abs(ratio - firstRatio) < 1e-10
    );

    if (isGeometric && firstRatio !== 1 && firstRatio > 0) {
      return {
        type: "numeric",
        subType: "geometric",
        ratio: firstRatio,
        startValue: numbers[0],
        confidence: 0.85,
      };
    }
  }

  return { type: "copy", confidence: 0 };
}

/**
 * 检测文本+数字序列模式
 * @param {Array} values - 值数组
 * @returns {Object} 检测结果
 */
function detectTextNumericSequence(values) {
  // 正则表达式匹配文本+数字模式
  const textNumPattern = /^(.+?)(\d+)$/;
  const extractedData = [];

  for (const value of values) {
    const match = String(value).match(textNumPattern);
    if (!match) {
      return { type: "copy", confidence: 0 };
    }

    const textPart = match[1];
    const numPart = parseInt(match[2], 10);

    extractedData.push({
      text: textPart,
      number: numPart,
      original: value,
    });
  }

  if (extractedData.length < 2) {
    return { type: "copy", confidence: 0 };
  }

  // 检查文本部分是否一致
  const firstText = extractedData[0].text;
  const allTextSame = extractedData.every((item) => item.text === firstText);

  if (!allTextSame) {
    return { type: "copy", confidence: 0 };
  }

  // 检测数字部分的等差数列
  const numbers = extractedData.map((item) => item.number);
  const differences = [];
  for (let i = 1; i < numbers.length; i++) {
    differences.push(numbers[i] - numbers[i - 1]);
  }

  // 检查差值是否一致
  const firstDiff = differences[0];
  const isArithmetic = differences.every((diff) => diff === firstDiff);

  if (isArithmetic && firstDiff !== 0) {
    return {
      type: "textNumeric",
      textPart: firstText,
      step: firstDiff,
      startNumber: numbers[0],
      confidence: 0.9,
    };
  }

  return { type: "copy", confidence: 0 };
}

/**
 * 检测自定义列表序列模式
 * @param {Array} values - 值数组
 * @param {Object} customLists - 自定义列表
 * @returns {Object} 检测结果
 */
function detectCustomListSequence(values, customLists) {
  if (values.length < 2 || !Array.isArray(customLists)) {
    return { type: "copy", confidence: 0 };
  }

  // 遍历所有自定义列表，查找匹配的模式
  for (let i = 0; i < customLists.length; i++) {
    const listItems = customLists[i];
    if (Array.isArray(listItems)) {
      const pattern = matchCustomList(values, listItems, `list_${i}`);
      if (pattern.confidence > 0.8) {
        return pattern;
      }
    }
  }

  return { type: "copy", confidence: 0 };
}

/**
 * 匹配自定义列表
 * @param {Array} values - 值数组
 * @param {Array} listItems - 列表项
 * @param {String} listName - 列表名称
 * @returns {Object} 匹配结果
 */
function matchCustomList(values, listItems, listName) {
  const indices = [];

  // 查找每个值在列表中的索引
  for (const value of values) {
    const index = listItems.findIndex((item) => item === value);
    if (index === -1) {
      return { type: "copy", confidence: 0 };
    }
    indices.push(index);
  }

  // 检测索引序列的规律
  if (indices.length < 2) {
    return { type: "copy", confidence: 0 };
  }

  // 检查是否为连续序列
  const differences = [];
  for (let i = 1; i < indices.length; i++) {
    differences.push(indices[i] - indices[i - 1]);
  }

  const firstDiff = differences[0];
  const isConsecutive = differences.every((diff) => diff === firstDiff);

  if (isConsecutive && firstDiff !== 0) {
    return {
      type: "customList",
      listName,
      listItems,
      step: firstDiff,
      startIndex: indices[0],
      confidence: 0.95,
    };
  }

  return { type: "copy", confidence: 0 };
}

/**
 * 检测日期序列模式
 * @param {Array} values - 值数组
 * @returns {Object} 检测结果
 */
function detectDateSequence(values) {
  const dates = [];
  let detectedFormat = null;

  // 尝试解析日期
  for (const value of values) {
    let parsedDate = null;

    for (const format of DATE_FORMATS) {
      const date = dayjs(value, format, true);
      if (date.isValid()) {
        parsedDate = date;
        detectedFormat = format;
        break;
      }
    }

    if (!parsedDate) {
      return { type: "copy", confidence: 0 };
    }

    dates.push(parsedDate);
  }

  if (dates.length < 2) {
    return { type: "copy", confidence: 0 };
  }

  // 检测日期间隔
  const intervals = [];
  for (let i = 1; i < dates.length; i++) {
    const diff = dates[i].diff(dates[i - 1], "day");
    intervals.push(diff);
  }

  // 检查间隔是否一致
  const firstInterval = intervals[0];
  const isConsistent = intervals.every(
    (interval) => interval === firstInterval
  );

  if (isConsistent && firstInterval !== 0) {
    return {
      type: "date",
      unit: "day",
      step: firstInterval,
      startDate: dates[0],
      format: detectedFormat,
      confidence: 0.9,
    };
  }

  return { type: "copy", confidence: 0 };
}

/**
 * 生成智能填充数据
 * @param {Object} pattern - 模式信息
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
export function generateSmartFillData(
  pattern,
  sourceData,
  fillCells,
  originalBounds,
  disableSmartFill = false
) {
  // 如果禁用智能填充，直接使用复制模式
  if (disableSmartFill) {
    return generateCopyPattern(sourceData, fillCells, originalBounds);
  }

  switch (pattern.type) {
    case "numeric":
      return generateNumericSequence(
        pattern,
        sourceData,
        fillCells,
        originalBounds
      );
    case "customList":
      return generateCustomListSequence(
        pattern,
        sourceData,
        fillCells,
        originalBounds
      );
    case "textNumeric":
      return generateTextNumericSequence(
        pattern,
        sourceData,
        fillCells,
        originalBounds
      );
    case "date":
      return generateDateSequence(
        pattern,
        sourceData,
        fillCells,
        originalBounds
      );
    default:
      return generateCopyPattern(sourceData, fillCells, originalBounds);
  }
}

/**
 * 生成数值序列
 * @param {Object} pattern - 数值模式
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
function generateNumericSequence(
  pattern,
  sourceData,
  fillCells,
  originalBounds
) {
  const fillData = [];
  const { minRow, maxRow, minCol, maxCol } = originalBounds;

  fillCells.forEach((cell) => {
    const { rowIndex, columnIndex } = cell;

    // 跳过原始选中区域内的单元格
    if (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      columnIndex >= minCol &&
      columnIndex <= maxCol
    ) {
      return;
    }

    // 计算在序列中的位置
    let sequenceIndex;
    if (rowIndex > maxRow) {
      // 向下填充
      sequenceIndex = sourceData.length + (rowIndex - maxRow - 1);
    } else if (rowIndex < minRow) {
      // 向上填充
      sequenceIndex = -(minRow - rowIndex);
    } else if (columnIndex > maxCol) {
      // 向右填充
      sequenceIndex = sourceData.length + (columnIndex - maxCol - 1);
    } else if (columnIndex < minCol) {
      // 向左填充
      sequenceIndex = -(minCol - columnIndex);
    } else {
      return;
    }

    let value;
    if (pattern.subType === "arithmetic") {
      value = pattern.startValue + sequenceIndex * pattern.step;
    } else if (pattern.subType === "geometric") {
      value = pattern.startValue * Math.pow(pattern.ratio, sequenceIndex);
    } else {
      return;
    }

    // 保持原始数据的格式（整数/小数）
    if (
      Number.isInteger(pattern.startValue) &&
      Number.isInteger(pattern.step || pattern.ratio)
    ) {
      value = Math.round(value);
    }

    fillData.push({
      rowIndex,
      columnIndex,
      value: value.toString(),
      sourceValue: pattern.startValue,
      sourceRow: minRow,
      sourceCol: minCol,
    });
  });

  return fillData;
}

/**
 * 生成日期序列
 * @param {Object} pattern - 日期模式
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
function generateDateSequence(pattern, sourceData, fillCells, originalBounds) {
  const fillData = [];
  const { minRow, maxRow, minCol, maxCol } = originalBounds;

  fillCells.forEach((cell) => {
    const { rowIndex, columnIndex } = cell;

    // 跳过原始选中区域内的单元格
    if (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      columnIndex >= minCol &&
      columnIndex <= maxCol
    ) {
      return;
    }

    // 计算在序列中的位置
    let sequenceIndex;
    if (rowIndex > maxRow) {
      sequenceIndex = sourceData.length + (rowIndex - maxRow - 1);
    } else if (rowIndex < minRow) {
      sequenceIndex = -(minRow - rowIndex);
    } else if (columnIndex > maxCol) {
      sequenceIndex = sourceData.length + (columnIndex - maxCol - 1);
    } else if (columnIndex < minCol) {
      sequenceIndex = -(minCol - columnIndex);
    } else {
      return;
    }

    const newDate = pattern.startDate.add(
      sequenceIndex * pattern.step,
      pattern.unit
    );
    const value = newDate.format(pattern.format);

    fillData.push({
      rowIndex,
      columnIndex,
      value,
      sourceValue: pattern.startDate.format(pattern.format),
      sourceRow: minRow,
      sourceCol: minCol,
    });
  });

  return fillData;
}

/**
 * 生成自定义列表序列
 * @param {Object} pattern - 自定义列表模式
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
function generateCustomListSequence(
  pattern,
  sourceData,
  fillCells,
  originalBounds
) {
  const fillData = [];
  const { minRow, maxRow, minCol, maxCol } = originalBounds;
  const { listItems, step, startIndex } = pattern;

  fillCells.forEach((cell) => {
    const { rowIndex, columnIndex } = cell;

    // 跳过原始选中区域内的单元格
    if (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      columnIndex >= minCol &&
      columnIndex <= maxCol
    ) {
      return;
    }

    // 计算在序列中的位置
    let sequenceIndex;
    if (rowIndex > maxRow) {
      // 向下填充
      sequenceIndex = sourceData.length + (rowIndex - maxRow - 1);
    } else if (rowIndex < minRow) {
      // 向上填充
      sequenceIndex = -(minRow - rowIndex);
    } else if (columnIndex > maxCol) {
      // 向右填充
      sequenceIndex = sourceData.length + (columnIndex - maxCol - 1);
    } else if (columnIndex < minCol) {
      // 向左填充
      sequenceIndex = -(minCol - columnIndex);
    } else {
      return;
    }

    // 计算新的列表索引（支持循环）
    let newIndex = startIndex + sequenceIndex * step;

    // 处理负索引和超出范围的索引（循环模式）
    while (newIndex < 0) {
      newIndex += listItems.length;
    }
    newIndex = newIndex % listItems.length;

    const value = listItems[newIndex];

    fillData.push({
      rowIndex,
      columnIndex,
      value,
      sourceValue: listItems[startIndex],
      sourceRow: minRow,
      sourceCol: minCol,
    });
  });

  return fillData;
}

/**
 * 生成文本+数字序列
 * @param {Object} pattern - 文本数字模式
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
function generateTextNumericSequence(
  pattern,
  sourceData,
  fillCells,
  originalBounds
) {
  const fillData = [];
  const { minRow, maxRow, minCol, maxCol } = originalBounds;

  fillCells.forEach((cell) => {
    const { rowIndex, columnIndex } = cell;

    // 跳过原始选中区域内的单元格
    if (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      columnIndex >= minCol &&
      columnIndex <= maxCol
    ) {
      return;
    }

    // 计算在序列中的位置
    let sequenceIndex;
    if (rowIndex > maxRow) {
      // 向下填充
      sequenceIndex = sourceData.length + (rowIndex - maxRow - 1);
    } else if (rowIndex < minRow) {
      // 向上填充
      sequenceIndex = -(minRow - rowIndex);
    } else if (columnIndex > maxCol) {
      // 向右填充
      sequenceIndex = sourceData.length + (columnIndex - maxCol - 1);
    } else if (columnIndex < minCol) {
      // 向左填充
      sequenceIndex = -(minCol - columnIndex);
    } else {
      return;
    }

    const newNumber = pattern.startNumber + sequenceIndex * pattern.step;
    const value = pattern.textPart + newNumber;

    fillData.push({
      rowIndex,
      columnIndex,
      value,
      sourceValue: pattern.textPart + pattern.startNumber,
      sourceRow: minRow,
      sourceCol: minCol,
    });
  });

  return fillData;
}

/**
 * 生成复制模式数据
 * @param {Array} sourceData - 源数据
 * @param {Array} fillCells - 要填充的单元格
 * @param {Object} originalBounds - 原始选中区域边界
 * @returns {Array} 填充数据
 */
function generateCopyPattern(sourceData, fillCells, originalBounds) {
  const fillData = [];
  const { minRow, maxRow, minCol, maxCol } = originalBounds;
  const sourceRows = maxRow - minRow + 1;
  const sourceCols = maxCol - minCol + 1;

  fillCells.forEach((cell) => {
    const { rowIndex, columnIndex } = cell;

    // 跳过原始选中区域内的单元格
    if (
      rowIndex >= minRow &&
      rowIndex <= maxRow &&
      columnIndex >= minCol &&
      columnIndex <= maxCol
    ) {
      return;
    }

    // 计算在源数据中的相对位置（循环复制）
    const sourceRowIndex = Math.abs(rowIndex - minRow) % sourceRows;
    const sourceColIndex = Math.abs(columnIndex - minCol) % sourceCols;

    // 查找对应的源数据
    const sourceCell = sourceData.find(
      (data) =>
        data.relativeRow === sourceRowIndex &&
        data.relativeCol === sourceColIndex
    );

    if (sourceCell) {
      fillData.push({
        rowIndex,
        columnIndex,
        value: sourceCell.value,
        sourceValue: sourceCell.value,
        sourceRow: sourceCell.rowIndex,
        sourceCol: sourceCell.columnIndex,
      });
    }
  });

  return fillData;
}
