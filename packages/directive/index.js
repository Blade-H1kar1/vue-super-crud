import insertSlot from "./insertSlot";
import dialogDrag from "./dialog/drag";
import dialogDragSize from "./dialog/dragSize";
import dialogFullscreen from "./dialog/fullscreen";
import observeVisibility from "./observeVisibility";

export default function (Vue) {
  Vue.directive("insertSlot", insertSlot);
  Vue.directive("scDialogDrag", dialogDrag);
  Vue.directive("scDialogDragHeight", dialogDragSize);
  Vue.directive("scDialogFullscreen", dialogFullscreen);
  Vue.directive("scObserveVisibility", observeVisibility);
}
