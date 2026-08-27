<template>
  <div class="daice-page min-h-screen">
    <MenuBar />
    <Toast />
    <ConfirmDialog />
    <div class="dashboard-inner p-3 md:p-5">
      <Card class="dashboard-shell">
        <template #title>
          <div class="dashboard-title flex items-center gap-3">
            <Button
              icon="pi pi-arrow-left"
              severity="contrast"
              variant="text"
              rounded
              @click="router.back()"
            />
            Product Management
          </div>
          <Divider class="ice-divider" />
        </template>
        <template #content>
          <div class="daice-form-wrapper">
            <IftaLabel v-if="id" class="mb-2">
              <InputText
                readonly
                v-model="id"
                class="daice-input w-full pr-10 bg-gray-200 text-xs"
                @keydown.enter="focusNext('codeRef')"
              />
              <label for="id">Id</label>
            </IftaLabel>

            <IftaLabel class="mb-2">
              <InputText
                :readonly="!showCreateNew"
                autofocus
                ref="codeRef"
                v-model="code"
                class="daice-input w-full pr-10"
                @keydown.enter="focusNextSel('categoryRef')"
              />
              <div />
              <label for="code">Code</label>
               <i
                v-if="errors.code"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.code)"
              ></i>

            </IftaLabel>

            <IftaLabel class="mb-2">
              <Select
                ref="categoryRef"
                v-model="category"
                :options="categoryOptions"
                optionLabel="name"
                optionValue="code"
                class="daice-select w-full"
                @keydown.enter.prevent="focusNext('weightRef')"
              />

              <div />
              <!-- <small v-if="errors.category" class="flex text-red-500 items-center">{{
                errors.category
              }}</small> -->
              <label for="category">Category</label>
               <i
                v-if="errors.category"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.category)"
              ></i>
            </IftaLabel>

            <IftaLabel class="mb-2">
              <InputText
                :readonly="!showCreateNew"
                autofocus
                ref="weightRef"
                v-model="weight"
                class="daice-input w-full pr-10"
                @keydown.enter="focusNext('priceRef')"
              />
              <div />
              <!-- <small v-if="errors.weight" class="flex text-red-500 items-center">{{
                errors.weight
              }}</small> -->
              <label for="weight">Weight</label>
               <i
                v-if="errors.weight"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.weight)"
              ></i>
            </IftaLabel>

            <IftaLabel class="mb-2">
              <InputText
                :readonly="!showCreateNew"
                autofocus
                ref="priceRef"
                v-model="price"
                class="daice-input w-full pr-10"
                @keydown.enter="focusNextSel('unitRef')"
              />
              <div />
              <!-- <small v-if="errors.price" class="flex text-red-500 items-center">{{
                errors.price
              }}</small> -->
              <label for="price">Price</label>
              <i
                v-if="errors.price"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.price)"
              ></i>

            </IftaLabel>

            <IftaLabel class="mb-2">
              <Select
                ref="unitRef"
                v-model="unit"
                :options="unitOptions"
                optionLabel="name"
                optionValue="code"
                class="daice-select w-full"
                @keydown.enter.prevent="focusNext('urlRef')"
              />

              <div />
              <!-- <small v-if="errors.unit" class="flex text-red-500 items-center">{{
                errors.unit
              }}</small> -->
              <label for="unit">Unit</label>
               <i
                v-if="errors.unit"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.unit)"
              ></i>
            </IftaLabel>


               <IftaLabel class="mb-2">
              <InputText
                :readonly="!showCreateNew"
                autofocus
                ref="urlRef"
                v-model="image_url"
                class="daice-input w-full pr-10"
                @keydown.enter="focusNextButton('submitRef')"
              />
              <div />

              <label for="code">Image URL</label>
               <i
                v-if="errors.code"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.code)"
              ></i>

            </IftaLabel>


            <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
              <Button
                v-if="showCreateNew"
                ref="submitRef"
                label="Save"
                severity="primary"
                variant="text"
                class="daice-action-btn text-xs"
                icon="pi pi-check"
                :loading="loading"
                @click="onSave"
              />
            </div>
            <Popover ref="errorPopover">
              <div class="text-red-500 text-xs font-medium">
                {{ currentError }}
              </div>
            </Popover>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

