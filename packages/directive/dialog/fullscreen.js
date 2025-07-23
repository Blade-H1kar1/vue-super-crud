// v-dialogFullscreen 弹窗最大化指令
export default {
  bind(el, binding) {
    const value = binding.value;
    if (value === false) return;

    // 获取弹窗元素
    const dialogHeaderEl = el.querySelector(".el-dialog__header");
    const dialogEl = el.querySelector(".el-dialog");
    if (!dialogEl || !dialogHeaderEl) return;

    // 创建一个对象来存储原始样式
    if (!dialogEl._originalStyle) {
      dialogEl._originalStyle = {
        width: "",
        height: "",
        top: "",
        left: "",
        margin: "",
        position: "",
      };
    }

    // 为弹窗添加一个标记，表示是否处于全屏状态
    dialogEl._isFullscreen = false;

    // 查找最大化按钮
    const fullscreenBtn =
      dialogHeaderEl.querySelector(".el-icon-full-screen") ||
      dialogHeaderEl.querySelector(".el-icon-news");

    if (!fullscreenBtn) return;

    // 移除原有的点击事件（如果有的话）
    fullscreenBtn.onclick = null;

    // 添加新的点击事件
    fullscreenBtn.addEventListener("click", function (e) {
      e.stopPropagation();

      // 切换全屏状态
      dialogEl._isFullscreen = !dialogEl._isFullscreen;

      // 更新图标
      if (fullscreenBtn.classList.contains("el-icon-full-screen")) {
        fullscreenBtn.classList.remove("el-icon-full-screen");
        fullscreenBtn.classList.add("el-icon-news");
      } else {
        fullscreenBtn.classList.remove("el-icon-news");
        fullscreenBtn.classList.add("el-icon-full-screen");
      }

      if (dialogEl._isFullscreen) {
        // 保存当前样式，只在第一次最大化时保存
        if (!dialogEl._originalStyle.saved) {
          dialogEl._originalStyle.width = dialogEl.style.width;
          dialogEl._originalStyle.height = dialogEl.style.height;
          dialogEl._originalStyle.top = dialogEl.style.top;
          dialogEl._originalStyle.left = dialogEl.style.left;
          dialogEl._originalStyle.margin = dialogEl.style.margin;
          dialogEl._originalStyle.position = dialogEl.style.position;
          dialogEl._originalStyle.saved = true;
        }

        // 获取视窗尺寸
        const windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;

        // 设置全屏样式
        dialogEl.style.position = "fixed";
        dialogEl.style.top = "0";
        dialogEl.style.left = "0";
        dialogEl.style.width = windowWidth + "px";
        dialogEl.style.height = windowHeight + "px";
        dialogEl.style.margin = "0";

        // 禁用拖拽和调整大小
        if (el._dragEnabled) {
          el._dragEnabled = false;
          el._dragEnabledPrev = true;
        }
        if (el._dragSizeEnabled) {
          el._dragSizeEnabled = false;
          el._dragSizeEnabledPrev = true;
        }
      } else {
        // 恢复原始样式
        if (dialogEl._originalStyle.saved) {
          dialogEl.style.position = dialogEl._originalStyle.position || "";
          dialogEl.style.top = dialogEl._originalStyle.top || "";
          dialogEl.style.left = dialogEl._originalStyle.left || "";
          dialogEl.style.width = dialogEl._originalStyle.width || "";
          dialogEl.style.height = dialogEl._originalStyle.height || "";
          dialogEl.style.margin = dialogEl._originalStyle.margin || "";
        } else {
          // 如果没有保存过原始样式，则使用默认样式
          dialogEl.style.position = "";
          dialogEl.style.top = "";
          dialogEl.style.left = "";
          dialogEl.style.width = "";
          dialogEl.style.height = "";
          dialogEl.style.margin = "";
        }

        // 恢复拖拽和调整大小
        if (el._dragEnabledPrev) {
          el._dragEnabled = true;
          el._dragEnabledPrev = false;
        }
        if (el._dragSizeEnabledPrev) {
          el._dragSizeEnabled = true;
          el._dragSizeEnabledPrev = false;
        }
      }

      // 触发窗口大小变化事件，让内部组件可以响应
      window.dispatchEvent(new Event("resize"));
    });
  },

  // 在组件更新时确保指令仍然有效
  update(el, binding) {
    if (binding.value === binding.oldValue) return;
    if (binding.value === false) {
      // 如果指令被禁用，恢复原始状态
      const dialogEl = el.querySelector(".el-dialog");
      if (dialogEl && dialogEl._isFullscreen) {
        // 找到最大化按钮并触发点击事件来恢复
        const dialogHeaderEl = el.querySelector(".el-dialog__header");
        if (dialogHeaderEl) {
          const fullscreenBtn = dialogHeaderEl.querySelector(".el-icon-news");
          if (fullscreenBtn) {
            fullscreenBtn.click();
          }
        }
      }
    }
  },

  // 在组件解绑时清理
  unbind(el) {
    const dialogEl = el.querySelector(".el-dialog");
    if (dialogEl) {
      // 清理存储的状态
      delete dialogEl._isFullscreen;
      delete dialogEl._originalStyle;
    }

    // 清理拖拽状态
    delete el._dragEnabled;
    delete el._dragEnabledPrev;
    delete el._dragSizeEnabled;
    delete el._dragSizeEnabledPrev;
  },
};
