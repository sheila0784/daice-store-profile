<template>
  <div class="min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <Card class="w-full max-w-full shadow-2 border-gray-300 mx-auto">
      <template #title
        ><span class="text-3xl font-extrabold tracking-wide"> Profiles </span></template
      >
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <div class="w-full md:flex-1">
            <div class="w-full flex flex-col sm:flex-row flex-wrap gap-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="searchValue"
                  placeholder="Search"
                  @keyup.enter="fetchStoresProfile"
                />
              </IconField>
              <div>
                <Select
                  v-model="filterRole"
                  :options="roleOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Role"
                  @change="fetchStoresProfile"
                />
              </div>
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
          class="w-full text-xs border-0 border-gray-300"
        >
          <!-- <Column
            field="id"
            header="Id"
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          ></Column> -->

          <!-- Row Count Column -->
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

          <!-- <Column field="id" header="Id"></Column>
          <Column field="store_id" header="Store Id"></Column> -->

          <Column
            field="role"
            header="Role"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="{ data }">
              <i v-if="data.role === 'dealer'" class="pi pi-briefcase text-blue-400"></i>
              <i v-else-if="data.role === 'rider'" class="pi pi-car text-green-400"></i>
              <span v-else>
                <i class="pi pi-user text-yellow-400"></i>
              </span>
            </template>
          </Column>

          <Column
            field="display_name"
            header="Profile Name"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
          </Column>

          <Column
            field="email"
            header="Email"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          ></Column>

          <Column
            field="contact"
            header="Contact No."
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          ></Column>

          <Column
            field="shipping_details"
            header="Shipping Details"
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs whitespace-pre-line"
          ></Column>

          <Column
            field="status"
            header="Status"
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="{ data }">
              <i v-if="data.status === 'approved'" class="pi pi-thumbs-up text-green-600"></i>

              <span v-else>
                {{ data.status }}
              </span>
            </template>
          </Column>
          <Column
            field="name"
            header="Dealer"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="slotProps">
              {{ slotProps.data.role === "dealer" ? "" : slotProps.data.name }}
            </template>
          </Column>

          <Column
            field="created_at"
            header="Account Creation"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.created_at) }}
            </template>
          </Column>

          <Column
            field="last_sign_in_at"
            header="Last Sign-in"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.last_sign_in_at) }}
            </template>
          </Column>

          <Column
            field="last_order_placed"
            header="Last Order Placed"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="slotProps">
              {{ formatDate(slotProps.data.last_order_placed) }}
            </template>
          </Column>

          <!-- <Column field="last_delivery_at" header="Last Order Record" sortable class="text-xs">
            <template #body="slotProps">
              {{ formatDate(slotProps.data.last_delivery_at) }}
            </template>
          </Column> -->

          <!-- Actions Column -->
          <Column style="width: 140px" headerClass="bg-yellow-50 text-xs" bodyClass="text-xs">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="info"
                  size="small"
                  variant="text"
                  v-tooltip.bottom="'Edit Record'"
                  @click.stop="handleUpdate(slotProps.data)"
                />
                <Button
                  v-if="
                    slotProps.data.last_sign_in_at === null || slotProps.data.last_sign_in_at === ''
                  "
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  variant="text"
                  v-tooltip.bottom="'Delete Record'"
                  @click.stop="handleDelete(slotProps.data)"
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
            class="md:ml-auto text-xs text-blue-600"
            @click="handleExport"
          />
        </div>
      </template>
    </Card>

    <Dialog v-model:visible="showDialog" modal :style="{ width: '25rem' }" class="m-4">
      <template #header>
        <span class="text-xl font-bold text-blue-500">{{ dialogData.display_name }}</span>
      </template>
      <Divider />

      <div v-if="dialogData" class="space-y-2">
        <div class="flex items-center justify-center">
          <!-- Spinner -->
          <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
            <i class="pi pi-spinner pi-spin text-blue-500 text-lg"></i>
          </div>
          <!-- Image -->
          <img
            v-if="dialogData?.avatar_url"
            :src="dialogData.avatar_url"
            alt="Avatar"
            class="w-10 h-10 border border-blue-300 rounded-[3%] object-cover shadow-md shadow-blue-200"
            :class="{ 'opacity-0': imageLoading, 'opacity-100': !imageLoading }"
            @load="imageLoading = false"
          />
        </div>

        <p>
          <span class="text-sm font-semibold text-gray-500">Id:</span>
          <span class="text-xs ml-2">{{ dialogData.id }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Role:</span>
          <span class="text-md ml-2">{{ dialogData.role.toUpperCase() }}</span>
        </p>

        <p v-if="dialogData.contact">
          <span class="text-sm font-semibold text-gray-500">Contact No.:</span>
          <span class="text-xl ml-2">{{ dialogData.contact }}</span>
        </p>
        <p>
          <span class="text-sm font-semibold text-gray-500">Email:</span>
          <span class="text-xl ml-2">{{ dialogData.email }}</span>
        </p>

        <p v-if="dialogData.status">
          <span class="text-sm font-semibold text-gray-500">Status:</span>
          <i
            v-if="dialogData.status === 'approved'"
            class="pi pi-thumbs-up text-green-600 text-xl ml-2"
          ></i>
          <span v-else>
            {{ dialogData.status }}
          </span>
        </p>

        <p v-if="dialogData.name">
          <span class="text-sm font-semibold text-gray-500">Dealer:</span>
          <span class="text-xl ml-2">{{ dialogData.name }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Account Created:</span>
          <span class="text-xs ml-2">{{ formatDate(dialogData.created_at) }}</span>
        </p>
        <p>
          <span class="text-sm font-semibold text-gray-500">Last Sign-in:</span>
          <span class="text-xs ml-2">{{ formatDate(dialogData.last_sign_in_at) }}</span>
        </p>

        <p>
          <span class="text-sm font-semibold text-gray-500">Last Order Placed:</span>
          <span class="text-xs ml-2">{{ formatDate(dialogData.last_order_placed) }}</span>
        </p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";

import { onMounted, ref } from "vue";
import { useStoresProfileList } from "../composables/useStoresProfileList";
import { useStoresProfileUpdate } from "../composables/useStoresProfileUpdate";

import { useRouter, useRoute } from "vue-router";
import { useStoresProfile } from "@/stores/storeProfile";

import Card from "primevue/card";
import Divider from "primevue/divider";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Message from "primevue/message";
import Toast from "primevue/toast";

import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";

import Select from "primevue/select";

import { formatDate } from "@/utils/date";

import Dialog from "primevue/dialog";
import Button from "primevue/button";

import { exportCsv } from "@/utils/exportCsv";

const router = useRouter();
const route = useRoute();

const imageLoading = ref(true);

const storesProfile = useStoresProfile();
const confirm = useConfirm();
const toast = useToast();

const handleUpdate = (store) => {
  // 👇 store selected here
  storesProfile.setProfile(store);

  // 👇 then navigate
  router.push({ name: "StoresProfileUpdate" });
};

// const handleExport = () => {
//   console.log("export csv file");

//   const headers = [
//     "Role",
//     "Profile Name",
//     "Email",
//     "Contact No.",
//     "Shipping Details",
//     "Status",
//     "Dealer",
//     "Account Creation",
//     "Last Sign-in",
//     "Last Order Placed",
//   ];

//   const rows = items.value.map((item) => [
//     item.role,
//     item.display_name,
//     item.email,
//     item.contact,
//     // item.shipping_details?.replace(/\n/g, " | "),
//     item.shipping_details,
//     item.status,
//     item.name,
//     formatDate(item.created_at),
//     formatDate(item.last_sign_in_at),
//     formatDate(item.last_order_placed),
//   ]);

//   const csvContent = [headers, ...rows]
//     .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
//     // .join("\n");
//     .join("\r\n");

//   const blob = new Blob([csvContent], {
//     type: "text/csv;charset=utf-8;",
//   });

//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `profiles_${new Date().toISOString().slice(0, 10)}.csv`;

//   document.body.appendChild(link);
//   link.click();

//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);

//   toast.add({
//     severity: "success",
//     summary: "Export Complete",
//     detail: "CSV file downloaded successfully",
//     life: 3000,
//   });

// };


const handleExport = () => {
  exportCsv({
    filename: `profiles_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "Role", key: "role" },
      { label: "Profile Name", key: "display_name" },
      { label: "Email", key: "email" },
      { label: "Contact No.", key: "contact" },
      { label: "Shipping Details", key: "shipping_details" },
      { label: "Status", key: "status" },
      { label: "Dealer", key: "name" },
      { label: "Account Creation", key: "created_at_formatted" },
      { label: "Last Sign-in", key: "last_sign_in_at_formatted" },
      { label: "Last Order Placed", key: "last_order_placed_formatted" },
    ],
    data: items.value.map((item) => ({
      ...item,
      created_at_formatted: formatDate(item.created_at),
      last_sign_in_at_formatted: formatDate(item.last_sign_in_at),
      last_order_placed_formatted: formatDate(item.last_order_placed),
    })),
  });

  // toast.add({
  //   severity: "success",
  //   summary: "Export Complete",
  //   detail: "CSV file downloaded successfully",
  //   life: 3000,
  // });
};


const handleDelete = (profile) => {
  console.log("Attempting to delete profile:", profile);

  confirm.require({
    message: `Delete ${profile.email}?`,
    header: "Confirm Delete",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary p-button-text",
    acceptClass: "p-button-danger",

    accept: async () => {
      try {
        // const result = await deleteProfile(profile.id);

        await deleteProfile(profile.id);

        toast.add({
          severity: "success",
          summary: "Deleted",
          detail: "Profile deleted successfully",
          life: 3000,
        });

        await fetchStoresProfile();
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
  selectedItem,
  searchValue,
  filterRole,
  fetchStoresProfile,
  onRowClick,
  showDialog,
  dialogData,
} = useStoresProfileList();

const { deleteProfile } = useStoresProfileUpdate();

const roleOptions = [
  { label: "Dealer", value: "dealer" },
  { label: "Customer", value: "customer" },
  { label: "Rider", value: "rider" },
  { label: "All", value: null },
];

onMounted(async () => {
  if (route.query.role) {
    filterRole.value = route.query.role;
  }

  await fetchStoresProfile();
});
</script>
