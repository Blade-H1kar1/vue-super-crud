// v-dialogDragWidth 可拖动弹窗宽高
export default {
  bind(el, binding) {
    const value = binding.value;
    if (value == false) return;
    const dragDom = el.querySelector(".el-dialog");
    if (!dragDom) return;

    // 标记大小调整功能已启用
    el._dragSizeEnabled = true;

    // 设置最小宽高，防止对话框被调整得太小
    const minWidth = 300; // 最小宽度，单位像素
    const minHeight = 200; // 最小高度，单位像素

    // 创建右下角拖拽元素 - 同时调整宽高
    const cornerEl = document.createElement("div");
    cornerEl.style =
      "width: 20px; background: transparent; height: 20px; position: absolute; right: 0; bottom: 0; margin: auto; z-index: 10; cursor: nwse-resize;";
    cornerEl.className = "dialog-resize-corner";

    // 创建右侧拖拽元素 - 只调整宽度
    const rightEl = document.createElement("div");
    rightEl.style =
      "width: 10px; background: transparent; height: calc(100% - 40px); position: absolute; right: 0; top: 20px; margin: auto; z-index: 10; cursor: ew-resize;";
    rightEl.className = "dialog-resize-right";

    // 创建底部拖拽元素 - 只调整高度
    const bottomEl = document.createElement("div");
    bottomEl.style =
      "width: calc(100% - 40px); background: transparent; height: 10px; position: absolute; bottom: 0; left: 20px; margin: auto; z-index: 10; cursor: ns-resize;";
    bottomEl.className = "dialog-resize-bottom";

    // 通用的设置绝对定位函数
    const setAbsolutePosition = () => {
      if (dragDom.style.position !== "absolute") {
        // 获取当前位置信息
        const rect = dragDom.getBoundingClientRect();
        dragDom.style.position = "absolute";
        dragDom.style.left = rect.left + "px";
        dragDom.style.top = rect.top + "px";
        dragDom.style.margin = "0";
      }
    };

    // 通用的鼠标释放处理函数
    const handleMouseUp = () => {
      dragDom.style["user-select"] = "auto";
      document.onmousemove = null;
      document.onmouseup = null;

      // 可以在这里添加回调函数，通知尺寸已改变
      if (typeof binding.value === "function") {
        binding.value({
          height: dragDom.offsetHeight,
          width: dragDom.offsetWidth,
        });
      }
    };

    // 右下角拖拽 - 同时调整宽高
    cornerEl.addEventListener(
      "mousedown",
      function (e) {
        // 阻止事件冒泡，避免触发对话框的拖拽
        e.stopPropagation();

        // 如果大小调整被禁用（例如在全屏模式下），则不执行调整
        if (el._dragSizeEnabled === false) return;

        // 第一次调整大小时设置为绝对定位，保持初始位置不变
        setAbsolutePosition();

        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX;
        const disY = e.clientY;
        // 当前宽度和高度
        const curWidth = dragDom.offsetWidth;
        const curHeight = dragDom.offsetHeight;
        // 对话框的初始位置
        const initialTop = parseInt(dragDom.style.top) || 0;
        const initialLeft = parseInt(dragDom.style.left) || 0;
        // 获取视窗尺寸
        const windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;
        const windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;

        document.onmousemove = function (e) {
          dragDom.style["user-select"] = "none";
          e.preventDefault(); // 移动时禁用默认事件
          // 计算X轴和Y轴移动距离
          const xl = e.clientX - disX;
          const yl = e.clientY - disY;

          // 计算新宽度和高度
          let newWidth = curWidth + xl;
          let newHeight = curHeight + yl;

          // 应用最小宽高限制
          newWidth = Math.max(newWidth, minWidth);
          newHeight = Math.max(newHeight, minHeight);

          // 确保不超出视窗边界
          if (initialLeft + newWidth <= windowWidth) {
            dragDom.style.width = `${newWidth}px`;
          } else {
            dragDom.style.width = `${windowWidth - initialLeft}px`;
          }

          if (initialTop + newHeight <= windowHeight) {
            dragDom.style.height = `${newHeight}px`;
          } else {
            dragDom.style.height = `${windowHeight - initialTop}px`;
          }
        };

        document.onmouseup = handleMouseUp;
      },
      false
    );

    // 右侧拖拽 - 只调整宽度
    rightEl.addEventListener(
      "mousedown",
      function (e) {
        // 阻止事件冒泡，避免触发对话框的拖拽
        e.stopPropagation();

        // 如果大小调整被禁用（例如在全屏模式下），则不执行调整
        if (el._dragSizeEnabled === false) return;

        // 第一次调整大小时设置为绝对定位，保持初始位置不变
        setAbsolutePosition();

        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX;
        // 当前宽度
        const curWidth = dragDom.offsetWidth;
        // 对话框的初始位置
        const initialLeft = parseInt(dragDom.style.left) || 0;
        // 获取视窗尺寸
        const windowWidth =
          document.documentElement.clientWidth || document.body.clientWidth;

        document.onmousemove = function (e) {
          dragDom.style["user-select"] = "none";
          e.preventDefault(); // 移动时禁用默认事件
          // 计算X轴移动距离
          const xl = e.clientX - disX;

          // 计算新宽度
          let newWidth = curWidth + xl;

          // 应用最小宽度限制
          newWidth = Math.max(newWidth, minWidth);

          // 确保不超出视窗边界
          if (initialLeft + newWidth <= windowWidth) {
            dragDom.style.width = `${newWidth}px`;
          } else {
            dragDom.style.width = `${windowWidth - initialLeft}px`;
          }
        };

        document.onmouseup = handleMouseUp;
      },
      false
    );

    // 底部拖拽 - 只调整高度
    bottomEl.addEventListener(
      "mousedown",
      function (e) {
        // 阻止事件冒泡，避免触发对话框的拖拽
        e.stopPropagation();

        // 如果大小调整被禁用（例如在全屏模式下），则不执行调整
        if (el._dragSizeEnabled === false) return;

        // 第一次调整大小时设置为绝对定位，保持初始位置不变
        setAbsolutePosition();

        // 鼠标按下，计算当前元素距离可视区的距离
        const disY = e.clientY;
        // 当前高度
        const curHeight = dragDom.offsetHeight;
        // 对话框的初始位置
        const initialTop = parseInt(dragDom.style.top) || 0;
        // 获取视窗尺寸
        const windowHeight =
          document.documentElement.clientHeight || document.body.clientHeight;

        document.onmousemove = function (e) {
          dragDom.style["user-select"] = "none";
          e.preventDefault(); // 移动时禁用默认事件
          // 计算Y轴移动距离
          const yl = e.clientY - disY;

          // 计算新高度
          let newHeight = curHeight + yl;

          // 应用最小高度限制
          newHeight = Math.max(newHeight, minHeight);

          // 确保不超出视窗边界
          if (initialTop + newHeight <= windowHeight) {
            dragDom.style.height = `${newHeight}px`;
          } else {
            dragDom.style.height = `${windowHeight - initialTop}px`;
          }
        };

        document.onmouseup = handleMouseUp;
      },
      false
    );

    // 将所有拖拽元素添加到对话框
    dragDom.appendChild(cornerEl);
    dragDom.appendChild(rightEl);
    dragDom.appendChild(bottomEl);
  },
};
