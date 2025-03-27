import { cloneDeep } from "lodash-es";
import formComp from "../form";
import dialog from "pak/dialog";
export default {
  data() {
    this.title = {
      add: "新增",
      edit: "编辑",
      view: "查看",
    };
    return {
      dialogLoading: false, //弹窗与内部表单loading
    };
  },
  computed: {
    dialogOptions() {
      return this.crudOptions.dialog;
    },
  },
  watch: {
    dialogLoading(val) {
      this.$refs.dialogVm && (this.$refs.dialogVm.loading = val);
    },
  },
  methods: {
    changeDialogLoading(bool = false) {
      this.dialogLoading = bool;
    },
    handleAdd(addType) {
      this.runBefore(
        ["add"],
        (data = {}) => {
          this.form = data;
          this.openDialogForm("add", {}, addType);
        },
        { mode: "add" }
      );
    },
    handleView(scope) {
      const callBack = (data) => {
        this.openDialogForm("view", scope);
        this.getDetail(scope, data);
      };
      this.runBefore(["view"], callBack, { ...scope, mode: "view" });
    },
    getDetail(scope, data) {
      this.changeDialogLoading(true);
      const callBack = (dataNew) => {
        this.form = data || dataNew || cloneDeep(scope.row);

        this.changeDialogLoading();
      };
      this.runBefore("getDetail", callBack, scope, this.changeDialogLoading);
    },
    handleEdit(scope) {
      const callBack = (data) => {
        this.openDialogForm("edit", scope);
        this.getDetail(scope, data);
      };
      this.runBefore(["edit"], callBack, { ...scope, mode: "view" });
    },
    handleSave(scope, done, addType) {
      this.$refs.crudForm.validate().then(() => {
        this.changeDialogLoading(true);
        const callBack = (row) => {
          if (scope.mode === "add") {
            if (addType === "first") {
              this.list.unshift(row || this.form);
            } else {
              this.list.push(row || this.form);
            }
          } else {
            this.$set(this.list, scope.$index, row || this.form);
          }

          done();
          this.changeDialogLoading();
          this.getList();
        };
        this.runBefore(["save"], callBack, scope, this.changeDialogLoading);
      });
    },

    openDialogForm(mode, scope = {}, addType) {
      scope = { ...scope, row: this.form, mode };
      this.$refs.dialogVm = dialog({
        title: this.title[mode],
        render: () => (
          <formComp
            loading={this.dialogLoading}
            ctx={this}
            mode={mode}
            scope={scope}
          />
        ),
        confirm: (done) => {
          const params = {
            ...scope,
            formRef: this.$refs.crudForm,
          };
          this.handleSave(params, done, addType);
        },
        footer: mode === "view" ? false : true,
        ...this.dialogOptions,
      });
      this.$refs.dialogVm.show();
    },
  },
};
