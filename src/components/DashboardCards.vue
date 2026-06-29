<template>
  <div class="daice-page flex flex-col gap-6 mt-1 justify-center items-center p-1">
    <div class="flex gap-2 flex-wrap mt-4 justify-center">
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
      <div class="flex mb-3 mt-2 justify-center">
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

      <Datatable
        :value="salesData"
        class="daice-table w-full"
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
          v-bind="columnDefaults"
        ></Column>
        <Column field="dealer" header="Dealer" v-bind="columnDefaults"></Column>
        <Column
          field="no_of_served_customers"
          header="Served Customers"
          v-bind="columnDefaults"
        ></Column>

        <!-- insert here the product_quantity -->
        <Column field="product_quantity" header="Products" v-bind="columnDefaults"></Column>

        <Column
          field="total_amount"
          header="Total Sales"
          v-bind="columnDefaults"
          bodyClass="text-right text-sm"
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
          class="daice-link-btn text-xs"
          @click="handleExport"
        />
      </div>

      <Dialog
        v-model:visible="showDiaSalesPerDay"
        :modal="true"
        :closable="true"
        :style="{ width: '400px', maxWidth: '92vw' }"
        class="daice-dialog"
      >
        <template #header>
          <div class="dialog-header-info">
            <p>
              Dealer: <span>{{ selRowDealer }}</span>
            </p>
            <p>
              Sales Date: <span>{{ selRowDate }}</span>
            </p>
            <p>
              Total Sales:
              <span>
                <i class="pi pi-money-bill"></i>
                {{ formatNumber(selRowTotal) }}
              </span>
            </p>
          </div>
        </template>

        <div>
          <Datatable
            :value="salesPerDay"
            class="daice-table daice-dialog-table w-full text-xs"
            size="small"
            stripedRows
          >
            <Column header="#" style="width: 60px" v-bind="dialogColumnDefaults">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>
            <Column field="recipient" header="Customer" v-bind="dialogColumnDefaults"></Column>
            <Column
              field="product_quantity"
              header="Product"
              v-bind="dialogColumnDefaults"
            ></Column>
            <Column
              field="total_amount"
              header="Amount"
              v-bind="dialogColumnDefaults"
              sortable
              bodyClass="flex justify-end"
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

const columnDefaults = {
  headerClass: "daice-table-header",
  bodyClass: "text-xs whitespace-pre-line",
};

const dialogColumnDefaults = {
  headerClass: "daice-table-header-light",
  bodyClass: "text-xs",
};

const router = useRouter();

const dateRange = ref(null);
const dateDisplay = ref("");
const selRowTotal = ref(0);
const selRowProds = ref("");

const today = new Date();

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

const handleExport = () => {
  exportCsv({
    filename: `sales_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "Date", key: "order_date" },
      { label: "Dealer", key: "dealer" },
      { label: "Served Customers", key: "no_of_served_customers" },
      { label: "Products", key: "product_quantity" },
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
