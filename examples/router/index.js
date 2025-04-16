import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../Layout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/crud",
    component: Layout,
    redirect: "/crud/index",
    children: [
      {
        path: "base",
        name: "base",
        component: () => import("#/views/crud/base"),
        meta: { title: "基本使用" },
      },
      {
        path: "search",
        name: "search",
        component: () => import("#/views/crud/search"),
        meta: { title: "搜索" },
      },
      {
        path: "handleRow",
        name: "handleRow",
        component: () => import("#/views/crud/handleRow"),
        meta: { title: "表头操作栏" },
      },
    ],
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("#/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" },
      },
      {
        path: "dashboard1",
        name: "Dashboard1",
        component: () => import("#/views/dashboard/index1"),
        meta: { title: "Dashboard", icon: "dashboard" },
      },
      {
        path: "formTest",
        name: "formTest",
        component: () => import("#/views/formTest/index"),
        meta: { title: "formTest" },
      },
    ],
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
      title: "Nested",
      icon: "nested",
    },
    children: [
      {
        path: "menu1",
        component: () => import("#/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [
          {
            path: "menu1-1",
            component: () => import("#/views/nested/menu1/menu1-1"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" },
          },
          {
            path: "menu1-2",
            component: () => import("#/views/nested/menu1/menu1-2"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [
              {
                path: "menu1-2-1",
                component: () =>
                  import("#/views/nested/menu1/menu1-2/menu1-2-1"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" },
              },
              {
                path: "menu1-2-2",
                component: () =>
                  import("#/views/nested/menu1/menu1-2/menu1-2-2"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" },
              },
            ],
          },
          {
            path: "menu1-3",
            component: () => import("#/views/nested/menu1/menu1-3"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" },
          },
        ],
      },
      {
        path: "menu2",
        name: "Menu2",
        meta: { title: "menu2" },
      },
    ],
  },

  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
