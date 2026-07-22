<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card  class="dashboard-shell">
        <template #title
          > <div class="dashboard-title mb-2">App Maintenance</div>
          <Divider class="ice-divider" />
          </template>
        <template #content>
          <div class="min-h-screen flex items-start justify-center bg-white">
            <img
              :src="underConstruction"
              alt="Under Construction"
              class="w-full md:w-1/2 max-w-4xl max-h-[70vh] object-contain"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import underConstruction from "@/assets/images/under-construction.png";
import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
</script>
