import insertSlot from "./insertSlot";
import dialogDrag from "./dialog/drag";
import dialogDragSize from "./dialog/dragSize";

export default function (Vue) {
  Vue.directive("insertSlot", insertSlot);
  Vue.directive("scDialogDrag", dialogDrag);
  Vue.directive("scDialogDragHeight", dialogDragSize);
}
