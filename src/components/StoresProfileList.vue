<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title><span class="dashboard-title"> Profiles </span></template>
        <template #content>
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <div class="w-full md:flex-1">
              <div class="daice-toolbar flex flex-col md:flex-row md:items-center gap-2">
                <IconField class="daice-search w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="searchValue"
                    placeholder="Search"
                    @keyup.enter="onSearch"
                    class="w-full"
                  />
                </IconField>
                <div>
                  <Select
                    v-model="filterRole"
                    :options="roleOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Role"
                    class="daice-select"
                    @change="onRoleChanged"
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
                class="daice-action-btn text-xs"
                @click="handleUpdate"
              />
            </div>
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
            v-model="selectedItem"
            dataKey="id"
            @row-click="onRowClick"
            class="daice-table w-full text-xs"
          >
            <!-- <Column
            field="id"
            header="Id"
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          ></Column> -->

            <!-- Row Count Column -->
            <Column header="#" style="width: 60px" v-bind="columnDefaults">
              <template #body="slotProps">
                {{ slotProps.index + 1 }}
              </template>
            </Column>

            <!-- <Column field="id" header="Id"></Column>
          <Column field="store_id" header="Store Id"></Column> -->

            <Column field="role" header="Role" sortable v-bind="columnDefaults">
              <template #body="{ data }">
                <i v-if="data.role === 'dealer'" class="pi pi-briefcase text-blue-400"></i>
                <i v-else-if="data.role === 'rider'" class="pi pi-car text-green-400"></i>
                <span v-else>
                  <i class="pi pi-user text-yellow-400"></i>
                </span>
              </template>
            </Column>

            <Column field="display_name" header="Profile Name" sortable v-bind="columnDefaults">
            </Column>

            <Column field="email" header="Email" sortable v-bind="columnDefaults"></Column>

            <Column field="contact" header="Contact No." v-bind="columnDefaults"></Column>

            <Column
              field="shipping_details"
              header="Shipping Details"
              v-bind="columnDefaults"
            ></Column>

            <Column field="status" header="Status" v-bind="columnDefaults">
              <template #body="{ data }">
                <i v-if="data.status === 'approved'" class="pi pi-thumbs-up text-green-600"></i>

                <span v-else>
                  {{ data.status }}
                </span>
              </template>
            </Column>

            <!-- <Column
            field="store_id"
            header="Store Id"
            sortable
            headerClass="bg-yellow-50 text-xs"
            bodyClass="text-xs"
          >
            <template #body="slotProps">
              {{ slotProps.data.store_id }}
            </template>
          </Column> -->

            <Column field="store" header="Store" sortable v-bind="columnDefaults">
              <template #body="slotProps">
                {{ slotProps.data.store }}
              </template>
            </Column>

            <Column field="created_at" header="Account Creation" sortable v-bind="columnDefaults">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
              </template>
            </Column>

            <Column field="last_sign_in_at" header="Last Sign-in" sortable v-bind="columnDefaults">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.last_sign_in_at) }}
              </template>
            </Column>

            <Column
              v-if="filterRole === 'customer' || filterRole === null"
              field="last_order_placed"
              header="Last Order Placed"
              sortable
              v-bind="columnDefaults"
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
            <Column style="width: 140px" v-bind="columnDefaults">
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
                      slotProps.data.last_sign_in_at === null ||
                      slotProps.data.last_sign_in_at === ''
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
              class="daice-link-btn text-xs"
              @click="handleExport"
            />
          </div>
        </template>
      </Card>
    </div>

    <Dialog v-model:visible="showDialog" modal :style="{ width: '25rem', maxWidth: '92vw' }">
      <template #header>
        <div class="dialog-header-info">
          <div class="flex justify-center mb-4">
            <img
              v-if="dialogData?.avatar_url"
              :src="dialogData.avatar_url"
              alt="Avatar"
              class="daice-avatar"
              :class="{ 'opacity-0': imageLoading, 'opacity-100': !imageLoading }"
              @load="imageLoading = false"
            />
          </div>

          <p>
            Dealer
            <span>{{ dialogData.display_name }}</span>
          </p>
        </div>
      </template>
      <Divider class="ice-divider" />

      <div v-if="dialogData" class="space-y-2">
        <div class="flex items-center justify-center">
          <!-- Spinner -->
          <div v-if="imageLoading" class="absolute inset-0 flex items-center justify-center">
            <i class="pi pi-spinner pi-spin text-blue-500 text-lg"></i>
          </div>
        </div>

        <p class="m-1 mt-2">
          <span class="text-xs text-gray-500">Id:</span>
          <span class="text-xs ml-2">{{ dialogData.id }}</span>
        </p>

        <p class="m-1">
          <span class="text-xs text-gray-500">Role:</span>
          <span class="text-sm ml-2">{{ dialogData.role.toUpperCase() }}</span>
        </p>

        <p v-if="dialogData.contact" class="m-1">
          <span class="text-xs text-gray-500">Contact No.:</span>
          <span class="text-sm ml-2">{{ dialogData.contact }}</span>
        </p>
        <p class="m-1">
          <span class="text-xs text-gray-500">Email:</span>
          <span class="text-sm ml-2">{{ dialogData.email }}</span>
        </p>

        <p v-if="dialogData.status" class="m-1">
          <span class="text-xs text-gray-500">Status:</span>
          <i
            v-if="dialogData.status === 'approved'"
            class="pi pi-thumbs-up text-green-600 text-sm ml-2"
          ></i>
          <span v-else class="text-sm ml-2 text-orange-600">
            {{ dialogData.status }}
          </span>
        </p>

        <!-- <p v-if="dialogData.name">
          <span class="text-xs text-gray-500">Dealer:</span>
          <span class="text-xl ml-2">{{ dialogData.name }}</span>
        </p> -->

        <p class="m-1">
          <span class="text-xs text-gray-500">Account Created:</span>
          <span class="text-xs ml-2">{{ formatDate(dialogData.created_at) }}</span>
        </p>
        <p class="m-1">
          <span class="text-xs text-gray-500">Last Sign-in:</span>
          <span class="text-xs ml-2">
            <template v-if="dialogData.last_sign_in_at">
              {{ formatDate(dialogData.last_sign_in_at) }}
            </template>

            <template v-else>
              <i class="pi pi-clock text-orange-500 mr-1"></i>
              <span class="text-orange-600">Awaiting first sign-in</span>
            </template>
          </span>
        </p>

        <p v-if="dialogData.role === 'customer' && dialogData.last_order_placed" class="m-1">
          <span class="text-xs text-gray-500">Last Order Placed:</span>
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

