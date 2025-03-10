<template>
  <div :class="[b(), { [b('border')]: border || $attrs.type === 'card' }]">
    <!-- 标签页头部 -->
    <el-tabs
      v-model="activeName"
      v-if="tabList.length"
      v-bind="$attrs"
      v-on="omitListeners"
      @tab-click="handleTabClick"
    >
      <!-- 全部标签页 -->
      <el-tab-pane v-if="all" :label="allConfig.label" name="all" />

      <!-- 动态标签页 -->
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="getItemKey(item, index)"
        :label="getItemLabel(item)"
        :name="getItemName(item, index)"
        v-bind="getItem(item)"
      >
        <template #label>
          <i v-if="item.icon" :class="item.icon"></i>
          <slot
            v-if="$scopedSlots[getItemName(item, index) + '-label']"
            :name="getItemName(item, index) + '-label'"
            v-bind="item"
          />
          <template v-else>{{ getItemLabel(item) }}</template>
          <i
            v-if="refresh && cache && activeName === getItemName(item, index)"
            class="el-icon-refresh"
            :class="{ rotating: isRefreshing }"
            title="刷新"
            @click.stop="refreshTab(item, index)"
          />
        </template>
      </el-tab-pane>
    </el-tabs>

    <!-- 插槽内容 -->
    <slot />

    <!-- 标签页内容区 -->
    <div :class="[b('content'), { [b('is-refresh')]: isRefreshing }]">
      <transition-group name="fade-transform" mode="out-in">
        <template v-for="(item, index) in tabList">
          <div
            v-if="shouldRenderTab(item, index)"
            :key="getItemKey(item, index)"
            v-show="currentTab === getItemName(item, index)"
            class="tab-pane"
            :class="{ 'is-active': currentTab === getItemName(item, index) }"
          >
            <slot
              v-if="$scopedSlots[getItemName(item, index)]"
              :name="getItemName(item, index)"
            />
            <Render
              v-else
              v-bind="item"
              :item="item"
              :scope="{
                row: item.value,
              }"
            />
          </div>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { create } from "core";
import { isPlainObject, omit } from "lodash-es";
import Render from "core/components/render";

export default create({
  name: "tabs",

  props: {
    value: {},
    tabList: {
      type: Array,
      default: () => [],
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
    refresh: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Render,
  },

  data() {
    return {
      activeName: "",
      renderedTabs: new Set(),
      currentTab: "",
      isRefreshing: false,
      scope: { row: {} },
    };
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
      return isPlainObject(this.all)
        ? { ...defaultConfig, ...this.all }
        : defaultConfig;
    },
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
        if (!val) return;

        this.handleTabTransition(val);
        this.renderedTabs.add(val);

        const emitValue = this.all && val === "all" ? this.allConfig.name : val;
        this.$emit("input", emitValue);
      },
      immediate: true,
    },

    tabList: {
      handler() {
        this.initActiveName(this.value);
      },
    },
  },

  mounted() {
    // 从路由中恢复激活的标签
    if (this.cacheActive && this.$route?.query.tabActive) {
      this.activeName = this.$route.query.tabActive;
    }
    this.$nextTick(this.updateContentHeight);

    // 创建 ResizeObserver 实例
    this.resizeObserver = new ResizeObserver(() => {
      this.updateContentHeight();
    });

    // 观察活动面板
    this.observeActivePane();
  },
  updated() {
    this.$nextTick(this.updateContentHeight);
  },

  beforeDestroy() {
    // 清理 ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },

  methods: {
    handleTabClick(tab) {
      this.$nextTick(() => {
        if (this.cacheActive) {
          this.updateRouteQuery(this.activeName);
        }
        this.$emit(
          "tab-click",
          tab,
          this.tabList.find(
            (item) => this.getItemName(item) === this.activeName
          )
        );
      });
    },

    initActiveName(val) {
      if (!this.tabList.length) return;

      this.activeName =
        val || (this.all && "all") || this.getItemName(this.tabList[0], 0);
    },

    getItem(item) {
      return isPlainObject(item) ? item : {};
    },

    getItemKey(item, index) {
      return `${item?.label || index}`;
    },

    getItemLabel(item) {
      return item?.label || item;
    },

    getItemName(item, index) {
      return `${item?.name || item?.value || index}`;
    },

    shouldRenderTab(item, index) {
      const tabName = this.getItemName(item, index);
      const shouldCache = item.cache === undefined ? this.cache : item.cache;
      return shouldCache
        ? this.renderedTabs.has(tabName)
        : this.currentTab === tabName;
    },

    updateRouteQuery(val) {
      if (!this.$route) return;

      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          tabActive: val,
        },
      });
    },

    async refreshTab(item, index) {
      if (this.isRefreshing) return;

      this.$emit("refresh", item, index);
      const tabName = this.getItemName(item, index);
      this.isRefreshing = true;

      // 移除缓存
      this.renderedTabs.delete(tabName);
      await this.$nextTick();

      // 重新渲染
      setTimeout(() => {
        this.renderedTabs.add(tabName);
        this.isRefreshing = false;
      }, 300);
    },
    updateContentHeight() {
      // 获取当前激活的面板
      const activePane = this.$el.querySelector(".tab-pane.is-active");
      if (activePane) {
        // 获取面板实际高度并设置给容器
        const height = activePane.offsetHeight;
        const content = this.$el.querySelector(".sc-tabs__content");
        if (content) {
          content.style.height = `${height}px`;
        }
      }
    },
    observeActivePane() {
      const activePane = this.$el.querySelector(".tab-pane.is-active");
      if (activePane && this.resizeObserver) {
        this.resizeObserver.disconnect(); // 先断开之前的观察
        this.resizeObserver.observe(activePane); // 观察新的活动面板
      }
    },

    async handleTabTransition(val) {
      this.currentTab = val;
      await this.$nextTick();
      this.observeActivePane(); // 切换标签页时重新观察
    },
  },
});
</script>
