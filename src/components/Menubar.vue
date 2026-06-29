<template>
  <div>
    <Menubar :model="items" class="daice-menubar mb-1 bg-white">
      <template #start>
        <div class="flex items-center gap-2 mr-4">
          <img src="/daice-logo-only.png" class="w-2rem h-2rem object-contain" />
          <span class="daice-menubar-title">Da ICE</span>
        </div>
      </template>

      <template #end>
        <Button
          label="Logout"
          severity="danger"
          icon="pi pi-sign-out"
          @click="logout"
          variant="text"
          class="daice-logout-btn text-sm"
        />
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
        command: () => router.push("/appversion"),
      },
      {
        label: "Maintenance",
        icon: "pi pi-wrench",
        command: () => router.push("/appmaintenance"),
      },
    ],
  },
];

const logout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};
</script>
