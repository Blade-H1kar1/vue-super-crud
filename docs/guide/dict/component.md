# 字典组件
## 展示组件
### DateFormat 日期格式化
用于格式化日期时间的展示。

| 参数        | 说明                                     | 类型   | 默认值              |
| ----------- | ---------------------------------------- | ------ | ------------------- |
| value       | 日期时间值，支持long、string、date等格式 | any    | -                   |
| valueFormat | 输入格式化，不传则由dayjs自动转化        | string | -                   |
| format      | 输出格式化                               | string | YYYY-MM-DD HH:mm:ss |
### ValueFormat 值格式化
用于将值格式化为标签形式展示。

| 参数        | 说明                                                   | 类型         | 默认值                                      |
| ----------- | ------------------------------------------------------ | ------------ | ------------------------------------------- |
| value       | 需要格式化的值，多选支持'1,2,3'或[1,2,3]               | string/array | -                                           |
| multiple    | 是否多选                                               | boolean      | true                                        |
| separator   | 多选值的分隔符                                         | string       | ,                                           |
| color       | 标签颜色，支持auto/primary/success/warning/danger/info | string       | -                                           |
| effect      | 标签主题                                               | string       | -                                           |
| autoColors  | 自动颜色列表                                           | array        | ['primary', 'success', 'warning', 'danger'] |
| autoEffects | 自动主题列表                                           | array        | ['light', 'plain']                          |
| scope       | 其他组件传入的参数                                     | object       | -                                           |
| props       | 配置选项                                               | object       | {value:'value', label:'label'}              |
### CascadeFormat 级联数据格式化
用于格式化级联数据的展示。

| 参数      | 说明                                                            | 类型         | 默认值                         |
| --------- | --------------------------------------------------------------- | ------------ | ------------------------------ |
| value     | 级联值，单选时支持'1,2,3'或[1,2,3]，多选时支持[[1,2,3],[4,5,6]] | string/array | -                              |
| separator | 值的分隔符                                                      | string       | ,                              |
| multiple  | 是否多选                                                        | boolean      | false                          |
| scope     | 其他组件传入的参数                                              | object       | -                              |
| options   | 可选项数据源                                                    | array        | -                              |
| props     | 配置选项                                                        | object       | {value:'value', label:'label'} |
## 表单组件

`el-select`,`el-cascader`,`el-checkbox-group`,`el-radio-group`,`el-switch`组件在使用`comp`进行组件渲染时已默认映射为封装的字典组件

### Select 选择器
基于el-select的字典选择器。

| 参数      | 说明                             | 类型                        | 默认值                         |
| --------- | -------------------------------- | --------------------------- | ------------------------------ |
| value     | 选中值，多选支持'1,2,3'或[1,2,3] | number/string/boolean/array | -                              |
| separator | 多选值的分隔符                   | string                      | ,                              |
| multiple  | 是否多选                         | boolean                     | false                          |
| scope     | 其他组件传入的参数               | object                      | -                              |
| options   | 可选项数据源                     | array                       | -                              |
| props     | 配置选项                         | object                      | {value:'value', label:'label'} |
### Switch 开关
基于el-switch的字典开关。

| 参数    | 说明               | 类型   | 默认值                         |
| ------- | ------------------ | ------ | ------------------------------ |
| value   | 开关值             | any    | -                              |
| scope   | 其他组件传入的参数 | object | -                              |
| options | 可选项数据源       | array  | -                              |
| props   | 配置选项           | object | {value:'value', label:'label'} |
### Radio 单选框
基于el-radio-group的字典单选框。

| 参数    | 说明                                        | 类型   | 默认值                         |
| ------- | ------------------------------------------- | ------ | ------------------------------ |
| value   | 选中值                                      | any    | -                              |
| type    | 单选框类型，可选值:el-radio/el-radio-button | string | el-radio                       |
| scope   | 其他组件传入的参数                          | object | -                              |
| options | 可选项数据源                                | array  | -                              |
| props   | 配置选项                                    | object | {value:'value', label:'label'} |
### Checkbox 复选框
基于el-checkbox-group的字典复选框。

| 参数      | 说明                                              | 类型                        | 默认值                         |
| --------- | ------------------------------------------------- | --------------------------- | ------------------------------ |
| value     | 选中值，多选支持'1,2,3'或[1,2,3]                  | number/string/boolean/array | -                              |
| separator | 值的分隔符                                        | string                      | ,                              |
| type      | 复选框类型，可选值:el-checkbox/el-checkbox-button | string                      | el-checkbox                    |
| scope     | 其他组件传入的参数                                | object                      | -                              |
| options   | 可选项数据源                                      | array                       | -                              |
| props     | 配置选项                                          | object                      | {value:'value', label:'label'} |
### Cascade 级联选择器
基于el-cascader的字典级联选择器。

| 参数    | 说明                             | 类型   | 默认值 |
| ------- | -------------------------------- | ------ | ------ |
| value   | 选中值，多选支持'1,2,3'或[1,2,3] | array  | []     |
| scope   | 其他组件传入的参数               | object | -      |
| options | 可选项数据源                     | array  | -      |