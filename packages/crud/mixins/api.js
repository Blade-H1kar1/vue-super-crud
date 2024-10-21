import { cloneDeep, get } from "lodash-es";
import { executeFunction } from "utils";
// TODO 本地crud待优化， getList
export default {
  computed: {
    api() {
      return this.crudOptions.api;
    },
    isLocal() {
      return this.crudOptions.local;
    },
    props() {
      return this.crudOptions.props;
    },
  },
  methods: {
    handlePromise(isLoading, fn) {
      if (isLoading) this.changeLoading(true);
      return fn();
    },
    getList() {
      this.$emit("getList");
      // this.changeLoading(true);
      // const callBack = (res) => {
      //   if (res) {
      //     this.list = get(res, this.props.listResult) || [];
      //     // this.total = get(res, this.props.total) || 0;
      //     this.processList(this.list);
      //   }
      //   this.changeLoading();
      // };

      // this.runBefore("getList", callBack, this.query, this.changeLoading);
      // this.handlePromise(true, () => {
      //   if (this.api.getList) {
      //     return this.api.getList(this.query);
      //   } else {
      //     return new Promise((resolve, reject) => {
      //       this.runBefore(
      //         "getList",
      //         (res) => resolve(res),
      //         this.query,
      //         reject
      //       );
      //     });
      //   }
      // })
      //   .then((res) => {
      //     if (res) {
      //       this.list = get(res, this.props.listResult);
      //       this.total = get(res, this.props.total);
      //       this.processList(this.list);
      //       this.runAfter("getList", {
      //         list: this.list,
      //         total: this.total,
      //       });
      //     }
      //   })
      //   .finally(() => {
      //     this.changeLoading(false);
      //   });
    },
    // getDetail(scope) {
    //   this.changeDialogLoading(true);
    //   const callBack = (res) => {
    //     this.form = get(res, this.props.detailResult) || cloneDeep(scope.row);
    //     this.changeDialogLoading();
    //   };
    //   this.runBefore("getDetail", callBack, scope, this.changeDialogLoading);
    //   // this.handlePromise(false, () => {
    //   //   if (this.api.getDetail) {
    //   //     return this.api.getDetail(scope.row);
    //   //   } else {
    //   //     return new Promise((resolve, reject) => {
    //   //       this.runBefore("getDetail", (res) => resolve(res), scope, reject);
    //   //     });
    //   //   }
    //   // })
    //   //   .then((res) => {
    //   //     this.form = get(res, this.props.detailResult) || { ...scope.row };
    //   //     this.runAfter("getDetail", this.form);
    //   //   })
    //   //   .finally(() => {
    //   //     this.changeDialogLoading(false);
    //   //   });
    // },
    // addRequest(scope, closeDialog) {
    //   const events = closeDialog
    //     ? ["save", "change", "close"]
    //     : ["save", "change"];
    //   this.handlePromise(closeDialog ? false : true, () => {
    //     if (this.api.add) {
    //       return this.api.add(scope.row);
    //     } else {
    //       return new Promise((resolve, reject) => {
    //         this.runBefore(
    //           events,
    //           (newRow) => resolve(newRow),
    //           {
    //             row: scope.row,
    //             mode: "add",
    //           },
    //           reject
    //         );
    //       });
    //     }
    //   })
    //     .then((newRow) => {
    //       if (closeDialog) {
    //         this.list.push(newRow || scope.row);
    //         closeDialog();
    //       } else {
    //         newRow && this.$set(this.list, scope.$index, newRow);
    //       }
    //       this.successTip(scope);
    //       this.getList();
    //       this.editX = null;
    //       this.runAfter(events, newRow);
    //     })
    //     .catch(() => {
    //       this.changeLoading(false);
    //       this.changeDialogLoading(false);
    //     });
    // },
    // editRequest(scope, closeDialog) {
    //   const events = closeDialog
    //     ? ["save", "change", "close"]
    //     : ["save", "change"];
    //   this.handlePromise(closeDialog ? false : true, () => {
    //     if (this.api.edit) {
    //       return this.api.edit(scope.row);
    //     } else {
    //       return new Promise((resolve, reject) => {
    //         this.runBefore(
    //           events,
    //           (newRow) => resolve(newRow),
    //           {
    //             ...scope,
    //             mode: "edit",
    //           },
    //           reject
    //         );
    //       });
    //     }
    //   })
    //     .then((newRow) => {
    //       if (closeDialog) {
    //         this.$set(this.list, scope.$index, newRow || scope.row);
    //         closeDialog();
    //       } else {
    //         newRow && this.$set(this.list, scope.$index, newRow);
    //       }
    //       this.successTip(scope);
    //       this.getList();
    //       this.editX = null;
    //       this.runAfter(events, newRow);
    //     })
    //     .catch(() => {
    //       this.changeLoading(false);
    //       this.changeDialogLoading(false);
    //     });
    // },
    // batchDeleteRequest(arr) {
    //   this.handlePromise(true, () => {
    //     if (this.api.delete) {
    //       return this.api.delete(arr);
    //     } else {
    //       return new Promise((resolve, reject) => {
    //         this.runBefore(
    //           ["delete", "change"],
    //           () => resolve(),
    //           {
    //             row: arr,
    //             mode: "delete",
    //           },
    //           reject
    //         );
    //       });
    //     }
    //   })
    //     .then(() => {
    //       if (this.isLocal) {
    //         const deleteIndex = arr.map((item) => item.$index);
    //         this.list = this.list.filter(
    //           (item) => !deleteIndex.includes(item.$index)
    //         );
    //       }
    //       this.successTip(scope);
    //       this.getList();
    //       this.runAfter(["delete", "change"]);
    //     })
    //     .catch(() => {
    //       this.changeLoading(false);
    //     });
    // },
    // deleteRequest(scope) {
    //   this.handlePromise(true, () => {
    //     if (this.api.delete) {
    //       return this.api.delete(scope.row);
    //     } else {
    //       return new Promise((resolve, reject) => {
    //         this.runBefore(
    //           ["delete", "change"],
    //           () => resolve(),
    //           {
    //             ...scope,
    //             mode: "delete",
    //           },
    //           reject
    //         );
    //       });
    //     }
    //   })
    //     .then(() => {
    //       if (this.isLocal) {
    //         this.list.splice(scope.$index, 1);
    //       }
    //       this.successTip(scope);
    //       this.getList();
    //       this.runAfter(["delete", "change"]);
    //     })
    //     .catch(() => {
    //       this.changeLoading(false);
    //     });
    // },
    successTip(scope) {
      if (this.crudOptions.successTip === false) return;
      const successTip =
        executeFunction(this.crudOptions.successTip, scope) || "操作成功";
      this.$message.success(successTip);
    },
  },
};
