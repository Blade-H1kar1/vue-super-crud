(window.webpackJsonp=window.webpackJsonp||[]).push([[104],{732:function(e,s,o){"use strict";o.r(s);var r={data:()=>({form:{}}),computed:{renderColumns:()=>[{prop:"name",label:"姓名",required:!0},{prop:"age",label:"年龄",required:!0},{prop:"sex",label:"性别",comp:{name:"el-checkbox-group",options:[{label:"男",value:"男"},{label:"女",value:"女"}]}}]},methods:{openDialog(){const e=this.$createElement;this.$scDialog({title:"弹窗",width:"500px",render:()=>e("sc-form",{ref:"form",attrs:{renderColumns:this.renderColumns},model:{value:this.form,callback:e=>{this.form=e}}}),confirm:async e=>{this.$message.success("确认之前校验表单"),await this.$refs.form.validate(),e(),console.log(this.form,"this.form"),this.$message.success("确认")},cancel:async e=>{this.$message.error("取消之前"),e()}}).show()}}},t=o(2),a=Object(t.a)(r,(function(){var e=this._self._c;return e("div",[e("el-button",{attrs:{size:"small",type:"primary"},on:{click:this.openDialog}},[this._v("confirm 弹窗")])],1)}),[],!1,null,"00d41a50",null);s.default=a.exports}}]);