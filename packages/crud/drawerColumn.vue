<script>
import create from "core/create";
import draggable from "vuedraggable";
import cache from "utils/cache.js";
export default create({
  name: "crud-drawer",
  components: { draggable },
  inject: ["ctx"],
  data() {
    return {
      active: false,
      title: "",
      currentValue: [],
    };
  },
  computed: {
    action() {
      if (this.ctx.crudOptions.action || this.ctx.rowEdit) {
        return [
          {
            prop: "action",
            label: "操作",
          },
        ];
      }
      return [];
    },
    defaultColumns() {
      return this.ctx.defaultColumns || [];
    },
    columns() {
      const columns = [...this.defaultColumns, ...this.listColumns];
      if (this.action.length) columns.push(...this.action);
      return columns;
    },
    listColumns() {
      return this.ctx.columns.filter((item) => !item.hiddenList) || [];
    },
    fixed() {
      return this.ctx.setOptions.fixed;
    },
    hidden: {
      get() {
        return this.ctx.setOptions.hidden;
      },
      set(val) {
        this.ctx.setOptions.hidden = val;
      },
    },
    show: {
      get() {
        return this.columns
          .filter((i) => !this.hidden.includes(i.prop))
          .map((i) => i.prop);
      },
      set(val) {
        this.hidden = this.columns
          .filter((i) => !val.includes(i.prop))
          .map((i) => i.prop);
      },
    },
    isIndeterminate() {
      return this.hidden.length > 0 && this.hidden.length < this.columns.length;
    },
    checkAll: {
      get() {
        return this.show.length === this.columns.length;
      },
      set(val) {
        this.hidden = val ? [] : this.columns.map((i) => i.prop);
      },
    },
  },
  methods: {
    flatColumn(columns) {
      const flattenColumns = [];
      columns.forEach((col) => {
        flattenColumns.push(col);
        if (col.children) {
          const children = this.flatColumn(col.children);
          flattenColumns.push(...children);
        }
      });
      return flattenColumns;
    },
    showDrawer() {
      this.active = true;
    },
    reset() {
      this.ctx.resetLocalCache();
    },
    changeFixed(property, type) {
      this.$set(this.ctx.setOptions.fixed, property, type);
      this.ctx.saveLocalCache();
    },
    handleCheckedChange(value) {
      this.ctx.saveLocalCache();
    },
    onEnd({ newIndex, oldIndex }) {
      const sort = this.ctx.setOptions.sort;
      const endProp = this.listColumns[newIndex].prop;
      const prop = this.listColumns[oldIndex].prop;
      let startIndex, endIndex, adjustment;
      if (oldIndex < newIndex) {
        startIndex = oldIndex + 1;
        endIndex = newIndex + 1;
        adjustment = -1;
      } else if (oldIndex > newIndex) {
        startIndex = newIndex;
        endIndex = oldIndex;
        adjustment = 1;
      } else {
        return;
      }
      const clipColumns = this.listColumns.slice(startIndex, endIndex);
      clipColumns.forEach((item) => {
        if (item.prop !== prop) {
          this.$set(sort, item.prop, item.order + adjustment);
        }
      });
      this.$set(sort, prop, newIndex);
      this.ctx.saveLocalCache();
    },
    renderColumnItems(columns, isDraggable = false) {
      return columns.map((i, index) => (
        <div class="col-item" key={index}>
          <el-checkbox class="col-item--left" label={i.prop} title={i.label}>
            {i.label}
          </el-checkbox>
          <div class="col-item--right">
            {this.renderFixedButtons(i.prop)}
            {isDraggable && !i.type ? (
              <div class={["el-icon-sort", "sort-drag", "mover"]}></div>
            ) : (
              <div style="width: 22px; background: #fff;"></div>
            )}
          </div>
        </div>
      ));
    },
    renderFixedButtons(prop) {
      return (
        <el-button-group>
          {["left", false, "right"].map((direction) => (
            <el-button
              class="fixed-btn"
              icon={direction ? `el-icon-arrow-${direction}` : "el-icon-close"}
              type={
                direction
                  ? this.fixed[prop] === direction
                    ? "primary"
                    : "default"
                  : !this.fixed[prop]
                  ? "primary"
                  : "default"
              }
              onClick={() => this.changeFixed(prop, direction)}
            />
          ))}
        </el-button-group>
      );
    },
  },
  render(h) {
    return (
      <el-drawer
        class={this.b()}
        title="列设置"
        visible_sync={this.active}
        size="300px"
        appendToBody
      >
        <div class="wrapper">
          <el-card shadow="never">
            <div class="header">
              <el-checkbox
                indeterminate={this.isIndeterminate}
                vModel={this.checkAll}
                onChange={this.handleCheckedChange}
              >
                {this.show.length} / {this.columns.length}
              </el-checkbox>
              <span class="title">固定 / 排序</span>
            </div>
            <el-checkbox-group
              class="col-list"
              vModel={this.show}
              onChange={this.handleCheckedChange}
            >
              {this.renderColumnItems(this.defaultColumns)}
              <draggable
                ghostClass="ghost"
                handle=".sort-drag"
                filter=".unMover"
                animation={150}
                vModel={this.currentValue}
                onEnd={this.onEnd}
              >
                {this.renderColumnItems(this.listColumns, true)}
              </draggable>
              {this.renderColumnItems(this.action)}
            </el-checkbox-group>
          </el-card>
          <el-button
            class="reset-btn"
            size="default"
            icon="el-icon-refresh"
            onClick={this.reset}
          >
            重置
          </el-button>
        </div>
      </el-drawer>
    );
  },
});
</script>

<style lang="scss" scoped></style>
