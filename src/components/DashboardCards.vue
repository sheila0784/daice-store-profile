<template>
  <div class="daice-page flex flex-col gap-6 mt-1 justify-center items-center p-1">
    <div class="flex gap-2 flex-wrap justify-center">
      <Card
        v-for="card in dashboardCards"
        :key="card.title"
        :class="[
          'dashboard-card cursor-pointer transition-all duration-200 ease-in-out',
          card.bgClass,
        ]"
        @click="card.click"
      >
        <template #title>
          <span class="flex text-base font-extrabold justify-center items-center text-slate-700">
            <i :class="[card.icon, card.iconClass, 'text-2xl mr-2']"></i>
            {{ card.title }}
          </span>
        </template>

        <template #content>
          <span class="flex text-4xl font-black justify-center text-sky-700">
            {{ card.count }}
          </span>
        </template>
      </Card>
    </div>

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
        <ChartRegisteredCustomers :date-range="dateRange" />
      </div>

      <div class="daice-table-wrapper">
        <ChartTransactionsByDealer :date-range="dateRange" />
      </div>

      <div class="daice-table-wrapper">
        <ChartActiveCustomersByDealer :date-range="dateRange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import { ref, watch, onMounted } from "vue";
import { formatDateLabel } from "@/utils/date";
import { useDashboardCards } from "@/composables/useDashboardCards";
import { useRouter } from "vue-router";

import ChartRegisteredCustomers from "@/components/ChartRegisteredCustomers.vue";
import ChartTransactionsByDealer from "@/components/ChartTransactionsByDealer.vue";
import ChartActiveCustomersByDealer from "@/components/ChartActiveCustomersByDealer.vue";

const router = useRouter();

const dateRange = ref(null);
const dateDisplay = ref("");

const today = new Date();


const {
  fetchDashboardCards,
  fetchCounts,
  dealerCount,
  customerCount,
  riderCount,
} = useDashboardCards(dateRange);


const handleDealerClick = () => {
  router.push("/storeslist");
};

const handleCustomerClick = () => {
  // router.push("/storesprofilelist");
  router.push({
    path: "/storesprofilelist",
    query: {
      role: "customer",
    },
  });
};

const handleRiderClick = () => {
  // router.push("/storesprofilelist");
  router.push({
    path: "/storesprofilelist",
    query: {
      role: "rider",
    },
  });
};

const dashboardCards = [
  {
    title: "Dealers",
    icon: "pi pi-briefcase",
    iconClass: "text-sky-500",
    bgClass: "ice-card-blue",
    count: dealerCount,
    click: handleDealerClick,
  },
  {
    title: "Customers",
    icon: "pi pi-users",
    iconClass: "text-cyan-500",
    bgClass: "ice-card-cyan",
    count: customerCount,
    click: handleCustomerClick,
  },
  {
    title: "Riders",
    icon: "pi pi-car",
    iconClass: "text-blue-500",
    bgClass: "ice-card-indigo",
    count: riderCount,
    click: handleRiderClick,
  },
];

watch(dateRange, (newVal) => {
  dateRange.value = newVal;

  dateDisplay.value = formatDateLabel(newVal);

  fetchDashboardCards();
  fetchCounts();
});

onMounted(() => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  dateRange.value = [firstDayOfMonth, today];

  fetchDashboardCards();
  fetchCounts();
});
</script>
