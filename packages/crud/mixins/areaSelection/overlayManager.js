import { calculateSelectionBounds, getCellElement } from "./utils.js";

/**
 * 遮罩层管理器类
 */
export class OverlayManager {
  constructor({ tableEl, initCallback = () => {} }) {
    this.tableEl = tableEl;
    this.initCallback = initCallback;

    // 遮罩层数据结构
    this.overlays = {
      body: {
        selection: { element: null, visible: false },
        copyDash: { element: null, visible: false },
        extended: { element: null, visible: false },
      },
      left: {
        selection: { element: null, visible: false },
        copyDash: { element: null, visible: false },
        extended: { element: null, visible: false },
      },
      right: {
        selection: { element: null, visible: false },
        copyDash: { element: null, visible: false },
        extended: { element: null, visible: false },
      },
    };

    // 配置常量
    this.OVERLAY_TYPES = ["selection", "copyDash", "extended"];
    this.CONTAINER_TYPES = ["body", "left", "right"];

    this.CLASS_NAMES = {
      selection: "cell-selection-overlay",
      copyDash: "copy-dash-overlay",
      extended: "extended-selection-overlay",
    };

    this.CONTAINER_SELECTORS = {
      body: ".el-table__body-wrapper",
      left: ".el-table__fixed .el-table__fixed-body-wrapper",
      right: ".el-table__fixed-right .el-table__fixed-body-wrapper",
    };

    // DOM变化监听器
    this.mutationObserver = null;
    this.isDestroyed = false;

    this.initOverlays();
    this.initOverlayObserver();
  }

  /**
   * 检测可用的容器类型
   * @returns {string[]} 可用的容器类型数组
   */
  getAvailableContainers() {
    if (!this.tableEl) return ["body"];

    const containers = ["body"];

    // 检测左固定列
    const leftFixed = this.tableEl.querySelector(
      ".el-table__fixed .el-table__fixed-body-wrapper"
    );
    if (leftFixed) {
      containers.push("left");
    }

    // 检测右固定列
    const rightFixed = this.tableEl.querySelector(
      ".el-table__fixed-right .el-table__fixed-body-wrapper"
    );
    if (rightFixed) {
      containers.push("right");
    }

    return containers;
  }

  /**
   * 初始化所有遮罩层
   */
  initOverlays() {
    // 先清理已存在的遮罩层
    this.cleanupOverlays();

    const containers = this.getAvailableContainers();
    containers.forEach((containerType) => {
      this.OVERLAY_TYPES.forEach((overlayType) => {
        this.createOverlay(overlayType, containerType);
      });
    });

    this.initCallback();
  }

