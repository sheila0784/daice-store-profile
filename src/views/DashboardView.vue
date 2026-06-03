<template>
  <div class="min-h-screen">
    <MenuBar />

    <Card class="w-full min-h-screen shadow-2 border-gray-300">
      <template #title
        ><span class="flex text-xl font-extrabold tracking-wide justify-center">
          Ice Manufacturing Sales Dashboard
        </span></template
      >
      <template #subtitle>
        <span class="flex text-sm font-medium tracking-wide justify-center"
          >Da ICE Mobile App Administration Portal
        </span></template
      >
      <template #content>
        <Cards />
      </template>
    </Card>

    <!-- PAGE CONTENT 
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-4">Dashboard</h1>
    </div> -->
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
import Cards from "../components/DashboardCards.vue";
</script>
