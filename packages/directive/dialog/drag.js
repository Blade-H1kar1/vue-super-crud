// v-dialog-drag: 弹窗拖拽
export default {
  bind(el, binding, vnode, oldVnode) {
    const value = binding.value;
    if (value == false) return;
    // 获取拖拽内容头部
    const dialogHeaderEl = el.querySelector(".el-dialog__header");
    const dragEl = el.querySelector(".dialog-drag");
    const dragDom = el.querySelector(".el-dialog");

    if (!dragDom || !dialogHeaderEl) return; // 修复逻辑运算符
    dragEl.style.cursor = "move";

    // 标记拖拽功能已启用
    el._dragEnabled = true;
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

    // 获取对话框的宽度，但不改变初始位置
    let width = dragDom.style.width;
    if (width.includes("%")) {
      width = +document.body.clientWidth * (+width.replace(/\%/g, "") / 100);
    } else {
      width = +width.replace(/\px/g, "");
    }
    // 鼠标按下事件
    dragEl.onmousedown = (e) => {
      // 如果拖拽被禁用（例如在全屏模式下），则不执行拖拽
      if (el._dragEnabled === false) return;
      // 第一次拖拽时设置为绝对定位，保持初始位置不变
      if (dragDom.style.position !== "absolute") {
        // 获取当前位置信息
        const rect = dragDom.getBoundingClientRect();
        dragDom.style.position = "absolute";
        dragDom.style.left = rect.left + "px";
        dragDom.style.top = rect.top + "px";
        dragDom.style.margin = "0";
      }

      dragDom.style["user-select"] = "none";
      // 鼠标按下，计算当前元素距离可视区的距离 (鼠标点击位置距离可视窗口的距离)
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      // 获取到的值带px 正则匹配替换
      let styL, styT;

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes("%")) {
        styL =
          +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);
        styT =
          +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
      } else {
        styL = +sty.left.replace(/\px/g, "");
        styT = +sty.top.replace(/\px/g, "");
      }

      // 鼠标拖拽事件
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
        const l = e.clientX - disX;
        const t = e.clientY - disY;

        let finallyL = l + styL;
        let finallyT = t + styT;

        // 获取视窗宽高
        const windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;
        const dialogWidth = dragDom.offsetWidth;
        const dialogHeight = dragDom.offsetHeight;

        // 边界值判定，防止拖出可视区域
        // 左边界
        if (finallyL < 0) {
          finallyL = 0;
        }
        // 右边界
        if (finallyL + dialogWidth > windowWidth) {
          finallyL = windowWidth - dialogWidth;
        }
        // 上边界 - 允许一定的上边距（考虑原有的margin-top）
        if (finallyT < 0) {
          finallyT = 0;
        }
        // 下边界
        if (finallyT + dialogHeight > windowHeight) {
          finallyT = windowHeight - dialogHeight;
        }

        // 移动当前元素
        dragDom.style.left = `${finallyL}px`;
        dragDom.style.top = `${finallyT}px`;

        // 可以选择将位置信息传出去
        if (typeof binding.value === "function") {
          binding.value({ x: finallyL, y: finallyT });
        }
      };

      document.onmouseup = function (e) {
        dragDom.style["user-select"] = "auto";
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  },
};
