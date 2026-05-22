import { createRouter, createWebHistory } from "vue-router";

import StoresList from "../components/StoresList.vue";
import StoresUpdate from "../components/StoresUpdate.vue";
import StoresProfileUpdate from "../components/StoresProfileUpdate.vue"

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
  {
    path: "/StoresProfileUpdate",
    name: "StoresProfileUpdate",
    component: StoresProfileUpdate,
  },

];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;