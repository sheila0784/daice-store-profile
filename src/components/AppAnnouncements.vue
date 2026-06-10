<template>
  <div class="min-h-screen text-sm">
    <MenuBar />
    <Card class="w-full max-w-full shadow-2 border-gray-300 mx-auto">
      <template #title>
        <div class="flex items-center gap-2">
          <span>Announcements</span>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <div class="w-full md:flex-1">
            <div class="w-full flex flex-col sm:flex-row flex-wrap gap-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="searchValue" placeholder="Search"  @keyup.enter="fetchAnnouncements"/>
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
              class="md:ml-auto"
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
          
        >
        <Column field="title" header="Title" sortable headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
        <Column field="body" header="Content" headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
        <Column field="target_roles" header="Target Roles" sortable headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
        <Column field="created_at" header="Created At" sortable headerClass="bg-yellow-50 text-xs" bodyClass="text-xs">
          <template #body="slotProps">
            {{ new Date(slotProps.data.created_at).toLocaleString() }}
          </template>
        </Column>

        </DataTable>

      </template>

      <p class="text-gray-600">
        This is the Announcements page. You can add important updates or messages here for your
        users.
      </p>
    </Card>
  </div>
</template>

<script setup>
import { onMounted , ref} from "vue";
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

import { useAppAnnouncements } from "../composables/useAppAnnouncements";

const router = useRouter();

const { rows, rowsPerPageOptions, announcements, loading, fetchAnnouncements, searchValue } = useAppAnnouncements();

const handleUpdate = (announcement) => {
console.log("Edit announcement:", announcement);

  // 👇 then navigate
  router.push({ name: "AppAnnouncementsUpdate" });
};

onMounted(() => {
  fetchAnnouncements();
});

</script>
