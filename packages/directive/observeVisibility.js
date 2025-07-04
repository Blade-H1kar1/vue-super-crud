let globalIntersectionObserver = null;
const observerCallbackMap = new WeakMap();
let pendingVisibleRows = [];
let rafId = null;

// 默认分批更新配置
const defaultBatchConfig = {
  batchSize: 8, // 每批处理的元素数量，数值越大渲染越快，但可能导致卡顿
  maxProcessTime: 16, // 每帧最大处理时间（毫秒），防止单帧处理时间过长
  frameInterval: 2, // 批次间的帧间隔，数值越大越平滑，但渲染完成时间越长
};

// 自动查找最近的滚动父元素
function getScrollParent(el) {
  let parent = el;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const overflow = style.overflow;
    if (
      /(auto|scroll|overlay)/.test(overflowY + overflowX + overflow) &&
      (parent.scrollHeight > parent.clientHeight ||
        parent.scrollWidth > parent.clientWidth)
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

// 分批处理可见元素更新
function processBatchUpdate(batchConfig = defaultBatchConfig) {
  const startTime = performance.now();
  let processed = 0;

  // 在时间限制内处理尽可能多的元素
  while (pendingVisibleRows.length > 0 && processed < batchConfig.batchSize) {
    const remainingTime =
      batchConfig.maxProcessTime - (performance.now() - startTime);

    // 如果时间不够，跳出循环
    if (remainingTime <= 0) {
      break;
    }

    const { callback, config } = pendingVisibleRows.shift();
    try {
      callback();
      processed++;
    } catch (error) {
      console.warn("延迟渲染回调执行失败:", error);
    }
  }

  // 如果还有待处理的元素，调度下一批
  if (pendingVisibleRows.length > 0) {
    scheduleNextBatch(batchConfig);
  } else {
    rafId = null;
  }
}

// 调度下一批处理
function scheduleNextBatch(batchConfig = defaultBatchConfig) {
  let frameCount = 0;

  function nextFrame() {
    frameCount++;
    if (frameCount >= batchConfig.frameInterval) {
      rafId = requestAnimationFrame(() => processBatchUpdate(batchConfig));
    } else {
      requestAnimationFrame(nextFrame);
    }
  }

  nextFrame();
}

// 调度可见元素更新
function scheduleVisibleRowsUpdate() {
  if (rafId) return;

  // 获取当前批次的配置（使用最新添加的配置或默认配置）
  const latestConfig =
    pendingVisibleRows.length > 0
      ? pendingVisibleRows[pendingVisibleRows.length - 1].config ||
        defaultBatchConfig
      : defaultBatchConfig;

  // 如果待处理数量较少，直接处理
  if (pendingVisibleRows.length <= latestConfig.batchSize) {
    rafId = requestAnimationFrame(() => {
      pendingVisibleRows.forEach(({ callback }) => {
        try {
          callback();
        } catch (error) {
          console.warn("延迟渲染回调执行失败:", error);
        }
      });
      pendingVisibleRows = [];
      rafId = null;
    });
  } else {
    // 数量较多时使用分批处理
    rafId = requestAnimationFrame(() => processBatchUpdate(latestConfig));
  }
}

function getGlobalIntersectionObserver(root) {
  if (!globalIntersectionObserver || globalIntersectionObserver.root !== root) {
    globalIntersectionObserver = new IntersectionObserver(
      (entries) => {
        // 按可见程度排序，优先处理更可见的元素
        entries.sort((a, b) => {
          if (a.isIntersecting && b.isIntersecting) {
            return b.intersectionRatio - a.intersectionRatio;
          }
          return Number(b.isIntersecting) - Number(a.isIntersecting);
        });

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const observerData = observerCallbackMap.get(entry.target);
            if (observerData) {
              const {
                onVisible,
                batchConfig = defaultBatchConfig,
              } = observerData;

              pendingVisibleRows.push({
                callback: () => onVisible(entry),
                config: batchConfig,
              });
              scheduleVisibleRowsUpdate();
            }
            globalIntersectionObserver.unobserve(entry.target);
            observerCallbackMap.delete(entry.target);
          }
        });
      },
      {
        root,
        rootMargin: "200px 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1.0], // 多个阈值以获得更精确的可见性
      }
    );
  }
  return globalIntersectionObserver;
}

function intersectionObserver(el, options) {
  const { onVisible, rootClass, batchConfig = {}, ...otherOptions } = options;

  // 合并配置
  const finalBatchConfig = { ...defaultBatchConfig, ...batchConfig };

  if (globalIntersectionObserver) {
    globalIntersectionObserver.unobserve(el);
    observerCallbackMap.delete(el);
  }

  const root = el.closest("." + rootClass) || getScrollParent(el);
  const observer = getGlobalIntersectionObserver(root);
  observer.observe(el);

  // 存储回调和配置
  observerCallbackMap.set(el, {
    onVisible,
    batchConfig: finalBatchConfig,
    ...otherOptions,
  });
}

// 全局配置分批更新参数（作为后备）
export function configureBatchUpdate(config) {
  Object.assign(defaultBatchConfig, config);
}

// 获取默认配置
export function getDefaultBatchConfig() {
  return { ...defaultBatchConfig };
}

// 获取当前待处理队列长度（用于调试）
export function getPendingCount() {
  return pendingVisibleRows.length;
}

export default {
  inserted(el, binding) {
    intersectionObserver(el, binding.value);
  },
  componentUpdated(el, binding) {
    intersectionObserver(el, binding.value);
  },
  unbind(el) {
    if (globalIntersectionObserver) {
      globalIntersectionObserver.unobserve(el);
      observerCallbackMap.delete(el);
    }
  },
};
