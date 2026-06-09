<template>
  <div>
    <Menubar :model="items" class="mb-1  shadow-none !rounded-none border-0">
      <template #end>
        <Button label="Logout" severity="danger" icon="pi pi-sign-out" @click="logout" variant="text"/>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
defineOptions({ name: "AppMenubar" });
import { useRouter } from "vue-router";
import { supabase } from "../supabase";
import Button from "primevue/button";
import Menubar from "primevue/menubar";

const router = useRouter();

const items = [
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => router.push("/dashboard"),
  },
  {
    label: "Dealers",
    icon: "pi pi-users",
    command: () => router.push("/storeslist"),
  },
  {
    label: "Profiles",
    icon: "pi pi-user-edit",
    command: () => router.push("/storesprofilelist"),
  },
   {
    label: "Settings",
    icon: "pi pi-cog",
    items: [
      {
        label: "Announcements",
        icon: "pi pi-megaphone",
        command: () => router.push("/appannouncements"),
      },
      {
        label: "App Version",
        icon: "pi pi-tag",
        command: () => router.push("/app-version"),
      },
      {
        label: "Maintenance",
        icon: "pi pi-wrench",
        command: () => router.push("/app-maintenance"),
      },
    ],
  },
];

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
</script>
