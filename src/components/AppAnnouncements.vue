<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Announcements</div>
        </template>
        <template #content>
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <div class="w-full md:flex-1">
              <div class="daice-toolbar flex flex-col md:flex-row md:items-center gap-2">
                <IconField  class="daice-search w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="searchValue"
                    placeholder="Search"
                    class="w-full"
                    @keyup.enter="fetchAnnouncements"
                  />
                </IconField>
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

          <Divider />

          <DataTable
            :value="announcements"
            paginator
            :rows="rows"
            :rowsPerPageOptions="rowsPerPageOptions"
            stripedRows
            :loading="loading"
            selectionMode="single"
            class="daice-table w-full text-xs"
          >
            <Column field="title" header="Title" sortable v-bind="columnDefaults"></Column>
            <Column field="body" header="Content" v-bind="columnDefaults"></Column>
            <Column
              field="target_roles"
              header="Target Roles"
              sortable
              v-bind="columnDefaults"
            ></Column>
            <Column field="created_at" header="Created At" sortable v-bind="columnDefaults">
              <template #body="slotProps">
                {{ new Date(slotProps.data.created_at).toLocaleString() }}
              </template>
            </Column>
          </DataTable>
        </template>

        <template #footer>
          <div v-if="!announcements.length" class="flex gap-4 mt-1">
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
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import Card from "primevue/card";
import MenuBar from "../components/Menubar.vue";
import Button from "primevue/button";

import Divider from "primevue/divider";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Message from "primevue/message";

import { exportCsv } from "@/utils/exportCsv";
import { useAppAnnouncements } from "../composables/useAppAnnouncements";
import { formatDate } from "@/utils/date";

const columnDefaults = {
  headerClass: "bg-blue-400 text-xs text-gray-100",
  bodyClass: "text-xs whitespace-pre-line",
};

const router = useRouter();

const { rows, rowsPerPageOptions, announcements, loading, fetchAnnouncements, searchValue } =
  useAppAnnouncements();

const handleUpdate = (announcement) => {
  console.log("Edit announcement:", announcement);

  // 👇 then navigate
  router.push({ name: "AppAnnouncementsUpdate" });
};

const handleExport = () => {
  exportCsv({
    filename: `announcements_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "Title", key: "title" },
      { label: "Content", key: "body" },
      { label: "Target Roles", key: "target_roles" },
      { label: "Created At", key: "created_at_formatted" },
    ],
    data: announcements.value.map((item) => ({
      ...item,
      created_at_formatted: formatDate(item.created_at),
    })),
  });
};

onMounted(() => {
  fetchAnnouncements();
});
</script>
