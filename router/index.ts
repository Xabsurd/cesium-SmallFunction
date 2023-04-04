import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import menuMap from "./menuMap";

const routerMap = setRouter(menuMap, "");
function setRouter(data: Array<any>, parent: String) {
  let arr: Array<any> = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.component) {
      arr.push({
        path: parent + element.path,
        name: (parent + element.path).substring(1).replace(/\//g, "-"),
        component: element.component,
        meta: element.meta,
      });
      if (element.children) {
        arr[arr.length - 1].children = setRouter(element.children, parent + element.path + "/");
      }
    } else {
      if (element.children) {
        arr = [...arr, ...setRouter(element.children, parent + element.path + "/")];
      }
    }
  }
  return arr;
}
const routes = [
  ...routerMap,
  ...[
    { path: "/:pathMatch(.*)", component: () => import("../components/viewer/error/404.vue") },
    { path: "/404", component: () => import("../components/viewer/error/404.vue") },
  ],
];

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory("/"),
  routes,
  
});
// router.beforeEach((to, from, next) => {
//   if (to.path === "/") {
//     next({ path: "/home" });
//   } else {
//     next();
//   }
// });

export default router;
