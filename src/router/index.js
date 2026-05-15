import { createRouter, createWebHistory } from "vue-router";

import StoresList from "../components/StoresList.vue";
import StoresUpdate from "../components/StoresUpdate.vue";

const routes = [
  {
    path: "/",
    name: "StoresList",
    component: StoresList,
  },
  {
    path: "/StoresUpdate",
    name: "StoresUpdate",
    component: StoresUpdate,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;