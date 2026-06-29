<template>
  <div class="daice-page min-h-screen">
    <MenuBar />

    <div class="p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Ice Manufacturing Sales Dashboard</div>
        </template>

        <template #subtitle>
          <div class="dashboard-subtitle mb-2">
            <i class="pi pi-mobile mr-2"></i>
            Da ICE Mobile App Administration Portal
          </div>

          <Divider class="ice-divider" />
        </template>

        <template #content>
          <Cards />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
import Cards from "../components/DashboardCards.vue";
</script>
