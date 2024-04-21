export type MenuMapType = {
  path: string;
  icon?: string;
  children?: MenuMapType[];
  component?: object;
  meta?: any;
};
const menuMap: MenuMapType[] = [
  {
    path: "/home",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Home.vue"),
  },
  {
    path: "/wall",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Wall.vue"),
  },
  {
    path: "/house",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/House.vue"),
  },
  {
    path: "/road",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Road.vue"),
  },
  {
    path: "/water",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Water.vue"),
  },
  {
    path: "/field",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Field.vue"),
  },
  {
    path: "/effect",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Effect.vue"),
  },
  {
    path: "/monomer",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Monomer.vue"),
  },
  {
    path: "/video",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/Video.vue"),
  },
  {
    path: "/custom",
    icon: "icon-rise",
    component: () => import("../components/viewer/styles/CustomMonomer.vue"),
  },
];
export default menuMap;
