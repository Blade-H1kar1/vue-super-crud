(window.webpackJsonp=window.webpackJsonp||[]).push([[168],{889:function(v,_,t){"use strict";t.r(_);var d=t(2),r=Object(d.a)({},(function(){var v=this,_=v._self._c;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"配置文档"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#配置文档"}},[v._v("#")]),v._v(" 配置文档")]),v._v(" "),_("h2",{attrs:{id:"基础配置项"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#基础配置项"}},[v._v("#")]),v._v(" 基础配置项")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("配置项")]),v._v(" "),_("th",[v._v("类型")]),v._v(" "),_("th",[v._v("默认值")]),v._v(" "),_("th",[v._v("说明")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("request")]),v._v(" "),_("td",[v._v("Function")]),v._v(" "),_("td",[v._v("-")]),v._v(" "),_("td",[v._v("字典数据请求函数(返回Promise)")])]),v._v(" "),_("tr",[_("td",[v._v("label")]),v._v(" "),_("td",[v._v("String")]),v._v(" "),_("td",[v._v("label")]),v._v(" "),_("td",[v._v("标签字段名")])]),v._v(" "),_("tr",[_("td",[v._v("value")]),v._v(" "),_("td",[v._v("String")]),v._v(" "),_("td",[v._v("value")]),v._v(" "),_("td",[v._v("值字段名")])]),v._v(" "),_("tr",[_("td",[v._v("color")]),v._v(" "),_("td",[v._v("String")]),v._v(" "),_("td",[v._v("color")]),v._v(" "),_("td",[v._v("颜色字段名")])]),v._v(" "),_("tr",[_("td",[v._v("children")]),v._v(" "),_("td",[v._v("String")]),v._v(" "),_("td",[v._v("children")]),v._v(" "),_("td",[v._v("子节点字段名")])]),v._v(" "),_("tr",[_("td",[v._v("params")]),v._v(" "),_("td",[v._v("Object/Function")]),v._v(" "),_("td",[v._v("-")]),v._v(" "),_("td",[v._v("请求参数，支持函数形式监听响应式数据变化")])]),v._v(" "),_("tr",[_("td",[v._v("immediate")]),v._v(" "),_("td",[v._v("Boolean")]),v._v(" "),_("td",[v._v("false")]),v._v(" "),_("td",[v._v("是否立即加载，默认为懒加载，即使用时才加载")])]),v._v(" "),_("tr",[_("td",[v._v("cache")]),v._v(" "),_("td",[v._v("Boolean")]),v._v(" "),_("td",[v._v("true")]),v._v(" "),_("td",[v._v("是否启用缓存")])]),v._v(" "),_("tr",[_("td",[v._v("dataPath")]),v._v(" "),_("td",[v._v("String")]),v._v(" "),_("td",[v._v("data")]),v._v(" "),_("td",[v._v("字典数组的路径")])]),v._v(" "),_("tr",[_("td",[v._v("transform")]),v._v(" "),_("td",[v._v("Function")]),v._v(" "),_("td",[v._v("-")]),v._v(" "),_("td",[v._v("数据转换函数")])]),v._v(" "),_("tr",[_("td",[v._v("otherPath")]),v._v(" "),_("td",[v._v("String/Array")]),v._v(" "),_("td",[v._v("-")]),v._v(" "),_("td",[v._v("需要额外获取的数据路径")])]),v._v(" "),_("tr",[_("td",[v._v("debounceTime")]),v._v(" "),_("td",[v._v("Number")]),v._v(" "),_("td",[v._v("300")]),v._v(" "),_("td",[v._v("防抖时间（毫秒）")])]),v._v(" "),_("tr",[_("td",[v._v("enhanceDict")]),v._v(" "),_("td",[v._v("Object")]),v._v(" "),_("td",[v._v("-")]),v._v(" "),_("td",[v._v("自定义增强方法")])]),v._v(" "),_("tr",[_("td",[v._v("local")]),v._v(" "),_("td",[v._v("Boolean")]),v._v(" "),_("td",[v._v("false")]),v._v(" "),_("td",[v._v("是否启用局部字典，组件配置使用时，才有效")])])])]),v._v(" "),_("h2",{attrs:{id:"字典方法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#字典方法"}},[v._v("#")]),v._v(" 字典方法")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("方法名")]),v._v(" "),_("th",[v._v("说明")]),v._v(" "),_("th",[v._v("参数")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("register")]),v._v(" "),_("td",[v._v("注册字典")]),v._v(" "),_("td",[v._v("(key, config)")])]),v._v(" "),_("tr",[_("td",[v._v("registerBatch")]),v._v(" "),_("td",[v._v("批量注册字典")]),v._v(" "),_("td",[v._v("(config)")])]),v._v(" "),_("tr",[_("td",[v._v("get")]),v._v(" "),_("td",[v._v("获取字典")]),v._v(" "),_("td",[v._v("(key, params)")])]),v._v(" "),_("tr",[_("td",[v._v("clear")]),v._v(" "),_("td",[v._v("清空字典，不传参数则清空所有字典")]),v._v(" "),_("td",[v._v("(key)")])]),v._v(" "),_("tr",[_("td",[v._v("wait")]),v._v(" "),_("td",[v._v("等待字典加载完成 ，不传参数则等待所有字典加载完成")]),v._v(" "),_("td",[v._v("(key)")])])])]),v._v(" "),_("h2",{attrs:{id:"字典数据增强方法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#字典数据增强方法"}},[v._v("#")]),v._v(" 字典数据增强方法")]),v._v(" "),_("p",[v._v("每个字典数组都会被自动注入以下方法：")]),v._v(" "),_("table",[_("thead",[_("tr",[_("th",[v._v("方法名")]),v._v(" "),_("th",[v._v("说明")]),v._v(" "),_("th",[v._v("返回值")])])]),v._v(" "),_("tbody",[_("tr",[_("td",[v._v("findLabel(value)")]),v._v(" "),_("td",[v._v("根据值查找对应的标签")]),v._v(" "),_("td",[v._v("String")])]),v._v(" "),_("tr",[_("td",[v._v("toMap()")]),v._v(" "),_("td",[v._v("将字典转换为值-标签映射对象")]),v._v(" "),_("td",[v._v("Object")])]),v._v(" "),_("tr",[_("td",[v._v("values()")]),v._v(" "),_("td",[v._v("获取所有值的数组")]),v._v(" "),_("td",[v._v("Array")])]),v._v(" "),_("tr",[_("td",[v._v("labels()")]),v._v(" "),_("td",[v._v("获取所有标签的数组")]),v._v(" "),_("td",[v._v("Array")])]),v._v(" "),_("tr",[_("td",[v._v("getOption(value)")]),v._v(" "),_("td",[v._v("根据值获取完整选项")]),v._v(" "),_("td",[v._v("Object")])]),v._v(" "),_("tr",[_("td",[v._v("wait()")]),v._v(" "),_("td",[v._v("等待字典加载完成")]),v._v(" "),_("td",[v._v("Promise")])]),v._v(" "),_("tr",[_("td",[v._v("ready")]),v._v(" "),_("td",[v._v("字典是否加载完成的变量")]),v._v(" "),_("td",[v._v("Boolean")])])])])])}),[],!1,null,null,null);_.default=r.exports}}]);