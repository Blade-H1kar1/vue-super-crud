(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{694:function(e,a,t){"use strict";t.r(a);var s={data(){return{searchForm:{},options:{api:{getList:this.listApi,add:this.addApi,edit:e=>(console.log(e,"param"),this.editApi(e)),delete:this.deleteApi,getDetail:this.detailApi},props:{pageNum:"pageNum",pageSize:"pageSize",listResult:"data",total:"total",detailResult:"data"},isLocal:!0,action:{view:!0,edit:!0,delete:!0},handleRow:{add:!0},renderColumns:[{prop:"name",label:"昵称",search:!0,form:!0},{prop:"username",label:"姓名",search:{comp:{name:"el-date-picker"}},form:!0},{prop:"gender",label:"性别",form:!0}]},data:[]}},methods:{listApi:()=>new Promise((e,a)=>{setTimeout(()=>{e({code:200,data:[{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"识间华中张认",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"},{createTime:"2018-06-02 12:28:47",createUser:94,id:57,idNumber:"8",name:"识间华中张认1",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋11"}],total:2})},1e3)}),detailApi:e=>new Promise((e,a)=>{setTimeout(()=>{e({code:200,msg:"success",data:{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"识间华中张认1",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋1"}})},500)}),addApi:e=>new Promise((a,t)=>{setTimeout(()=>{a(e)},500)}),editApi:e=>new Promise((a,t)=>{setTimeout(()=>{a(e)},500)}),deleteApi:()=>new Promise((e,a)=>{setTimeout(()=>{e()},500)})}},i=t(2),r=Object(i.a)(s,(function(){var e=this,a=e._self._c;return a("div",[a("sc-crud",{attrs:{search:e.searchForm,options:e.options,data:e.data},on:{"update:search":function(a){e.searchForm=a}}})],1)}),[],!1,null,null,null);a.default=r.exports}}]);