const columnDefaults = {
  headerClass: "bg-blue-400 text-xs text-gray-100",
  bodyClass: "text-xs whitespace-pre-line",
};

const router = useRouter();
const route = useRoute();

const imageLoading = ref(true);

const storesProfile = useStoresProfile();
const confirm = useConfirm();
const toast = useToast();

const handleUpdate = (store) => {
  console.log("pass value to update page: ", store);

  // 👇 store selected here
  storesProfile.setProfile(store);

  // 👇 then navigate
  router.push({ name: "StoresProfileUpdate" });

  // router.push({
  //   name: "StoresProfileUpdate",
  //   query: {
  //     role: filterRole.value,
  //     search: searchValue.value,
  //   },
  // });
};

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
      { label: "Store", key: "store" },
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

const onRoleChanged = async () => {
  router.replace({
    query: {
      ...route.query,
      role: filterRole.value,
    },
  });

  await fetchStoresProfile();
};

const onSearch = async () => {
  router.replace({
    query: {
      ...route.query,
      search: searchValue.value || undefined,
    },
  });

  await fetchStoresProfile();
};

// onMounted(async () => {
//   filterRole.value = route.query.role === undefined ? null : route.query.role;
//   await fetchStoresProfile();
// });

onMounted(async () => {
  filterRole.value = route.query.role ?? null;
  searchValue.value = route.query.search ?? "";

  await fetchStoresProfile();
});
</script>
