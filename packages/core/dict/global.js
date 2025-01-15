import { DictManager } from "./index";
import resolveTemp from "src/template";
import { get } from "lodash-es";

export default function (Vue, globalOpt) {
  const dictManager = new DictManager(Vue, globalOpt);
  const dicts = get(resolveTemp, "dicts");
  if (dicts) dictManager.registerBatch(dicts);
  return dictManager;
}
