(window.webpackJsonp=window.webpackJsonp||[]).push([[106],{857:function(e,s,a){"use strict";a.r(s);var t={data:()=>({searchForm:{},options:{action:{view:!0,edit:!0,delete:!0},handleRow:{add:!0},renderColumns:[{prop:"name",label:"昵称",search:!0,form:!0},{prop:"username",label:"姓名",search:{comp:{name:"el-date-picker"}},form:!0},{prop:"gender",label:"性别",form:!0}]},data:[{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"识间华中张认",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋"}]}),methods:{getDetail(e,s,a){this.detailApi().then(s=>{e(s.data),this.$message.success("获取详情")})},add(e,s,a){this.$message.success("新增自定义参数"),e({name:"测试",username:"自定义新增参数",gender:"男"})},edit(e,s,a){e({...s.row,username:"自定义进入编辑时的参数"})},save(e,s,a){console.log(s.mode),"add"===s.mode?this.addApi(s.row).then(a=>{e({...s.row,gender:"自定义保存参数"})}):this.editApi(s.row).then(e=>{}).catch(()=>{a(),this.$message.error("保存失败")})},view(e,s,a){e()},handleDelete(e,s,a){this.deleteApi(s.row).then(s=>{e()})},cancel(e){e(),this.$message.success("取消编辑")},change(e,s){e(),setTimeout(()=>{this.$message.success("change，事件模式："+s.mode)},500)},addApi:e=>new Promise((e,s)=>{setTimeout(()=>{e()},500)}),editApi:e=>new Promise((e,s)=>{setTimeout(()=>{s()},500)}),deleteApi:()=>new Promise((e,s)=>{setTimeout(()=>{e()},500)}),detailApi:e=>new Promise((e,s)=>{setTimeout(()=>{e({code:200,msg:"success",data:{createTime:"2018-06-02 12:28:47",createUser:94,id:56,idNumber:"8",name:"识间华中张认1",password:"sed laboris",phone:"18157668675",gender:"男",age:20,status:35,updateTime:"2018-09-08 16:33:19",updateUser:58,username:"石洋1"}})},500)})}},d=a(2),i=Object(d.a)(t,(function(){var e=this,s=e._self._c;return s("div",[s("sc-crud",{attrs:{search:e.searchForm,options:e.options,data:e.data},on:{"update:search":function(s){e.searchForm=s},view:e.view,add:e.add,edit:e.edit,save:e.save,delete:e.handleDelete,cancel:e.cancel,change:e.change,getDetail:e.getDetail}})],1)}),[],!1,null,null,null);s.default=i.exports}}]);