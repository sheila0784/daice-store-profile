<template>
  <div class="flex flex-col gap-6 mt-1 justify-center items-center">
    
    <!-- CARDS (BOTTOM) -->
    <div class="flex gap-2 flex-wrap mt-4">
      <Card class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-blue-100">
        <template #title>
          <span class="flex text-xl font-extrabold justify-center"> Total Dealers </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ dealerCount }} </span>
        </template>
      </Card>

      <Card class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-green-100">
        <template #title>
          <span class="flex text-xl font-extrabold justify-center"> Total Customers </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ customerCount }} </span>
        </template>
      </Card>

     

      <Card class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-purple-100">
        <template #title>
          <span class="flex text-xl font-extrabold justify-center"> Total Riders </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ riderCount }} </span>
        </template>
      </Card>
    </div>

    <!-- DATE RANGE (TOP) -->
    <div class="flex gap-2 items-center flex-wrap justify-center">
      <DatePicker
        v-model="dateRange"
        selectionMode="range"
        showIcon
        placeholder="Select date range"
      />
    </div>

    <div class="flex items-center flex-wrap">
      <div class="text-md text-gray-600 text-center flex justify-left w-full">
        <span v-if="dateRange?.[0] && dateRange?.[1]" class="font-bold">
          {{ formatDateLabel(dateRange) }}
        </span>
      </div>
    </div>

    <div class="flex items-center flex-wrap justify-center w-full p-6 text-sm">
      <Datatable :value="salesData" class="w-full">
        <Column field="order_date" header="Date" :body="(data) => new Date(data.date).toLocaleDateString()"></Column>
        <Column field="dealer" header="Dealer"></Column>
        <Column field="no_of_served_customers" header="Served Customers"></Column>
        <Column field="total_amount" header="Total Sales"></Column>
      </Datatable>
     </div> 

  </div>
</template>

<script setup>
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import { ref, watch , onMounted} from "vue";
import { formatDateLabel } from "@/utils/date";
import { useDashboardCards } from "@/composables/useDashboardCards";
import Datatable from "primevue/datatable";
import Column from "primevue/column";


const dateRange = ref(null);
const dateDisplay = ref("");

const { salesData, fetchDashboardCards, fetchCounts, dealerCount, customerCount, riderCount } = useDashboardCards(dateRange);

watch(dateRange, (newVal) => {
  dateRange.value = newVal;

  dateDisplay.value = formatDateLabel(newVal);

  fetchDashboardCards();
  fetchCounts();
  console.log("sales data:", salesData.value);

});

onMounted(() => {
  fetchDashboardCards();
  fetchCounts();
});

</script>
