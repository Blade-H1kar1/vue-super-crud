(window.webpackJsonp=window.webpackJsonp||[]).push([[117],{862:function(e,a,r){"use strict";r.r(a);r(128);var t={data:()=>({searchForm:{},data:[{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"}]}),computed:{options(){return{handleRow:{handles:[{label:"表格校验",type:"primary",onClick:e=>{e.validate()}},{label:"清除校验",type:"primary",onClick:e=>{e.clearValidate()}}]},action:{delete:!0},renderColumns:[{prop:"name",label:"昵称",isEdit:!0,rules:[{validator:(e,a,r)=>{a?r():r(new Error("error1"))},trigger:"change"}]},{prop:"username",label:"姓名",isEdit:({row:e})=>56===e.id},{prop:"gender",label:"性别",isEdit:this.isEdit,form:{comp:{name:"el-select",children:[{name:"el-option",label:"男",value:"男"},{name:"el-option",label:"女",value:"女"}]}}}]}}},methods:{}},l=r(2),n=Object(l.a)(t,(function(){var e=this,a=e._self._c;return a("div",[a("sc-crud",{attrs:{search:e.searchForm,options:e.options,data:e.data},on:{"update:search":function(a){e.searchForm=a}}})],1)}),[],!1,null,null,null);a.default=n.exports}}]);