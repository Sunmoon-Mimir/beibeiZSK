import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import layout from "../components/main-layout.vue";
// import login from "../views/login/login.vue";
// import store from "../store";
// import { getUserInfo } from "../util/tokenHelper";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/login",
  //   name: "login",
  //   component: login,
  // },
  {
    path: "/:catchAll(.*)*",
    name: "NotFound",
    component: () => import("../components/not-found.vue"),
  },
  {
    path: "/../workbench",
    component: () => import("../components/not-found.vue"),
    redirect: "/workbench",
  },
  // 业务路由
  {
    path: "/",
    redirect: "",
    component: layout,
    children: [
      {
        path: "/workbench",
        name: "workbench",
        component: () => import("../views/workbench/index.vue"),
      },
      {
        // statemanagement
        path: "/statemanagement",
        name: "statemanagement",
        component: () => import("../views/statemanagement/index.vue"),
      },
      {
        // statemanagement
        path: "/usermanagement",
        name: "usermanagement",
        component: () => import("../views/usermanagement/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: 'mui-active'
});

// 守护路由
// const whiteList = ["/login"];
// router.beforeEach(async (to, from, next) => {
//   const userInfo = getUserInfo();

//   if (userInfo == null) {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next();
//     } else {
//       sessionStorage.clear();
//       next("/login");
//     }
//   } else {
//     if (store.getters.userName == "") {
//       store.dispatch("setUser", getUserInfo());
//     }
//     if (store.getters.permissionList.length == 0) {
//       store.dispatch("setPermissions");
//     }
//     next();
//   }
// });

export default router;
