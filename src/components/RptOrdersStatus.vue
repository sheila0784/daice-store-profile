<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Orders and Status</div>
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

                <IconField class="daice-search w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="searchValue"
                    placeholder="Search"
                    class="w-full"
                    @keyup.enter="fetchRpt"
                  />
                </IconField>

                <div>
                  <Select
                    v-model="filterStatus"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select status"
                    class="daice-select"
                    @change="fetchRpt"
                  />
                </div>
              </div>
            </div>

            <!-- <div class="w-full md:w-auto md:ml-auto">
              <Button
                v-if="showCreateNew"
                type="button"
                label="Create New"
                icon="pi pi-plus"
                :loading="loading"
                class="daice-action-btn text-xs"
                @click="handleUpdate"
              />
            </div> -->
          </div>

          <Divider class="ice-divider" />

          <DataTable
            :value="items"
            stripedRows
            :loading="loading"
            paginator
            :rows="rows"
            :rowsPerPageOptions="rowsPerPageOptions"
            selectionMode="single"
            dataKey="id"
            class="daice-table w-full text-xs"
          >
            <Column header="#" style="width: 60px" v-bind="columnDefaults">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>

            <!-- <Column field="id" header="Order Id" sortable v-bind="columnDefaults"></Column>
            <Column field="trip_id" header="Trip Id" sortable v-bind="columnDefaults"></Column> -->

            <Column field="dealer" header="Dealer" sortable v-bind="columnDefaults"></Column>
            <Column
              field="order_date"
              header="Order Date"
              sortable
              v-bind="columnDefaults"
            ></Column>
            <Column
              field="order_time"
              header="Order Time"
              sortable
              v-bind="columnDefaults"
            ></Column>
            <!-- <Column field="status" header="Status" v-bind="columnDefaults"></Column> -->

            <Column field="status" header="Status" v-bind="columnDefaults">
              <template #body="{ data }">
                <span
                  :class="[
                    'px-2 py-1 border-round text-xs font-semibold',
                    data.status?.toLowerCase() === 'order placed' ? 'bg-yellow-100 text-blue-700' : 'text-color',
                    data.status?.toLowerCase() === 'confirmed' ? 'bg-orange-100 text-blue-700' : 'text-color',
                    data.status?.toLowerCase() === 'preparing' ? 'bg-purple-100 text-blue-700' : 'text-color',
                    data.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' : 'text-color',
                    data.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' : 'text-color',
                    data.status?.toLowerCase() === 'out for delivery' ? 'bg-blue-100 text-blue-700' : 'text-color',
                  ]"
                >
                  {{ data.status }}
                </span>
              </template>
            </Column>

            <Column field="recipient" header="Recipient" sortable v-bind="columnDefaults"></Column>
            <Column field="contact" header="Contact No." v-bind="columnDefaults"></Column>
            <Column field="address" header="Address" v-bind="columnDefaults"></Column>

            <Column field="code" header="Product" v-bind="columnDefaults"></Column>

            <Column field="quantity" header="Quantity" v-bind="columnDefaults"></Column>
            <Column field="unit_price" header="Unit Price" v-bind="columnDefaults"></Column>
            <Column field="discount" header="Discount" v-bind="columnDefaults"></Column>
            <Column field="final_price" header="Net Price" v-bind="columnDefaults"></Column>
            <Column field="amount" header="Net Amount" v-bind="columnDefaults"></Column>

            <!-- Actions Column -->
            <Column style="width: 140px" v-bind="columnDefaults">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <!-- <Button
                    v-if="showActionBtnEdit"
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    variant="text"
                    v-tooltip.bottom="'Edit Record'"
                    @click.stop="handleUpdate(slotProps.data)"
                  /> -->

                  <Button
                    v-if="showActionBtnDelete"
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    variant="text"
                    v-tooltip.bottom="'Delete Record'"
                    @click="handleDelete(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>

        <template #footer>
          <div v-if="!items.length" class="flex gap-4 mt-1">
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
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";

import { onMounted, ref, watch } from "vue";
import { useRpt } from "../composables/useRpt.js";
// import { useRouter } from "vue-router";

// import { useStoreStore } from "@/stores/storeStore";
// import { useStoresUpdate } from "../composables/useStoresUpdate.js";

import Card from "primevue/card";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Message from "primevue/message";

import Select from "primevue/select";
import Divider from "primevue/divider";
import DatePicker from "primevue/datepicker";

import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import Button from "primevue/button";
import { exportCsv } from "@/utils/exportCsv";

import { usePermissions } from "@/composables/usePermissions.js";
const { showActionBtnDelete } = usePermissions();

const dateRange = ref(null);
const today = new Date();

const columnDefaults = {
  headerClass: "daice-table-header",
  bodyClass: "text-xs whitespace-pre-line",
};

const toast = useToast();
const confirm = useConfirm();

// const router = useRouter();
// const storeStore = useStoreStore();

// const { deleteStore } = useStoresUpdate();

// const handleUpdate = (order) => {
//   // // 👇 store selected here
//   // storeStore.selectedStore = store;

//   // // 👇 then navigate
//   // router.push({ name: "StoresUpdate" });
//   console.log("Edit order:", order);
// };

const handleDelete = (order) => {
  console.log("Delete order:", order);

  confirm.require({
    message: `Delete ${order.recipient}?`,
    header: "Confirm Delete",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary p-button-text",
    acceptClass: "p-button-danger",

    accept: async () => {
      try {
        const result = await deleteOrder(order);

        console.log("Deleted successfully:", result);

        toast.add({
          severity: "success",
          summary: "Deleted",
          detail: "Order deleted successfully",
          life: 3000,
        });

        await fetchRpt();
      } catch (err) {
        console.error("Delete failed:", err);

        toast.add({
          severity: "error",
          summary: "Delete Failed",
          detail: err.message || "Something went wrong",
          life: 4000,
        });
      }
    },

    reject: () => {
      toast.add({
        severity: "info",
        summary: "Cancelled",
        detail: "Delete cancelled",
        life: 2000,
      });
    },
  });
};

const {
  rows,
  rowsPerPageOptions,
  items,

  loading,

  searchValue,
  filterStatus,
  fetchRpt,
  deleteOrder,
} = useRpt(dateRange);

const statusOptions = [
  { label: "Order Placed", value: "Order Placed" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Preparing", value: "Preparing" },
  { label: "Out for Delivery", value: "Out for delivery" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "All", value: null },
];

const handleExport = () => {
  exportCsv({
    filename: `ordersstatus_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "Order Id", key: "id" },
      { label: "Dealer", key: "dealer" },
      { label: "Order Date", key: "order_date" },
      { label: "Order Time", key: "order_time" },
      { label: "Status", key: "status" },
      { label: "Recipient", key: "recipient" },
      { label: "Contact No.", key: "contact" },
      { label: "Address", key: "address" },
      { label: "Product", key: "code" },

      { label: "Quantity", key: "quantity" },
      { label: "Unit Price", key: "unit_price" },
      { label: "Discount", key: "discount" },
      { label: "Net Price", key: "final_price" },

      { label: "Net Amount", key: "amount" },
    ],
    data: items.value.map((item) => ({
      ...item,
    })),
  });
};

watch(dateRange, (newVal) => {
  dateRange.value = newVal;
  fetchRpt();
});

onMounted(() => {
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  dateRange.value = [firstDayOfMonth, today];

  fetchRpt();
});
</script>
