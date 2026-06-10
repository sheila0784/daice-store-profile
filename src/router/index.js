import { createRouter, createWebHistory } from "vue-router";

import StoresList from "../components/StoresList.vue";
import StoresUpdate from "../components/StoresUpdate.vue";
import StoresProfileList from "../components/StoresProfileList.vue";
import StoresProfileUpdate from "../components/StoresProfileUpdate.vue"
import AppAnnouncements from "../components/AppAnnouncements.vue";
import AppAnnouncementsUpdate from "../components/AppAnnouncementsUpdate.vue";

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
   {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    component: DashboardView,
  },
  
  {
    path: "/StoresList",
    name: "StoresList",
    component: StoresList,
  },
  
  // {
  //   path: "/",
  //   name: "StoresList",
  //   component: StoresList,
  // },
  
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
    path: "/AppAnnouncements",
    name: "AppAnnouncements",
    component: AppAnnouncements,
  },
   {
    path: "/AppAnnouncementsUpdate",
    name: "AppAnnouncementsUpdate",
    component: AppAnnouncementsUpdate,
  },

];


const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;