import MenuBar from "../components/Menubar.vue";
import Card from "primevue/card";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";

import Divider from "primevue/divider";
import IftaLabel from "primevue/iftalabel";
import Popover from "primevue/popover";

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useToast } from "primevue/usetoast";

import { useProductsList } from "@/composables/useProductsList";

import { useForm } from "vee-validate";
import * as yup from "yup";

import { usePermissions } from "@/composables/usePermissions.js";
const { showCreateNew } = usePermissions();

const errorPopover = ref();
const currentError = ref("");
const showError = (event, message) => {
  currentError.value = message;
  errorPopover.value.toggle(event);
};


const unitOptions = [
  { name: "Pack", code: "Pack" },
  { name: "Bag", code: "Bag" },
  { name: "Sack", code: "Sack" },
];

const categoryOptions = [
  { name: "Ice", code: "Ice" },
  { name: "Crushed Ice", code: "Crushed Ice" },
];

const schema = yup.object({
  category: yup.string().required("Category is required.").min(3, "Minimum 3 characters"),

  code: yup.string().required("Code is required.").min(3, "Minimum 3 characters"),

  weight: yup
    .number()
    .typeError("Weight must be a number.")
    .required("Weight is required.")
    .positive("Weight must be greater than zero."),

  price: yup
    .number()
    .typeError("Price must be a number.")
    .required("Price is required.")
    .integer("Price must be a whole number.")
    .min(0, "Price cannot be negative."),


  unit: yup.string().required("Unit is required.").min(2, "Minimum 2 characters"),
});

const router = useRouter();
const route = useRoute();
const toast = useToast();

const { saveProduct, fetchProductById, loading } = useProductsList();

const id = ref(route.params.id ?? null);

const { defineField, errors, handleSubmit, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    id: "",
    category: "",
    code: "",
    weight: "",
    price: "",
    unit: "",
    image_url: "",
  },
});



const [category] = defineField("category");
const [code] = defineField("code");
const [weight] = defineField("weight");
const [price] = defineField("price");
const [unit] = defineField("unit");
const [image_url] = defineField("image_url");

const categoryRef = ref(null);
const codeRef = ref(null);
const weightRef = ref(null);
const priceRef = ref(null);
const unitRef = ref(null);
const image_urlRef = ref(null);

const submitRef = ref(null);

const refs = {
  categoryRef,
  codeRef,
  weightRef,
  priceRef,
  unitRef,
  image_urlRef,
  submitRef,
};

const { focusNext, focusNextButton, focusNextSel } = useFocusNavigation(refs); //focusNextButton

const onSave = handleSubmit(async (values) => {
  try {
    console.log("Form values:", values);

    await saveProduct(
      values.id,
      values.category,
      values.code,
      values.weight,
      values.price,
      values.unit,
      values.image_url,
    );

    toast.add({
      severity: "success",
      summary: "Saved",
      detail: "Product saved successfully",
      life: 3000,
    });

    await router.push("/productslist");
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err?.message || "Unable to save product.",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});

onMounted(async () => {
  if (!id.value) {
    return;
  }

  try {
    const product = await fetchProductById(id.value);

    setValues({
      id: product?.id ?? "",
      category: product?.category ?? "",
      code: product?.code ?? "",
      weight: product?.weight ?? "",
      price: product?.price ?? "",
      unit: product?.unit ?? "",
      image_url: product?.image_url ?? "",
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err?.message || "Unable to load the product.",
      life: 3000,
    });

    router.push("/productslist");
  }
});
</script>
