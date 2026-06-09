<template>
  <div class="min-h-screen text-sm">
    <MenuBar />
    <Card class="w-full max-w-full shadow-2 border-gray-300 mx-auto">
      <template #title>
        <div class="flex items-center gap-2">
          <!-- <i class="pi pi-megaphone text-yellow-500"></i> -->
          <span>Announcements</span>
        </div>
      </template>
      <template #content>
        <!-- <div class="flex flex-col gap-2 flex-row md:items-center"> -->
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <div class="w-full md:flex-1">
            <!-- <div class="w-full flex gap-2"> -->
            <div class="w-full flex flex-col sm:flex-row flex-wrap gap-2">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="searchValue" placeholder="Search" />
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
          :rows="10"
          :loading="loading"
          class="p-datatable-sm"
        >
        <Column field="title" header="Title" sortable headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
        <Column field="body" header="Content" sortable headerClass="bg-yellow-50 text-xs" bodyClass="text-xs"></Column>
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
import Card from "primevue/card";
import MenuBar from "../components/Menubar.vue";
import Button from "primevue/button";

import Divider from "primevue/divider";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";


</script>
