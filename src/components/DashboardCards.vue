<template>
  <div class="flex flex-col gap-6 mt-1 justify-center items-center">
    <!-- CARDS (BOTTOM) -->
    <div class="flex gap-2 flex-wrap mt-4">
      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-blue-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
        @click="handleDealerClick"
      >
        <template #title>
          <span class="flex text-xl font-extrabold justify-center"> Total Dealers </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ dealerCount }} </span>
        </template>
      </Card>

      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-green-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
      >
        <template #title>
          <span class="flex text-xl font-extrabold justify-center"> Total Customers </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ customerCount }} </span>
        </template>
      </Card>

      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-purple-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
      >
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

    <div class="flex items-center flex-wrap justify-center w-full text-sm">
      <Datatable
        :value="salesData"
        class="w-full border-1 border-gray-300"
        :rows="rows"
        :rowsPerPageOptions="rowsPerPageOptions"
        paginator
        stripedRows
        @row-click="onRowClick"
      >
        <Column
          field="order_date"
          header="Date"
          :body="(data) => new Date(data.date).toLocaleDateString()"
          sortable
          headerClass="bg-yellow-50"
        ></Column>
        <Column field="dealer" header="Dealer" headerClass="bg-yellow-50"></Column>
        <Column
          field="no_of_served_customers"
          header="Served Customers"
          headerClass="bg-yellow-50"
        ></Column>
        <Column
          field="total_amount"
          headerClass="text-right bg-yellow-50"
          header="Total Sales"
          bodyClass="text-right"
          sortable
        >
          <template #body="{ data }">
            {{ formatNumber(data.total_amount) }}
          </template>
        </Column>
      </Datatable>

      <Dialog
        v-model:visible="showDiaSalesPerDay"
        :header="`Sales Date: ${selRowDate}`"
        :modal="true"
        :closable="true"
        :style="{ width: '400px' }"
        class="flex text-xs"
      >
        <div>
          <Datatable
            :value="salesPerDay"
            class="w-full border-1 border-gray-300 text-sm"
            stripedRows
          >
            <Column header="#" style="width: 60px" headerClass="bg-yellow-50 text-xs" bodyClass="text-xs">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>
            <Column field="recipient" header="Customer" headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
            <Column
              field="total_amount"
              headerClass="text-right bg-yellow-50 text-xs"
              header="Amount"
              bodyClass="text-right text-xs"
              sortable
            >
              <template #body="{ data }">
                {{ formatNumber(data.total_amount) }}
              </template>
            </Column>
          </Datatable>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import DatePicker from "primevue/datepicker";
import { ref, watch, onMounted } from "vue";
import { formatDateLabel } from "@/utils/date";
import { useDashboardCards } from "@/composables/useDashboardCards";
import Datatable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";

const dateRange = ref(null);
const dateDisplay = ref("");
// const showDiaSalesPerDay = ref(false);

const onRowClick = (event) => {
  selRowDate.value = event.data.order_date;
  fetchSalesPerDay();
  // showDiaSalesPerDay.value = true;

  console.log("show dialog:", showDiaSalesPerDay.value);
  console.log("Selected row date:", salesPerDay.value);
  console.log("Sales Per Day: ", salesPerDay.value);
};

const {
  salesData,
  fetchDashboardCards,
  fetchCounts,
  dealerCount,
  customerCount,
  riderCount,
  rows,
  rowsPerPageOptions,
  fetchSalesPerDay,
  showDiaSalesPerDay,
  salesPerDay,
  selRowDate,
} = useDashboardCards(dateRange);

const formatNumber = (value) => {
  if (value == null) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const handleDealerClick = () => {
  console.log("Dealer card clicked");
};

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
