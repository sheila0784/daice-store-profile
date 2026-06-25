<template>
  <div class="flex flex-col gap-6 mt-1 justify-center items-center">
    <!-- CARDS (BOTTOM) -->
    <div class="flex gap-2 flex-wrap mt-4">
      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-blue-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
        @click="handleDealerClick"
      >
        <template #title>
          <span class="flex text-xl font-extrabold justify-center">
            <i class="pi pi-briefcase text-blue-400 text-2xl mr-2"></i> Dealers
          </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ dealerCount }} </span>
        </template>
      </Card>

      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-green-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
        @click="handleCustomerClick"
      >
        <template #title>
          <span class="flex text-xl font-extrabold justify-center">
            <i class="pi pi-users text-yellow-400 text-2xl mr-2"></i> Customers
          </span>
        </template>

        <template #content>
          <span class="flex text-3xl font-bold justify-center"> {{ customerCount }} </span>
        </template>
      </Card>

      <Card
        class="shadow-2 border-gray-300 w-[180px] md:w-[192px] h-[130px] md:h-[144px] bg-purple-100 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-200 ease-in-out"
        @click="handleRiderClick"
      >
        <template #title>
          <span class="flex text-xl font-extrabold justify-center">
            <i class="pi pi-car text-green-400 text-2xl mr-2"></i> Riders
          </span>
        </template>

        <template #content>
          <!-- <i v-if="data.role === 'dealer'" class="pi pi-briefcase text-blue-400"></i> -->

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
        selectionMode="single"
        sortField="order_date"
        :sortOrder="-1"
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

        <!-- insert here the product_quantity -->
        <Column field="product_quantity" header="Products" headerClass="bg-yellow-50"></Column>

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

      <div v-if="!salesData.length" class="flex gap-4 mt-1">
        <Message severity="secondary" variant="simple" size="small"
          >No records found. Try searching again.</Message
        >
      </div>
      <div v-else class="flex gap-4 mt-1 w-full">
        <Button
          variant="text"
          severity="secondary"
          label="Download CSV File"
          icon="pi pi-download"
          :loading="loading"
          class="text-xs text-blue-600"
          @click="handleExport"
        />
      </div>

      <Dialog
        v-model:visible="showDiaSalesPerDay"
        :modal="true"
        :closable="true"
        :style="{ width: '400px' }"
        class="flex text-lg flex-col gap-0"
      >
        <template #header>
          <div class="flex flex-col items-center gap-1">
            <div class="text-xs text-gray-600">
              <p>
                Dealer: <span class="text-blue-700 text-bold text-lg">{{ selRowDealer }}</span>
              </p>
              <p>
                Sales Date: <span class="text-gray-800 text-bold text-lg">{{ selRowDate }}</span>
              </p>

              <p>
                Total Sales:
                <span class="text-gray-800 text-bold text-lg"
                  ><i class="pi pi-money-bill text-green-500"></i>
                  {{ formatNumber(selRowTotal) }}</span
                >
              </p>
            </div>
          </div>
        </template>

        <div>
          <Datatable :value="salesPerDay" class="w-full text-xs" size="small" stripedRows>
            <Column
              header="#"
              style="width: 60px"
              headerClass="bg-yellow-50 text-xs"
              bodyClass="text-xs"
            >
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>
            <Column
              field="recipient"
              header="Customer"
              headerClass="bg-yellow-50 text-xs"
              bodyClass="text-xs"
            ></Column>
            <Column
              field="product_quantity"
              header="Product"
              headerClass="bg-yellow-50 text-xs"
              bodyClass="text-xs"
            ></Column>
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
import { useRouter } from "vue-router";
import Message from "primevue/message";
import Button from "primevue/button";
import { exportCsv } from "@/utils/exportCsv";

const router = useRouter();

const dateRange = ref(null);
const dateDisplay = ref("");
const selRowTotal = ref(0);
const selRowProds = ref("");

const today = new Date();
// const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
// dateRange.value = [firstDayOfMonth, today];

const onRowClick = (event) => {
  selRowDate.value = event.data.order_date;
  selRowDealer.value = event.data.dealer;
  selRowTotal.value = event.data.total_amount;
  selRowProds.value = event.data.product_quantity;

  console.log("Row clicked:", selRowDate.value, selRowDealer.value, selRowTotal.value);

  fetchSalesPerDay();
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
  selRowDealer,
  loading,
} = useDashboardCards(dateRange);

const formatNumber = (value) => {
  if (value == null) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

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

const handleExport = () => {
  exportCsv({
    filename: `sales_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "Date", key: "order_date" },
      { label: "Dealer", key: "dealer" },
      { label: "Served Customers", key: "no_of_served_customers" },
      { label: "Products", key: "product_quantity"},
      { label: "Total Sales", key: "total_amount" },
    ],
    data: salesData.value.map((item) => ({
      ...item,
    })),
  });
};

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
