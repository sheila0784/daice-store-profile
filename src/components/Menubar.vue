<template>
  <div>
    <Menubar :model="items" class="daice-menubar mb-1 bg-white">
      <template #start>
        <div class="menubar-start">
          <div class="brand-section">
            <img src="/daice-logo-only.png" class="w-2rem h-2rem object-contain" />
            <span class="daice-menubar-title">Da ICE</span>
          </div>
          <div class="user-section">
            <!-- <div class="user-icon">
              <i class="pi pi-user"></i>
            </div> -->

            <div class="user-details">
              <span class="user-email">
                {{ user?.email || "Loading..." }}
              </span>

              <span class="user-role">
                {{ role || "No role" }}
              </span>
            </div>
          </div>
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
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

import Button from "primevue/button";
import Menubar from "primevue/menubar";

defineOptions({ name: "AppMenubar" });

const router = useRouter();
const authStore = useAuthStore();
const { role, user } = storeToRefs(authStore);

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
    label: "Reports",
    icon: "pi pi-chart-bar",
    items: [
      {
        label: "Orders and Status",
        icon: "pi pi-chart-line",
        command: () => router.push("/rptOrdersStatus"),
      },
      // {
      //   label: "Dealers'Inventory",
      //   icon: "pi pi-chart-bar",
      //   command: () => router.push("/inventoryreport"),
      // },
    ],
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
        separator: true,
      },
      {
        label: "Products",
        icon: "pi pi-box",
        command: () => router.push("/productslist"),
      },

      {
        separator: true,
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
  authStore.clear();
  router.push("/login");
};
</script>

<style scoped>
.menubar-start {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-left: 1.25rem;
  border-left: 1px solid #dbeafe;
}

.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: #0891b2;
  background: #ecfeff;
  border-radius: 50%;
}

.user-details {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-email {
  max-width: 14rem;
  overflow: hidden;
  color: #0891b2;
  font-size: 0.8rem;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  margin-top: 0.15rem;
  color: #0891b2;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .menubar-start {
    gap: 0.75rem;
  }

  .user-section {
    padding-left: 0.75rem;
  }

  .user-email {
    display: none;
  }

  .user-details {
    min-width: 3rem;
  }
}
</style>
