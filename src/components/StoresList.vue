<template>
  <div class="m-2 mt-4 mb-4">
    <Toast />
    <ConfirmDialog />
    <Card class="w-full max-w-full shadow-2 border-gray-300 p-1 mx-auto">
      <template #title
        ><span class="text-3xl font-extrabold tracking-wide"> Dealers </span></template
      >
      <!-- <template #subtitle>Da ICE Dealers / Distributors</template> -->
      <template #content>
        <!-- <div class="flex flex-col gap-2 flex-row md:items-center"> -->
          <div class="flex flex-col md:flex-row md:items-center gap-2">
          <div class="w-full md:flex-1">
            <div class="w-full flex gap-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="searchValue" placeholder="Search" @keyup.enter="fetchStores" />
              </IconField>
              <Select
                v-model="filterActive"
                :options="statusOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select status"
                class="min-w-30"
                @change="fetchStores"
              />
            </div>
          </div>

          <div class="w-full md:w-auto md:ml-auto">
            <Button
              type="button"
              severity="secondary"
              label="Create New"
              icon="pi pi-plus"
              :loading="loading"
              class="md:ml-auto"
              @click="handleUpdate"
            />
          </div>
        </div>

        <Divider />

        <DataTable
          :value="items"
          stripedRows
          :loading="loading"
          paginator
          :rows="rows"
          :rowsPerPageOptions="rowsPerPageOptions"
          selectionMode="single"
          v-model="selectedItem"
          dataKey="id"
          @row-click="onRowClick"
        >
          <Column field="acctNo" header="Account No."></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="address" header="Address"></Column>
          <Column field="barangay" header="Barangay"></Column>
          <Column field="city" header="City"></Column>
          <Column field="province" header="Province"></Column>
          <Column field="active" header="Active">
            <template #body="slotProps">
              <i v-if="slotProps.data.active" class="pi pi-check-square text-gray-500"></i>
              <i v-else class="pi pi-stop text-gray-500"></i>
            </template>
          </Column>

          <!-- Actions Column -->
          <Column style="width: 140px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  size="small"
                  variant="text"
                  @click.stop="handleUpdate(slotProps.data)"
                />

                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  variant="text"
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
      </template>
    </Card>

    <Dialog v-model:visible="showDialog" modal :style="{ width: '25rem' }" class="m-4">
      <template #header>
        <span class="text-xl font-bold text-blue-500">{{ dialogData.name }}</span>
      </template>
      <Divider />

      <div v-if="dialogData" class="space-y-2">
        <p>
          <span class="text-sm font-semibold text-gray-500">Account No.:</span>
          <span class="text-md ml-2">{{ dialogData.acctNo }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Address:</span>
          <span class="text-xl ml-2">{{ dialogData.address }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Barangay:</span>
          <span class="text-xl ml-2">{{ dialogData.barangay }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">City:</span>
          <span class="text-xl ml-2">{{ dialogData.city }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Province:</span>
          <span class="text-xl ml-2">{{ dialogData.province }}</span>
        </p>

        <p v-if="!longitude.value || !latitude.value">
          <span class="text-sm font-semibold text-gray-500">Store Location:</span>
          <span class="text-sm ml-2">{{ longitude }}, {{ latitude }}</span>
          <span class="block mt-1 ml-8 pl-4">
            <div class="flex items-center gap-1">
              <i class="pi pi-map-marker text-red-500 text-sm"></i>

              <a :href="googleMapsLink" target="_blank" class="text-blue-500 underline text-sm">
                Open in Google Maps
              </a>
            </div>
          </span>
        </p>

        <p class="flex items-center gap-2">
          <span class="text-sm font-semibold text-gray-500">Active:</span>
          <i v-if="dialogData.active" class="pi pi-check-square text-green-600 text-md"></i>
          <i v-else class="pi pi-stop text-gray-500 text-xl"></i>
        </p>
      </div>

      <div>
        <Accordion v-if="dialogData.display_name" class="mb-1">
          <AccordionPanel value="0">
            <AccordionHeader class="text-sm font-semibold text-gray-500 bg-blue-100 pt-2 pb-2"
              >Delivery Mode</AccordionHeader
            >
            <AccordionContent>
              <p class="flex items-center gap-2">
                <i
                  v-if="dialogData.allow_immediate"
                  class="pi pi-check-square text-green-600 text-md"
                ></i>
                <i v-else class="pi pi-stop text-green-600 text-md"></i>
                <span class="text-sm font-semibold text-gray-500">Allow Immediate</span>
              </p>

              <div v-if="dialogData.allow_immediate" class="pl-4 text-xs">
                Max Distance (kilometers):
                <span class="text-lg font-semibold">{{ dialogData.allow_immediate_km }}</span>
              </div>

              <p class="flex items-center gap-2">
                <i
                  v-if="dialogData.allow_scheduled"
                  class="pi pi-check-square text-green-600 text-md"
                ></i>
                <i v-else class="pi pi-stop text-green-600 text-md"></i>
                <span class="text-sm font-semibold text-gray-500">Allow Scheduled</span>
              </p>
              <div v-if="dialogData.allow_scheduled" class="pl-4 text-xs">
                <DataTable :value="schedules" size="small" stripedRows>
                  <Column field="day_name" header="Day"></Column>
                  <Column field="open_time" header="From"></Column>
                  <Column field="close_time" header="To"></Column>
                  <Column field="is_closed" header="Status">
                    <template #body="slotProps">
                      <span v-if="slotProps.data.is_closed" class="text-red-500"> Closed </span>
                      <span v-else class="text-green-600"> Open </span>
                    </template>
                  </Column>
                </DataTable>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>

        <Accordion v-if="dialogData.display_name">
          <AccordionPanel value="0">
            <AccordionHeader class="text-sm font-semibold text-gray-500 bg-blue-100 pt-2 pb-2"
              >Profile</AccordionHeader
            >
            <AccordionContent>
              <p>
                <span class="text-sm font-semibold text-gray-500">Name:</span>
                <span class="text-xl ml-2">{{ dialogData.display_name }}</span>
              </p>
              <p>
                <span class="text-sm font-semibold text-gray-500">Contact No.:</span>
                <span class="text-xl ml-2">{{ dialogData.contact }}</span>
              </p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useStoresList } from "../composables/useStoresList";
import { useRouter } from "vue-router";

import { useStoreStore } from "@/stores/storeStore";
import { useStoresUpdate } from "../composables/useStoresUpdate";

import Card from "primevue/card";
import Divider from "primevue/divider";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Message from "primevue/message";
import Dialog from "primevue/dialog";
import Select from "primevue/select";

import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import Button from "primevue/button";

const toast = useToast();
const confirm = useConfirm();

const router = useRouter();
const storeStore = useStoreStore();

const { deleteStore } = useStoresUpdate();

const handleUpdate = (store) => {
  // 👇 store selected here
  storeStore.selectedStore = store;

  // 👇 then navigate
  router.push({ name: "StoresUpdate" });
};

// const handleDelete = async (store) => {
//   // 👇 store selected here
//   console.log("delete record: ",store.id)

//   try {
//     const result = await deleteStore(store.id);
//     console.log("Deleted successfully:", result);

//      toast.add({
//       severity: "success",
//       summary: "Deleted",
//       detail: "Store deleted successfully",
//       life: 3000,
//     });

//     await fetchStores();

//   } catch (err) {
//     console.error("Delete failed:", err);

//      toast.add({
//       severity: "error",
//       summary: "Delete Failed",
//       detail: err.message || "Something went wrong",
//       life: 4000,
//     });

//   }
// };

const handleDelete = (store) => {
  confirm.require({
    message: `Delete ${store.name}?`,
    header: "Confirm Delete",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary p-button-text",
    acceptClass: "p-button-danger",

    accept: async () => {
      try {
        const result = await deleteStore(store.id);

        console.log("Deleted successfully:", result);

        toast.add({
          severity: "success",
          summary: "Deleted",
          detail: "Store deleted successfully",
          life: 3000,
        });

        await fetchStores();
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

const googleMapsLink = computed(() => {
  if (!latitude.value || !longitude.value) return "#";

  return `https://www.google.com/maps?q=${latitude.value},${longitude.value}`;
});

const {
  rows,
  rowsPerPageOptions,
  items,
  schedules,
  loading,
  selectedItem,
  searchValue,
  filterActive,
  fetchStores,
  onRowClick,
  showDialog,
  dialogData,
  longitude,
  latitude,
} = useStoresList();

const statusOptions = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
  { label: "All", value: null },
];

onMounted(() => {
  fetchStores();
});
</script>
