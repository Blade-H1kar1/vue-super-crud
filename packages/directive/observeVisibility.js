let globalIntersectionObserver = null;
const observerCallbackMap = new WeakMap();
let pendingVisibleRows = [];
let rafId = null;

// 自动查找最近的滚动父元素
function getScrollParent(el) {
  let parent = el;
  while (parent) {
    // 获取样式
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    const overflowX = style.overflowX;
    const overflow = style.overflow;
    // 判断是否为可滚动
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

function scheduleVisibleRowsUpdate() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    pendingVisibleRows.forEach((cb) => cb());
    pendingVisibleRows = [];
    rafId = null;
  });
}

function getGlobalIntersectionObserver(root) {
  if (!globalIntersectionObserver || globalIntersectionObserver.root !== root) {
    globalIntersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbackMap.get(entry.target);
            if (cb) {
              pendingVisibleRows.push(() => cb(entry));
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
        threshold: 0.1,
      }
    );
  }
  return globalIntersectionObserver;
}

function intersectionObserver(el, { onVisible, rootClass }) {
  if (globalIntersectionObserver) {
    globalIntersectionObserver.unobserve(el);
    observerCallbackMap.delete(el);
  }
  const root = el.closest("." + rootClass) || getScrollParent(el);
  const observer = getGlobalIntersectionObserver(root);
  observer.observe(el);
  observerCallbackMap.set(el, onVisible);
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
