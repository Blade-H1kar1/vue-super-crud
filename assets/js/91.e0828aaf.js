(window.webpackJsonp=window.webpackJsonp||[]).push([[91],{720:function(e,a,r){"use strict";r.r(a);var s={data:()=>({searchForm:{},data:[{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"识间华中张认",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"},{createTime:"2018-06-02 12:28:47",createUser:94,id:57,idNumber:"8",name:"识间华中张认",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"},{createTime:"2018-06-02 12:28:47",createUser:94,id:58,idNumber:"8",name:"识间华中张认",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"}],isEdit:!0}),computed:{options(){return{freeEdit:this.isEdit,handleRow:{rowAdd:!0,handles:[{label:"控制编辑",type:"primary",onClick:()=>{this.isEdit=!this.isEdit}}]},action:{delete:!0},renderColumns:[{prop:"name",label:"整列编辑1"},{prop:"name",label:"整列编辑2"},{prop:"username",label:"函数控制该行是否编辑",isEdit:({row:e})=>56===e.id,search:{comp:{name:"el-date-picker"}}},{prop:"gender",label:"性别",form:{comp:{name:"el-select",children:[{name:"el-option",label:"男",value:"男"},{name:"el-option",label:"女",value:"女"}]}}}]}}},methods:{add(e){this.$message("新增之前"),e({name:"测试",username:"测试",gender:"男"})}}},t=r(2),d=Object(t.a)(s,(function(){var e=this,a=e._self._c;return a("div",[a("sc-crud",{attrs:{search:e.searchForm,options:e.options,data:e.data},on:{"update:search":function(a){e.searchForm=a},add:e.add}})],1)}),[],!1,null,null,null);a.default=d.exports}}]);