(window.webpackJsonp=window.webpackJsonp||[]).push([[137],{800:function(t,e,a){"use strict";a.r(e);var o={data:()=>({detail:!0,dictData:[{value:"1",label:"张三"},{value:"2",label:"李四"}],data:{name:"张三张三张三张三张三张三张三张三张三张三张三张三张三",gender:"男",checkbox:["1","2"],select:"1",input:"李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四李四"}}),computed:{options(){return{detail:this.detail,columns:3,renderColumns:[{label:"姓名",prop:"name"},{label:"性别",prop:"gender"},{label:"checkbox",prop:"checkbox",comp:{name:"sc-checkbox",options:this.dictData},contentTip:"111111111"},{label:"checkbox",prop:"checkbox",comp:{name:"sc-checkbox",options:this.dictData}},{label:"select",prop:"select",widthSize:2,comp:{name:"sc-select",options:this.dictData}},{label:"input",prop:"input",comp:{type:"textarea"}}]}}}},l=a(2),c=Object(l.a)(o,(function(){var t=this,e=t._self._c;return e("div",[e("div",{staticStyle:{"margin-bottom":"10px"}},[e("el-button",{attrs:{size:"small"},on:{click:function(e){t.detail=!t.detail}}},[t._v("切换模式")]),t._v(" "),e("el-tag",[t._v("当前模式："+t._s(t.detail?"详情":"编辑"))])],1),t._v(" "),e("sc-form",{attrs:{options:t.options,border:""},model:{value:t.data,callback:function(e){t.data=e},expression:"data"}})],1)}),[],!1,null,null,null);e.default=c.exports}}]);