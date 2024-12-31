import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "#/styles/index.scss";
import "../styles/index.scss";

// import Package from "../lib/super-crud.min.js";
import Package from "../src/index";

Vue.use(ElementUI);
Vue.use(Package, {
  dict: {
    request: (key = "sys_notice_status", cb) => {
      console.log("req");
      axios({
        url: "api/system/dict/data/type/" + key,
        method: "get",
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzUxMiJ9.eyJ0ZW5hbnRfaWQiOjEsInVzZXJfaWQiOjEsInVzZXJfa2V5IjoiNTA0N2JjNDctMjViMS00NDhhLWFlNTUtN2UxMzUwNDVhMDFlIiwidXNlcm5hbWUiOiJhZG1pbiJ9.EKQ4YAUjk0_TNcLNCM5WRU52gxAYQOEuhDQ7WotmgYfCPZvTbdgehs8KhJdfEU6casSR4FvGDi-q8TOG_HLJKQ",
        },
      }).then((res) => {
        cb(res.data.data);
      });
    },
    value: "dictValue",
    label: "dictLabel",
    color: "listClass",
  },
  template: {
    render: {
      test: (item) => {
        return {
          render: (h) => {
            return h("div", "1111");
          },
        };
      },
    },
  },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
