import { createRouter, createWebHistory } from "vue-router";

import StoresList from "../components/StoresList.vue";
import StoresUpdate from "../components/StoresUpdate.vue";
import StoresProfileList from "../components/StoresProfileList.vue";
import StoresProfileUpdate from "../components/StoresProfileUpdate.vue";
import AppAnnouncements from "../components/AppAnnouncements.vue";
import AppAnnouncementsUpdate from "../components/AppAnnouncementsUpdate.vue";
import AppVersion from "../components/AppVersion.vue";
import AppMaintenance from "../components/AppMaintenance.vue";
import RptOrdersStatus from "../components/RptOrdersStatus.vue";

import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";

import ProductsList from "@/components/ProductsList.vue";
import ProductUpdate from "@/components/ProductUpdate.vue";


const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginView,
    meta: {
      showFooter: false,
    },
  },
  {
    path: "/dashboard",
    component: DashboardView,
  },

  {
    path: "/StoresList",
    name: "StoresList",
    component: StoresList,
  },

  {
    path: "/StoresUpdate",
    name: "StoresUpdate",
    component: StoresUpdate,
  },

  {
    path: "/StoresProfileList",
    name: "StoresProfileList",
    component: StoresProfileList,
  },

  {
    path: "/StoresProfileUpdate",
    name: "StoresProfileUpdate",
    component: StoresProfileUpdate,
  },

  {
    path: "/RptOrdersStatus",
    name: "RptOrdersStatus",
    component: RptOrdersStatus,
  },

  {
    path: "/AppAnnouncements",
    name: "AppAnnouncements",
    component: AppAnnouncements,
  },

  {
    path: "/AppAnnouncementsUpdate/:id?",
    name: "AppAnnouncementsUpdate",
    component: AppAnnouncementsUpdate,
  },

  {
    path: "/AppVersion",
    name: "AppVersion",
    component: AppVersion,
  },
  {
    path: "/AppMaintenance",
    name: "AppMaintenance",
    component: AppMaintenance,
  },

  {
    path: "/ProductsList",
    name: "ProductsList",
    component: ProductsList,
  },
   {
    path: "/ProductUpdate/:id?",
    name: "ProductUpdate",
    component: ProductUpdate,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
