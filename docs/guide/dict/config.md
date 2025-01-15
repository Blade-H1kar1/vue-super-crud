# 配置文档

## 基础配置项

| 配置项       | 类型            | 默认值   | 说明                                       |
| ------------ | --------------- | -------- | ------------------------------------------ |
| request      | Function        | -        | 字典数据请求函数(返回Promise)              |
| label        | String          | label    | 标签字段名                                 |
| value        | String          | value    | 值字段名                                   |
| color        | String          | color    | 颜色字段名                                 |
| children     | String          | children | 子节点字段名                               |
| params       | Object/Function | -        | 请求参数，支持函数形式监听响应式数据变化   |
| immediate    | Boolean         | false    | 是否立即加载，默认为懒加载，即使用时才加载 |
| cache        | Boolean         | true     | 是否启用缓存                               |
| dataPath     | String          | data     | 字典数组的路径                             |
| transform    | Function        | -        | 数据转换函数                               |
| otherPath    | String/Array    | -        | 需要额外获取的数据路径                     |
| debounceTime | Number          | 300      | 防抖时间（毫秒）                           |
| enhanceDict  | Object          | -        | 自定义增强方法                             |
| local        | Boolean         | false    | 是否启用局部字典，组件配置使用时，才有效   |

## 字典方法

| 方法名        | 说明                                              | 参数          |
| ------------- | ------------------------------------------------- | ------------- |
| register      | 注册字典                                          | (key, config) |
| registerBatch | 批量注册字典                                      | (config)      |
| get           | 获取字典                                          | (key, params) |
| clear         | 清空字典，不传参数则清空所有字典                  | (key)         |
| wait          | 等待字典加载完成 ，不传参数则等待所有字典加载完成 | (key)         |

## 字典数据增强方法

每个字典数组都会被自动注入以下方法：

| 方法名           | 说明                        | 返回值  |
| ---------------- | --------------------------- | ------- |
| findLabel(value) | 根据值查找对应的标签        | String  |
| toMap()          | 将字典转换为值-标签映射对象 | Object  |
| values()         | 获取所有值的数组            | Array   |
| labels()         | 获取所有标签的数组          | Array   |
| getOption(value) | 根据值获取完整选项          | Object  |
| wait()           | 等待字典加载完成            | Promise |
| ready            | 字典是否加载完成的变量      | Boolean |