  /**
   * 初始化遮罩层监听器
   */
  initOverlayObserver() {
    if (!this.tableEl || this.isDestroyed) return;

    // 清理已存在的观察器
    this.destroyOverlayObserver();

    this.mutationObserver = new MutationObserver((mutations) => {
      if (this.isDestroyed) return;

      let needReinit = false;

      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          // 检查是否有 .el-table 元素被移除
          mutation.removedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查被移除的节点是否是 .el-table 或包含 .el-table
              const isTableElement =
                node.classList && node.classList.contains("el-table");
              const containsTable =
                node.querySelector && node.querySelector(".el-table");
              if (isTableElement || containsTable) {
                needReinit = true;
              }
            }
          });
        }
      });

      // 如果检测到表格被移除，重新初始化
      if (needReinit) {
        setTimeout(() => {
          if (!this.isDestroyed && !this.hasExistingOverlays()) {
            this.initOverlays();
          }
        }, 100);
      }
    });

    // 监听表格容器的变化
    this.mutationObserver.observe(this.tableEl, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * 销毁遮罩层监听器
   */
  destroyOverlayObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  /**
   * 检查是否已存在遮罩层
   * @returns {boolean} 是否存在遮罩层
   */
  hasExistingOverlays() {
    if (!this.tableEl) return false;

    // 检查是否有任何遮罩层元素存在
    for (const overlayType of this.OVERLAY_TYPES) {
      const className = this.CLASS_NAMES[overlayType];
      if (this.tableEl.querySelector(`.${className}`)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 创建遮罩层
   * @param {string} type - 遮罩层类型
   * @param {string} containerType - 容器类型
   */
  createOverlay(type, containerType = "body") {
    if (!this.tableEl) return;

    const container = this.tableEl.querySelector(
      this.CONTAINER_SELECTORS[containerType]
    );
    if (!container) return;

    const overlay = document.createElement("div");
    overlay.className = `${this.CLASS_NAMES[type]} ${this.CLASS_NAMES[type]}--${containerType}`;

    container.appendChild(overlay);
    this.overlays[containerType][type].element = overlay;

    // 为选中遮罩层添加填充手柄（只在主容器添加）
    if (type === "selection") {
      this.createFillHandle(overlay);
    }
  }

  /**
   * 创建填充手柄
   * @param {HTMLElement} selectionOverlay - 选择遮罩层元素
   */
  createFillHandle(selectionOverlay) {
    const fillHandle = document.createElement("div");
    fillHandle.className = "fill-handle";
    selectionOverlay.appendChild(fillHandle);
  }

  /**
   * 显示遮罩层
   * @param {string} type - 遮罩层类型
   * @param {Object} bounds - 边界信息
   * @param {string} containerType - 容器类型
   */
  showOverlay(type, bounds = null, containerType = "body") {
    const overlay = this.overlays[containerType][type];
    if (!overlay.element) return;

    if (bounds) {
      this.updateOverlayPosition(type, bounds, containerType);
    }

    overlay.element.style.display = "block";
    overlay.visible = true;
  }

  /**
   * 隐藏遮罩层
   * @param {string} type - 遮罩层类型
   * @param {string} containerType - 容器类型
   */
  hideOverlay(type, containerType = "body") {
    const overlay = this.overlays[containerType][type];
    if (!overlay.element) return;

    overlay.element.style.display = "none";
    overlay.visible = false;
  }

  /**
   * 隐藏所有容器中的指定类型遮罩层
   * @param {string} type - 遮罩层类型
   */
  hideAllOverlays(type) {
    const containers = this.getAvailableContainers();
    containers.forEach((containerType) => {
      this.hideOverlay(type, containerType);
    });
  }

  /**
   * 判断选中的单元格需要在哪些容器中显示遮罩层
   * @param {Array} selectedCells - 选中的单元格数组
   * @returns {string[]} 需要显示遮罩层的容器类型数组
   */
  getContainersForCells(selectedCells) {
    if (!selectedCells || selectedCells.length === 0) return [];
    if (!this.tableEl) return ["body"];

    const availableContainers = this.getAvailableContainers();
    const neededContainers = new Set();

    // 检查每个选中的单元格在哪些容器中存在
    selectedCells.forEach((cellInfo) => {
      const { rowIndex, columnIndex } = cellInfo;

      availableContainers.forEach((containerType) => {
        const cellElement = this.getCellElementInContainer(
          rowIndex,
          columnIndex,
          containerType
        );
        if (cellElement) {
          neededContainers.add(containerType);
        }
      });
    });

    return Array.from(neededContainers);
  }

  /**
   * 更新遮罩层位置
   * @param {string} type - 遮罩层类型
   * @param {Object} bounds - 边界信息
   * @param {string} containerType - 容器类型
   */
  updateOverlayPosition(type, bounds, containerType = "body") {
    const overlay = this.overlays[containerType][type].element;
    if (!overlay) return;

    const { left, top, width, height } = bounds;
    overlay.style.left = left + "px";
    overlay.style.top = top + "px";
    overlay.style.width = width + "px";
    overlay.style.height = height + "px";
  }
  /**
   * 为指定类型更新遮罩层
   * @param {string} type - 遮罩层类型
   * @param {Array} cells - 单元格数组
   */
  updateOverlayForType(type, cells) {
    // 先隐藏所有容器中的该类型遮罩层
    this.hideAllOverlays(type);

    if (!cells || cells.length === 0) return;

    // 获取需要显示遮罩层的容器类型
    const neededContainers = this.getContainersForCells(cells);

    // 为每个需要的容器显示遮罩层
    neededContainers.forEach((containerType) => {
      // 计算在该容器中的边界
      const bounds = this.calculateSelectionBounds(cells, containerType);
      if (bounds) {
        this.showOverlay(type, bounds, containerType);
      }
    });
  }

  /**
   * 计算选中区域边界（支持不同容器类型）
   * @param {Array} cells - 单元格数组
   * @param {string} containerType - 容器类型
   * @returns {Object|null} 边界信息
   */
  calculateSelectionBounds(cells, containerType = "body") {
    if (!this.tableEl || !cells || cells.length === 0) return null;

    // 获取容器中实际存在的单元格
    const validCells = cells.filter((cell) => {
      return this.getCellElementInContainer(
        cell.rowIndex,
        cell.columnIndex,
        containerType
      );
    });

    if (validCells.length === 0) return null;

    // 使用工具函数计算边界，但限制在指定容器中
    return calculateSelectionBounds(validCells, this.tableEl, containerType);
  }

  // 获取指定容器中的单元格元素
  getCellElementInContainer(rowIndex, columnIndex, containerType) {
    if (!this.tableEl) return null;
    return getCellElement(this.tableEl, rowIndex, columnIndex, containerType);
  }

  /**
   * 清理所有遮罩层
   */
  cleanupOverlays() {
    this.CONTAINER_TYPES.forEach((containerType) => {
      this.OVERLAY_TYPES.forEach((overlayType) => {
        const overlay = this.overlays[containerType][overlayType];
        if (overlay.element) {
          // 移除DOM元素
          overlay.element.remove();
          // 重置状态
          overlay.element = null;
          overlay.visible = false;
        }
      });
    });
  }

  /**
   * 销毁管理器，清理所有资源
   */
  destroy() {
    this.isDestroyed = true;
    this.cleanupOverlays();
    this.destroyOverlayObserver();

    // 清理引用
    this.tableEl = null;
    this.overlays = null;
  }

  /**
   * 获取填充手柄元素
   * @returns {HTMLElement|null} 填充手柄元素
   */
  getFillHandle() {
    const selectionOverlay = this.overlays.body.selection.element;
    if (!selectionOverlay) return null;

    return selectionOverlay.querySelector(".fill-handle");
  }

  /**
   * 检查遮罩层是否可见
   * @param {string} type - 遮罩层类型
   * @param {string} containerType - 容器类型
   * @returns {boolean} 是否可见
   */
  isOverlayVisible(type, containerType = "body") {
    return this.overlays[containerType][type].visible;
  }

  /**
   * 获取遮罩层元素
   * @param {string} type - 遮罩层类型
   * @param {string} containerType - 容器类型
   * @returns {HTMLElement|null} 遮罩层元素
   */
  getOverlayElement(type, containerType = "body") {
    return this.overlays[containerType][type].element;
  }
}
