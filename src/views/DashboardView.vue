<template>
  <div class="min-h-screen">
    <MenuBar />

      <Card class="w-full min-h-screen shadow-2 border-gray-300">
        <template #title
          ><span class="text-3xl font-extrabold tracking-wide"> Dashboard </span></template
        >
        <!-- <template #subtitle>Da ICE Dealers / Distributors</template> -->
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
</script>
