let globalIntersectionObserver = null;
const observerCallbackMap = new WeakMap();
let pendingVisibleRows = [];
let rafId = null;

// 默认分批更新配置
const defaultBatchConfig = {
  batchSize: 8,
  maxProcessTime: 16,
  frameInterval: 2,
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
      (parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth)
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

// 分批处理可见元素更新 (保持不变)
function processBatchUpdate(batchConfig = defaultBatchConfig) {
  const startTime = performance.now();
  let processed = 0;

  while (pendingVisibleRows.length > 0 && processed < batchConfig.batchSize) {
    const remainingTime = batchConfig.maxProcessTime - (performance.now() - startTime);

    if (remainingTime <= 0) {
      break;
    }

    const task = pendingVisibleRows.shift();
    if (task) {
      const { callback } = task;
      try {
        callback();
        processed++;
      } catch (error) {
        console.warn("延迟渲染回调执行失败:", error);
      }
    }
  }

  if (pendingVisibleRows.length > 0) {
    const nextConfig = pendingVisibleRows[0]?.config || batchConfig;
    scheduleNextBatch(nextConfig);
  } else {
    rafId = null;
  }
}

// 调度下一批处理 (保持不变)
function scheduleNextBatch(batchConfig = defaultBatchConfig) {
  let frameCount = 0;

  function nextFrame() {
    frameCount++;
    if (frameCount >= batchConfig.frameInterval) {
      rafId = requestAnimationFrame(() => processBatchUpdate(batchConfig));
    } else {
      rafId = requestAnimationFrame(nextFrame);
    }
  }

  nextFrame();
}

// 调度可见元素更新 (保持不变)
function scheduleVisibleRowsUpdate() {
  if (rafId) return;

  const latestConfig =
    pendingVisibleRows.length > 0 ? pendingVisibleRows[pendingVisibleRows.length - 1].config || defaultBatchConfig : defaultBatchConfig;

  if (pendingVisibleRows.length <= latestConfig.batchSize) {
    rafId = requestAnimationFrame(() => {
      // 快速处理所有
      while (pendingVisibleRows.length > 0) {
        const task = pendingVisibleRows.shift();
        try {
          task.callback();
        } catch (error) {
          console.warn("延迟渲染回调执行失败:", error);
        }
      }
      rafId = null;
    });
  } else {
    rafId = requestAnimationFrame(() => processBatchUpdate(latestConfig));
  }
}

// 获取 Observer 实例
function getGlobalIntersectionObserver(root) {
  if (!globalIntersectionObserver || globalIntersectionObserver.root !== root) {
    // 如果已存在且 root 不同，先断开旧的
    if (globalIntersectionObserver) globalIntersectionObserver.disconnect();

    globalIntersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          const observerData = observerCallbackMap.get(el);

          if (!observerData) {
            globalIntersectionObserver.unobserve(el);
            return;
          }

          const { onVisible, batchConfig = defaultBatchConfig, delay = 0 } = observerData;

          if (entry.isIntersecting) {
            // === 元素进入视口 ===

            // 如果设置了延迟
            if (delay > 0) {
              // 如果已有计时器（极罕见情况），先清除
              if (observerData.timerId) clearTimeout(observerData.timerId);

              // 设置计时器
              observerData.timerId = setTimeout(() => {
                // 延迟结束后，推入待处理队列
                // 注意：这里没有再次检查 isIntersecting，因为那是浏览器的职责。
                // 如果在 delay 期间元素移出了视口，else 分支会清除这个 timer。
                // 所以能执行到这里，说明元素在 delay 时间内一直保持（或最终保持）在视口内（逻辑上近似）。

                // 为了更严谨，可以在这里再次判断元素是否在文档中等，但通常不需要。

                pendingVisibleRows.push({
                  callback: () => onVisible(entry),
                  config: batchConfig,
                });
                scheduleVisibleRowsUpdate();

                // 任务已提交，停止观察并清理 Map
                globalIntersectionObserver.unobserve(el);
                observerCallbackMap.delete(el);
              }, delay);
            } else {
              // 无延迟，直接推入队列
              pendingVisibleRows.push({
                callback: () => onVisible(entry),
                config: batchConfig,
              });
              scheduleVisibleRowsUpdate();

              globalIntersectionObserver.unobserve(el);
              observerCallbackMap.delete(el);
            }
          } else {
            // === 元素离开视口 ===

            // 如果存在正在进行的延迟计时器，说明用户快速划过，取消任务
            if (observerData.timerId) {
              clearTimeout(observerData.timerId);
              observerData.timerId = null;
            }
          }
        });
      },
      {
        root,
        rootMargin: "200px 0px",
        threshold: [0],
      }
    );
  }
  return globalIntersectionObserver;
}

// 指令初始化逻辑
function intersectionObserver(el, options) {
  let config = {};
  if (typeof options === "function") {
    config = { onVisible: options };
  } else {
    config = options || {};
  }

  const { onVisible, rootClass, batchConfig = {}, delay = 0, ...otherOptions } = config;

  // 合并配置
  const finalBatchConfig = { ...defaultBatchConfig, ...batchConfig };

  // 清理旧的观察
  if (observerCallbackMap.has(el)) {
    const oldData = observerCallbackMap.get(el);
    if (oldData.timerId) clearTimeout(oldData.timerId);
    if (globalIntersectionObserver) globalIntersectionObserver.unobserve(el);
  }

  let root = null;
  if (rootClass) {
    root = el.closest("." + rootClass);
  }
  if (!root) {
    // 只有显式指定了 rootClass 没找到时才 fallback，或者默认自动查找
    root = getScrollParent(el);
  }

  const observer = getGlobalIntersectionObserver(root);
  observer.observe(el);

  // 存储回调和配置
  observerCallbackMap.set(el, {
    onVisible,
    batchConfig: finalBatchConfig,
    delay, // 存储自定义延迟时间
    timerId: null, // 初始化计时器 ID
    ...otherOptions,
  });
}

export function configureBatchUpdate(config) {
  Object.assign(defaultBatchConfig, config);
}

export function getDefaultBatchConfig() {
  return { ...defaultBatchConfig };
}

export function getPendingCount() {
  return pendingVisibleRows.length;
}

export default {
  inserted(el, binding) {
    intersectionObserver(el, binding.value);
  },
  componentUpdated(el, binding) {
    if (binding.value !== binding.oldValue) {
      intersectionObserver(el, binding.value);
    }
  },
  unbind(el) {
    const data = observerCallbackMap.get(el);
    if (data && data.timerId) {
      clearTimeout(data.timerId);
    }
    if (globalIntersectionObserver) {
      globalIntersectionObserver.unobserve(el);
    }
    observerCallbackMap.delete(el);
  },
};
