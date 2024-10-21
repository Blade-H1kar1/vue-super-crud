import rules from "./rules";
import dataFormat from "./dataFormat";
import formatData from "./formatData";
import render from "./render";
import btn from "./btn/index";
import dicts from "./dicts";
import { merge } from "lodash-es";
const template = {
  rules,
  dataFormat,
  formatData,
  render,
  btn,
  dicts,
};

export default template;

export function mergeTemplate(presetType) {
  merge(template, presetType);
}
