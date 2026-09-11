<template>
  <div class="daice-page min-h-screen">
    <MenuBar />

    <div class="p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Monthly Overview</div>
        </template>

        <template #subtitle>
          <div class="dashboard-subtitle mb-2">
            <i class="pi pi-mobile mr-2"></i>
            Mobile App Admin Portal
          </div>

          <Divider class="ice-divider" />
        </template>

        <template #content>
          <Cards />
        </template>
        <template #footer>
          <!-- <Divider class="ice-divider" /> -->
          
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>

import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
import Cards from "../components/MonthlyOverviewCards.vue";
import Divider from "primevue/divider";

</script>
