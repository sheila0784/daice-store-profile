<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Daily Dealer Sales and Delivery Summary</div>
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

                <!-- <Select
                    ref="storeNameRef"
                    v-model="store_id"
                    :options="storeList"
                    optionLabel="label"
                    optionValue="value"
                    showClear
                    placeholder="Select Dealer"
                    @clear="store_id = null"
                    class="daice-select w-full"
                    @keydown.enter.prevent="focusNextSel('statusRef')"
                  /> -->

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
                  @clear="store_id = []"
                  class="daice-select w-full"
                />
              </div>
            </div>
          </div>

          <Divider class="ice-divider" />

          <DataTable
            :value="salesData"
            class="daice-table"
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
          </DataTable>
        </template>

        <template #footer>
          <div v-if="!salesData.length" class="flex gap-4 mt-1">
            <Message severity="secondary" variant="simple" size="small"
              >No records found. Try searching again.</Message
            >
          </div>
          <div v-else>
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

      <Dialog
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
            :value="salesPerDay"
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
            <Column header="#" style="width: 60px" v-bind="dialogColumnDefaults">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>
            <Column field="recipient" header="Customer" v-bind="dialogColumnDefaults"></Column>
            <Column
              field="order_time"
              header="Order Time"
              v-bind="dialogColumnDefaults"
              sortable
            ></Column>
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
          </DataTable>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";

import { onMounted, ref, watch } from "vue";
import { useRpt } from "../composables/useRpt.js";

import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Message from "primevue/message";

import Divider from "primevue/divider";
import DatePicker from "primevue/datepicker";
import Dialog from "primevue/dialog";
import MultiSelect from "primevue/multiselect";

import Button from "primevue/button";
import { exportCsv } from "@/utils/exportCsv";

import { useStoresProfileUpdate } from "@/composables/useStoresProfileUpdate";
const { storeList, fetchStores } = useStoresProfileUpdate();

const dateRange = ref(null);
const today = new Date();

const formatNumber = (value) => {
  if (value == null) return "0";

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const columnDefaults = {
  headerClass: "daice-table-header",
  bodyClass: "text-xs whitespace-pre-line",
};

const dialogColumnDefaults = {
  headerClass: "daice-table-header-light",
  bodyClass: "text-xs",
};

const {
  rows,
  rowsPerPageOptions,
  loading,
  fetchSalesData,
  salesData,
  selRowDate,
  selRowDealer,
  showDiaSalesPerDay,
  salesPerDay,
  fetchSalesPerDay,
  store_id,
} = useRpt(dateRange);

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

const selRowTotal = ref(0);
const selRowProds = ref("");

const onRowClick = (event) => {
  selRowDate.value = event.data.order_date;
  selRowDealer.value = event.data.dealer;
  selRowTotal.value = event.data.total_amount;
  selRowProds.value = event.data.product_quantity;

  // console.log("Row clicked:", selRowDate.value, selRowDealer.value, selRowTotal.value);
  fetchSalesPerDay();
};

watch([dateRange, store_id], () => {
  fetchSalesData();
  // console.log("Date range or store_id changed:", store_id.value);
});

onMounted(() => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  dateRange.value = [firstDayOfMonth, today];

  fetchSalesData();
  fetchStores();
});
</script>
