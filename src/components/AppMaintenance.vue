<template>
  <div class="min-h-screen text-sm">
    <MenuBar />
    <Card class="w-full max-w-full shadow-2 border-gray-300 mx-auto">
      <template #title
        ><span class="text-3xl font-extrabold tracking-wide"> App Maintenance </span></template
      >
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
</template>

<script setup>
import underConstruction from "@/assets/images/under-construction.png";
import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
</script>
