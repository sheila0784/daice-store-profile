<template>
  <div class="daice-page flex flex-col gap-6 mt-1 justify-center items-center p-1">
    <div class="flex items-center flex-wrap justify-center w-full text-sm rounded-lg">
      <div class="flex mb-3 mt-2 justify-center w-full">
        <DatePicker
          v-model="dateRange"
          selectionMode="range"
          showIcon
          iconDisplay="input"
          placeholder="Select date range"
          inputClass="text-sm py-2 font-semibold text-slate-600"
          dateFormat="M d, yy"
          class="daice-datepicker w-[250px]"
        />
      </div>

      <div class="daice-table-wrapper">
        <ChartCustomers :date-range="dateRange" />
      </div>

      <div class="daice-table-wrapper">
        <ChartVolume :date-range="dateRange" />
      </div>

      
    </div>
  </div>
</template>

<script setup>

import DatePicker from "primevue/datepicker";
import { ref, watch, onMounted } from "vue";
import { formatDateLabel } from "@/utils/date";
import { useDashboardCards } from "@/composables/useDashboardCards";

import ChartVolume from "@/components/ChartVolume.vue";
import ChartCustomers from "@/components/ChartCustomers.vue";

const dateRange = ref(null);
const dateDisplay = ref("");

const today = new Date();

const { fetchDashboardCards, fetchCounts} =
  useDashboardCards(dateRange);


watch(dateRange, (newVal) => {
  dateRange.value = newVal;

  dateDisplay.value = formatDateLabel(newVal);

  fetchDashboardCards();
  fetchCounts();
});

// onMounted(() => {
//   const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//   dateRange.value = [firstDayOfMonth, today];

//   fetchDashboardCards();
//   fetchCounts();
// });

onMounted(() => {
  const firstDayOfMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    1
  );

  dateRange.value = [firstDayOfMonth, today];
});

</script>
