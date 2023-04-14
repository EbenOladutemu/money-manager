import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/years/2023View.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/2023",
    name: "2023",
    component: () => import("../views/years/2023View.vue"),
    children: [
      {
        path: "january",
        name: "january-2023",
        component: () => import("../views/months/JanuaryView.vue"),
      },
      {
        path: "february",
        name: "february-2023",
        component: () => import("../views/months/FebruaryView.vue"),
      },
      {
        path: "march",
        name: "march-2023",
        component: () => import("../views/months/MarchView.vue"),
      },
      {
        path: "april",
        name: "april-2023",
        component: () => import("../views/months/AprilView.vue"),
      },
      {
        path: "may",
        name: "may-2023",
        component: () => import("../views/months/MayView.vue"),
      },
      {
        path: "june",
        name: "june-2023",
        component: () => import("../views/months/JuneView.vue"),
      },
    ],
  },
  {
    path: "/2024",
    name: "2024",
    component: () => import("../views/years/2024View.vue"),
    children: [
      {
        path: "january",
        name: "january-2024",
        component: () => import("../views/months/JanuaryView.vue"),
      },
      {
        path: "february",
        name: "february-2024",
        component: () => import("../views/months/FebruaryView.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
