<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Export Customer Orders</div>
        </template>

        <template #content>
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <div class="w-full md:flex-1">
              <div class="daice-toolbar flex flex-col md:flex-row md:items-center gap-2">
                <DatePicker
                  v-model="dateRange"
                  selectionMode="range"
                  showIcon
                  iconDisplay="input"
                  placeholder="Select date range"
                  inputClass="text-sm py-2 font-semibold text-slate-600"
                  dateFormat="M d, yy"
                  class="daice-datepicker w-full"
                />

                <MultiSelect
                  ref="storeNameRef"
                  v-model="store_id"
                  :options="storeList"
                  optionLabel="label"
                  optionValue="value"
                  filter
                  display="chip"
                  showClear
                  placeholder="Select Dealers"
                  class="daice-select w-full"
                />
              </div>
            </div>
          </div>

          <Divider class="ice-divider" />

          <DataTable
            v-if="store_id.length > 0"
            :value="customerOrders"
            class="daice-table"
            :rows="rows"
            :rowsPerPageOptions="rowsPerPageOptions"
            paginator
            stripedRows
            selectionMode="single"
            sortField="order_date"
            :sortOrder="-1"
          >
            <Column field="table_name" header="Table Name" v-bind="columnDefaults"></Column>
            <Column field="record_data" header="Record Data" v-bind="columnDefaults"></Column>
          </DataTable>
        </template>

        <template #footer>
          <div v-if="store_id.length > 0 && !customerOrders.length" class="flex gap-4 mt-1">
            <Message severity="secondary" variant="simple" size="small"
              >No records found. Try searching again.</Message
            >
          </div>
          <div v-if="customerOrders.length">
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
        </template>
      </Card>

      <!-- <Dialog
        v-model:visible="showDiaSalesPerDay"
        :modal="true"
        :closable="true"
        :style="{ width: '700px', maxWidth: '92vw' }"
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

        <div class="daice-table-wrapper">
          <DataTable
            :value="ordersPerDay"
            class="daice-table w-full text-xs"
            :rows="rows"
            :rowsPerPageOptions="rowsPerPageOptions"
            paginator
            stripedRows
            selectionMode="single"
            sortField="order_time"
            :sortOrder="1"
            size="small"
          >
            <Column field="table_name" header="table_name" v-bind="dialogColumnDefaults"></Column>
            <Column field="record_data" header="record_data" v-bind="dialogColumnDefaults"></Column>
          </DataTable>
        </div>
      </Dialog> -->
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";

import { onMounted, ref, watch } from "vue";
import { useExportCustomerOrders } from "../composables/useExportCustomerOrders.js";

import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";

import Divider from "primevue/divider";
import DatePicker from "primevue/datepicker";
// import Dialog from "primevue/dialog";
import MultiSelect from "primevue/multiselect";

import Button from "primevue/button";
import { exportCsv } from "@/utils/exportCsv";

import { useStoresProfileUpdate } from "@/composables/useStoresProfileUpdate";
const { storeList, fetchStores } = useStoresProfileUpdate();

const dateRange = ref(null);
const today = new Date();

// const formatNumber = (value) => {
//   if (value == null) return "0";

//   return new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value);
// };

const columnDefaults = {
  headerClass: "daice-table-header",
  bodyClass: "text-xs whitespace-pre-line",
};

// const dialogColumnDefaults = {
//   headerClass: "daice-table-header-light",
//   bodyClass: "text-xs",
// };

const {
  rows,
  rowsPerPageOptions,
  loading,
  fetchCustomerOrders,
  customerOrders,
  // selRowDate,
  // selRowDealer,
  // ordersPerDay,

  store_id,
} = useExportCustomerOrders(dateRange);

const handleExport = () => {
  exportCsv({
    filename: `customer_orders_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "table_name", key: "table_name" },
      { label: "record_data", key: "record_data" },
    ],
    data: customerOrders.value.map((item) => ({
      ...item,
    })),
  });
};

// const selRowTotal = ref(0);

watch([dateRange, store_id], () => {
  if (dateRange.value && store_id.value.length > 0) {
    fetchCustomerOrders();
  }

  // console.log("Date range or store_id changed:", store_id.value);
});

onMounted(() => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  // dateRange.value = [firstDayOfMonth, today];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  dateRange.value = [firstDayOfMonth, yesterday];

  fetchStores();

  if (dateRange.value && store_id.value.length > 0) {
  fetchCustomerOrders();}

});
</script>
