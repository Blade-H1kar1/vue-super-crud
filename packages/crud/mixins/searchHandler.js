import dayjs from "dayjs";
import { isFunction } from "lodash-es";
import { isEmptyData } from "utils";

export default {
  methods: {
    // 处理本地搜索
    handleLocalSearch() {
      if (!this.crudOptions.localSearch) return;

      this.localFilteredData = this.data.filter((row) => {
        return Object.entries(this.query).every(([key, value]) => {
          if (isEmptyData(value)) return true;
          if (Array.isArray(value) && value.every(isEmptyData)) return true;

          const column = this.columnsMap[key];
          if (!column) return true;

          const cellValue = row[key];
          if (cellValue === undefined || cellValue === null) return false;

          return this.filterBySearchType(column, cellValue, value, row);
        });
      });

      // 如果使用本地分页,重置到第一页
      if (this.crudOptions.localPagination) {
        const { pageNum } = this.crudOptions.props;
        this.query[pageNum] = 1;
      }
    },
    // 日期类型过滤
    filterDateValue(cellValue, searchValue) {
      if (!cellValue || !searchValue) return true;

      const cellDate = dayjs(cellValue);

      if (Array.isArray(searchValue)) {
        const [startDate, endDate] = searchValue.map((date) => dayjs(date));

        // 检查是否为同一天
        if (startDate.isSame(endDate, "day")) {
          return cellDate.isSame(startDate, "day");
        }

        // 范围查询处理
        if (startDate.isValid() && endDate.isValid()) {
          return (
            (cellDate.isAfter(startDate.startOf("day")) ||
              cellDate.isSame(startDate, "day")) &&
            (cellDate.isBefore(endDate.endOf("day")) ||
              cellDate.isSame(endDate, "day"))
          );
        }

        // 单边范围的处理
        if (startDate.isValid()) {
          return (
            cellDate.isAfter(startDate.startOf("day")) ||
            cellDate.isSame(startDate, "day")
          );
        }
        if (endDate.isValid()) {
          return (
            cellDate.isBefore(endDate.endOf("day")) ||
            cellDate.isSame(endDate, "day")
          );
        }
        return true;
      }

      // 单个日期的处理
      return cellDate.isSame(dayjs(searchValue), "day");
    },

    // 判断两个日期是否是同一天
    isSameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    },

    // 根据搜索类型过滤数据
    filterBySearchType(column, cellValue, value, row) {
      const COMPONENT_MAP = {
        "el-input": "input",
        "el-select": "select",
        "el-date-picker": "date",
        "el-cascader": "cascader",
      };

      const searchType =
        column.search?.type ||
        COMPONENT_MAP[column.search?.comp?.name] ||
        "input";
      if (isFunction(column.search?.filter)) {
        return column.search.filter(cellValue, value, row, this.data);
      }
      switch (searchType) {
        case "input":
          return String(cellValue)
            .toLowerCase()
            .includes(String(value).toLowerCase());

        case "select":
          return String(cellValue) === String(value);

        case "date":
          return this.filterDateValue(cellValue, value);

        default:
          return true;
      }
    },
    // 搜索
    handleSearch() {
      this.changeLoading(true);
      this.runBefore("search", (res) => {
        this.changeLoading();
        this.handleLocalSearch();
        !this.crudOptions.localSearch && this.$nextTick(this.getList);
        this.$emit("closeSearchPopover");
      });
    },
    // 重置
    handleReset(prop) {
      this.changeLoading(true);
      this.runBefore(
        "reset",
        (res) => {
          this.changeLoading();
          const searchRef = this.$refs.searchRef;
          if (!searchRef) return;
          if (prop) {
            searchRef.resetField(prop);
          } else {
            searchRef.resetFields();
            searchRef.searchForm.renderColumns.forEach((item) => {
              if (isFunction(item.reset)) item.reset();
            });
          }
          !this.crudOptions.localSearch && this.$nextTick(this.getList);
          this.crudOptions.localSearch && (this.localFilteredData = undefined);
        },
        prop
      );
    },
  },
};
