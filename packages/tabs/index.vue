<template>
  <div
    :class="[
      b(),
      {
        [b('border')]: border,
      },
    ]"
  >
    <el-tabs
      v-model="activeName"
      v-if="tabList && tabList.length"
      v-bind="$attrs"
      v-on="omitListeners"
      @tab-click="handleTabClick"
    >
      <el-tab-pane v-if="all" :label="allConfig.label" name="all">
      </el-tab-pane>
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="getItemKey(item, index)"
        :label="getItemLabel(item)"
        :name="getItemName(item, index)"
        v-bind="getItem(item)"
      >
        <span slot="label">
          <slot
            v-if="$scopedSlots[getItemName(item, index) + '-label']"
            :name="getItemName(item, index) + '-label'"
            v-bind="item"
          >
          </slot>
          <template v-else>{{ getItemLabel(item) }}</template>
          <i
            v-if="cache && activeName === getItemName(item, index)"
            title="刷新"
            class="el-icon-refresh"
            style="padding: 5px;"
            :class="{ rotating: isRefreshing }"
            @click="refreshTab(item, index)"
          ></i>
        </span>
      </el-tab-pane>
    </el-tabs>
    <slot></slot>
    <div
      :class="{
        [b('content')]: true,
        [b('is-refresh')]: isRefreshing,
      }"
    >
      <transition name="fade-transform" mode="out-in">
        <div v-show="isContentVisible">
          <template v-for="(item, index) in tabList">
            <div
              v-show="currentTab === getItemName(item, index)"
              :key="getItemKey(item, index)"
            >
              <slot
                v-if="shouldShowTab(item, index)"
                :name="getItemName(item, index)"
              ></slot>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { create } from "core";
import { isPlainObject, omit, debounce } from "lodash-es";
export default create({
  name: "tabs",
  props: {
    value: {},
    tabList: {
      type: Array,
      default() {
        return [];
      },
    },
    cache: {
      type: Boolean,
      default: true,
    },
    all: [Boolean, Object],
    border: Boolean,
    cacheActive: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      activeName: "",
      cacheIndex: new Set(),
      isContentVisible: true,
      currentTab: "",
      isRefreshing: false,
    };
  },
  watch: {
    value: {
      handler(val) {
        this.initActiveName(val);
      },
      immediate: true,
    },
    activeName: {
      handler(val) {
        this.handleActiveNameChange(val);
        this.$emit(
          "input",
          this.all && this.activeName == "all"
            ? this.allConfig.name
            : this.activeName
        );
      },
      immediate: true,
    },
    tabList() {
      this.initActiveName(this.value);
    },
  },
  computed: {
    omitListeners() {
      return omit(this.$listeners, ["tab-click", "input"]);
    },
    allConfig() {
      const defaultConfig = {
        label: "全部",
        name: null,
      };
      if (isPlainObject(this.all)) {
        return Object.assign(defaultConfig, this.all);
      }
      return defaultConfig;
    },
  },
  mounted() {
    if (this.cacheActive && this.$route?.query.tabActive) {
      this.activeName = this.$route?.query.tabActive;
    }
  },
  methods: {
    handleTabClick(...args) {
      this.$nextTick(() => {
        this.cacheActive && this.updateRouteQuery(this.activeName);
        this.$emit("tab-click", ...args);
      });
    },
    initActiveName(val) {
      if (this.tabList.length) {
        this.activeName =
          val || (this.all && "all") || this.getItemName(this.tabList[0], 0);
      }
    },
    getItem(item) {
      return isPlainObject(item) ? item : {};
    },
    getItemKey(item, index) {
      return (item?.label || index) + "";
    },
    getItemLabel(item) {
      return item?.label || item;
    },
    getItemName(item, index) {
      return (item?.name || item?.value || index) + "";
    },
    shouldShowTab(item, index) {
      const tabName = this.getItemName(item, index);
      const cache = item.cache === undefined ? this.cache : item.cache;
      return cache ? this.cacheIndex.has(tabName) : this.currentTab === tabName;
    },
    handleActiveNameChange(val) {
      this.handleTabTransition(val);
      this.cacheIndex.add(val);
    },
    updateRouteQuery(val) {
      if (this.$route) {
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...this.$route.query,
            tabActive: val,
          },
        });
      }
    },
    handleTabTransition(val) {
      this.isContentVisible = false;
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.isContentVisible = true;
        this.currentTab = val;
      }, 300);
    },
    async refreshTab(item, index) {
      if (this.isRefreshing) return;
      const tabName = this.getItemName(item, index);
      this.isRefreshing = true;
      this.isContentVisible = false;

      await new Promise((resolve) => setTimeout(resolve, 150));
      this.$forceUpdate();
      this.cacheIndex.delete(tabName);

      await new Promise((resolve) => setTimeout(resolve, 300));
      this.cacheIndex.add(tabName);
      this.isRefreshing = false;
      this.isContentVisible = true;
    },
  },
});
</script>
