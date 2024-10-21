<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <sidebar-item
            v-for="route in routes"
            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="main-container">
      <app-main />
    </div>
  </div>
</template>

<script>
import sidebarItem from "./components/SidebarItem.vue";
import variables from "#/styles/variables.scss";
import AppMain from "./components/AppMain.vue";

export default {
  name: "Layout",
  components: {
    sidebarItem,
    // Navbar,
    AppMain,
  },
  computed: {
    variables() {
      return variables;
    },
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "#/styles/variables.scss";

.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
