export default {
  action: {
    // rowEdit: (item, { ctx }) => {
    //   return {
    //     icon: "el-icon-edit",
    //     label: "编辑",
    //     onClick: (scope) => {
    //       ctx.handleRowEdit(scope);
    //     },
    //   };
    // },
    // rowSave: (item, { ctx }) => ({
    //   icon: "el-icon-circle-check",
    //   label: "保存",
    //   onClick: (scope) => {
    //     ctx.handleRowSave(scope);
    //   },
    // }),
    // rowCancel: (item, { ctx }) => ({
    //   icon: "el-icon-circle-close",
    //   label: "取消",
    //   onClick: (scope) => {
    //     ctx.handleRowCancel(scope);
    //   },
    // }),
    // view: (item, { ctx }) => ({
    //   icon: "el-icon-view",
    //   label: "查看",
    //   onClick: (scope) => {
    //     ctx.handleView(scope);
    //   },
    // }),
    // edit: (item, { ctx }) => {
    //   return {
    //     icon: "el-icon-edit",
    //     label: "编辑",
    //     onClick: (scope) => {
    //       ctx.handleEdit(scope);
    //     },
    //   };
    // },
    // delete: (item, { ctx }) => ({
    //   icon: "el-icon-delete",
    //   label: "删除",
    //   onClick: (scope) => {
    //     ctx.handleDelete(scope);
    //   },
    // }),
  },
  handleRow: {
    // add: (item, scope) => ({
    //   icon: "el-icon-plus",
    //   label: "新增",
    //   type: "primary",
    //   onClick: () => {
    //     scope.ctx.handleAdd();
    //   },
    // }),
    // batchDelete: (item, scope) => ({
    //   icon: "el-icon-delete",
    //   label: "删除",
    //   type: "danger",
    //   onClick: () => {
    //     scope.ctx.handleBatchDelete();
    //   },
    // }),
    // rowAdd: (item, scope) => ({
    //   icon: "el-icon-plus",
    //   label: "新增",
    //   type: "primary",
    //   onClick: () => {
    //     scope.ctx.handleRowAdd();
    //   },
    // }),
  },
  toolbar: {
    // zoom: (item, scope) => ({
    //   icon: "el-icon-full-screen",
    //   title: "最大化",
    //   onClick: () => {
    //     scope.ctx.isMaximize = !scope.ctx.isMaximize;
    //   },
    // }),
    // reset: (item, scope) => ({
    //   icon: "el-icon-refresh",
    //   title: "重置",
    //   onClick: () => {
    //     scope.ctx.$refs.searchRef.handleReset();
    //   },
    // }),
    // search: (item, scope) => ({
    //   icon: "el-icon-search",
    //   title: "查询",
    //   onClick: () => {
    //     scope.ctx.showSearch = !scope.ctx.showSearch;
    //   },
    // }),
    // column: (item, scope) => ({
    //   icon: "el-icon-set-up",
    //   title: "列设置",
    //   onClick: () => {
    //     scope.self.showDrawerColumn();
    //   },
    // }),
  },
  contextMenu: {
    copy: (item, scope) => ({
      label: "复制内容",
      icon: "el-icon-document-copy",
      divided: true,
      onClick: () => {
        let save = function (e) {
          e.clipboardData.setData("text/plain", scope.event.target.innerText);
          e.preventDefault(); //阻止默认行为
        };
        document.addEventListener("copy", save); //添加一个copy事件
        document.execCommand("copy"); //执行copy方法
        document.removeEventListener("copy", save); //移除copy事件
        scope.ctx.$message.success("复制成功");
      },
    }),
    copyData: (item, { ctx, col, ...scope }) => ({
      label: "复制单元格数据",
      icon: "el-icon-document-copy",
      hidden: !ctx.validateEdit(col, scope),
      onClick: () => {
        ctx.copyTarget = scope.row[col.prop];
        ctx.$message.success("复制成功");
      },
    }),
    singleEdit: (item, { ctx, col, ...scope }) => ({
      label: "修改单元格数据",
      icon: "el-icon-edit",
      hidden: !ctx.validateEdit(col, scope),
      onClick: () => {
        if (ctx.validateEdit(col, scope)) {
          ctx.$set(scope.row, col.prop, ctx.copyTarget);
        }
      },
    }),
    allEdit: (item, { ctx, col, ...scope }) => ({
      label: "批量修改全部数据",
      icon: "el-icon-edit",
      hidden: !ctx.validateEdit(col, scope),
      onClick: () => {
        ctx.tableForm.list.forEach((i) => {
          if (ctx.validateEdit(col, scope)) {
            ctx.$set(i, col.prop, ctx.copyTarget);
          }
        });
      },
    }),
    sameEdit: (item, { ctx, col, ...scope }) => ({
      label: "批量修改相同数据",
      icon: "el-icon-edit",
      divided: true,
      hidden: !ctx.validateEdit(col, scope),
      onClick: () => {
        const indexList = [];
        ctx.tableForm.list.forEach((i) => {
          if (i[col.prop] == scope.row[col.prop]) indexList.push(i);
        });
        indexList.forEach((i) => {
          if (ctx.validateEdit(col, scope)) {
            ctx.$set(i, col.prop, ctx.copyTarget);
          }
        });
      },
    }),
  },
};
