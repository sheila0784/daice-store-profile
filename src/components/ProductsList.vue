<template>
  <div class="daice-page min-h-screen text-sm">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title">Products</div>
        </template>
        <template #content>
          <div class="flex flex-col md:flex-row md:items-center gap-2">
            <div class="w-full md:flex-1">
              <div class="daice-toolbar flex flex-col md:flex-row md:items-center gap-2">
                <IconField class="daice-search w-full">
                  <InputIcon class="pi pi-search" />
                  <InputText
                    v-model="searchValue"
                    placeholder="Search"
                    class="w-full"
                    @keyup.enter="fetchProducts"
                  />
                </IconField>
              </div>
            </div>

            <div class="w-full md:w-auto md:ml-auto">
              <Button
                v-if="showCreateNew"
                type="button"
                severity="secondary"
                label="Create New"
                icon="pi pi-plus"
                :loading="loading"
                class="daice-action-btn text-xs"
                @click="handleCreate"
              />
            </div>
          </div>

          <Divider class="ice-divider" />
          <DataTable
            :value="products"
            paginator
            :rows="rows"
            :rowsPerPageOptions="rowsPerPageOptions"
            stripedRows
            :loading="loading"
            selectionMode="single"
            class="daice-table w-full text-xs"
            v-model:selection="selectedProduct"
            dataKey="id"
       
          >
            <!-- <Column field="id" header="ID" sortable v-bind="columnDefaults"></Column> -->
            <Column field="category" header="Category" sortable v-bind="columnDefaults"></Column>
            <Column field="code" header="Code" sortable v-bind="columnDefaults"></Column>
            <Column field="weight" header="Weight" sortable v-bind="columnDefaults"></Column>
            <Column field="price" header="Price" sortable v-bind="columnDefaults"></Column>
            <Column field="unit" header="Unit" sortable v-bind="columnDefaults"></Column>
            <Column field="image_url" header="Image URL" sortable v-bind="columnDefaults"></Column>

            <Column field="created_at" header="Created At" sortable v-bind="columnDefaults">
              <template #body="slotProps">
                {{ new Date(slotProps.data.created_at).toLocaleString() }}
              </template>
            </Column>

            <!-- Actions Column -->
            <Column style="width: 140px" v-bind="columnDefaults">
              <template #body="slotProps">
                <div class="flex gap-2">
                  <Button
                    v-if="showActionBtnEdit"
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    variant="text"
                    v-tooltip.bottom="'Edit Record'"
                    @click.stop="handleUpdate(slotProps.data)"
                  />

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
          <div v-if="!products.length" class="flex gap-4 mt-1">
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
import { useProductsList } from "../composables/useProductsList";
import { formatDate } from "@/utils/date";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

import { usePermissions } from "@/composables/usePermissions.js";
const { showCreateNew, showActionBtnEdit, showActionBtnDelete } = usePermissions();

const toast = useToast();
const confirm = useConfirm();

const columnDefaults = {
  headerClass: "bg-blue-400 text-xs text-gray-100",
  bodyClass: "text-xs whitespace-pre-line",
};

const router = useRouter();

const { rows, rowsPerPageOptions, products, selectedProduct, loading, searchValue, fetchProducts } =
  useProductsList();

const handleCreate = (product) => {
  console.log("Edit product:", product);

  selectedProduct.value = null;

  // 👇 then navigate
  router.push({ name: "ProductUpdate" });
};

const handleUpdate = (product) => {

  console.log("Edit product:", product);

   if (!product?.id) {
    console.error("Product ID is missing:", product);
    return;
  }

  selectedProduct.value = product;

  router.push({
    name: "ProductUpdate",
    params: {
      id: product.id,
    },
  });
};

const handleExport = () => {
  exportCsv({
    filename: `products_${new Date().toISOString().slice(0, 10)}.csv`,
    headers: [
      { label: "ID", key: "id" },
      { label: "Category", key: "category" },
      { label: "Code", key: "code" },
      { label: "Weight", key: "weight" },
      { label: "Price", key: "price" },
      { label: "Unit", key: "unit" },
    ],
    data: products.value.map((item) => ({
      ...item,
      created_at_formatted: formatDate(item.created_at),
    })),
  });
};


const handleDelete = (product) => {
  confirm.require({
    message: `Delete ${product.id} ${product.code}?`,
    header: "Confirm Delete",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancel",
    acceptLabel: "Delete",
    rejectClass: "p-button-secondary p-button-text",
    acceptClass: "p-button-danger",

    accept: async () => {
      try {
        // const result = await deleteProduct(product.id);
        // console.log("Deleted successfully:", result);
        
        toast.add({
          severity: "success",
          summary: "Deleted",
          detail: "Product deleted successfully",
          life: 3000,
        });

        await fetchProducts();
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

onMounted(() => {
  fetchProducts();
});
</script>
