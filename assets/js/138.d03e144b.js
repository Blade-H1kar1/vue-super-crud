(window.webpackJsonp=window.webpackJsonp||[]).push([[138],{801:function(t,e,a){"use strict";a.r(e);var l={data:()=>({detail:!0,dictData:[{value:"1",label:"张三"},{value:"2",label:"李四"}],data:{name:"张三",gender:"男",checkbox:["1","2"],select:"1"}}),computed:{options(){return{columns:2,columnGap:"10px",renderColumns:[{label:"姓名",prop:"name"},{label:"性别",prop:"gender"},{label:"checkbox",prop:"checkbox",isDetail:this.detail,comp:{name:"sc-checkbox",options:this.dictData}},{label:"select",prop:"select",isDetail:this.detail,comp:{name:"sc-select",options:this.dictData}}]}}}},o=a(2),c=Object(o.a)(l,(function(){var t=this,e=t._self._c;return e("div",[e("div",{staticStyle:{"margin-bottom":"10px"}},[e("el-button",{attrs:{size:"small"},on:{click:function(e){t.detail=!t.detail}}},[t._v("切换模式")]),t._v(" "),e("el-tag",[t._v("当前模式："+t._s(t.detail?"详情":"编辑"))])],1),t._v(" "),e("sc-form",{attrs:{options:t.options},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}})],1)}),[],!1,null,null,null);e.default=c.exports}}]);