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
            Dealer Details
          </div>
          <Divider class="ice-divider" />
        </template>
        <template #content>
          <div v-if="store.id" class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label">Id:</div>
            <div class="relative w-full">
              <InputText
                disabled
                v-model="store.id"
                class="daice-input w-full bg-gray-200 text-sm"
                @keydown.enter="focusNext('storeRef')"
              />
            </div>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label">Store:</div>
            <div class="relative w-full">
              <InputText
                autofocus
                ref="storeRef"
                v-model="name"
                class="daice-input w-full pr-10"
                :invalid="!!errors.name"
                @keydown.enter="focusNext('acctNoRef')"
              />
              <i
                v-if="errors.name"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.name)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.name" class="flex text-red-500 items-center">{{
              errors.name
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 items-center">
            <div class="daice-label">Account No.:</div>
            <div class="relative w-full">
              <InputText
                ref="acctNoRef"
                v-model="acctNo"
                class="daice-input w-full pr-10"
                @keydown.enter="focusNext('addressRef')"
              />
              <i
                v-if="errors.acctNo"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.acctNo)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.acctNo" class="flex text-red-500 items-center">{{
              errors.acctNo
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Address:</div>
            <div class="relative w-full">
              <InputText
                ref="addressRef"
                v-model="address"
                class="daice-input w-full pr-10"
                :invalid="!!errors.address"
                @keydown.enter.prevent="focusNextSel('provinceRef')"
              />
              <i
                v-if="errors.address"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.address)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.address" class="flex text-red-500 items-center">{{
              errors.address
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Province:</div>
            <div class="relative w-full mb-1">
              <Select
                ref="provinceRef"
                v-model="province"
                :options="provinces"
                optionLabel="name"
                optionValue="code"
                :loading="loadingProvinces"
                inputId="province"
                class="daice-select w-full"
                :invalid="!!errors.province"
              />
              <i
                v-if="errors.province"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.province)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.province" class="flex text-red-500 items-center">{{
              errors.province
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 items-center">
            <div class="daice-label">City / Municipality:</div>
            <div class="relative w-full mb-1">
              <Select
                ref="cityRef"
                v-model="city"
                :options="cities"
                optionLabel="name"
                optionValue="code"
                :loading="loadingCities"
                :disabled="!province"
                inputId="city"
                class="daice-select w-full"
                :invalid="!!errors.city"
              />
              <i
                v-if="errors.city"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.city)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.city" class="flex text-red-500 items-center">{{
              errors.city
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 items-center">
            <div class="daice-label">Barangay:</div>
            <div class="relative w-full">
              <Select
                ref="barangayRef"
                v-model="barangay"
                :options="barangays"
                optionLabel="name"
                optionValue="code"
                :loading="loadingBarangays"
                :disabled="!city"
                inputId="barangay"
                class="daice-select w-full"
                :invalid="!!errors.barangay"
              />
              <i
                v-if="errors.barangay"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.barangay)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.barangay" class="flex text-red-500 items-center">{{
              errors.barangay
            }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Longitude:</div>
            <div class="relative w-full">
              <InputText
                ref="lonRef"
                v-model="lon"
                class="daice-input w-full pr-10"
                :invalid="!!errors.lon"
                @keydown.enter="focusNext('latRef')"
              />
              <i
                v-if="errors.lon"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.lon)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.lon" class="flex text-red-500 items-center">{{ errors.lon }}</small> -->
          </div>
          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Latitude:</div>
            <div class="relative w-full">
              <InputText
                ref="latRef"
                v-model="lat"
                class="daice-input w-full pr-10"
                :invalid="!!errors.lat"
                @keydown.enter="focusNextButton('submitRef')"
              />
              <i
                v-if="errors.lat"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.lat)"
              ></i>
            </div>

            <div />
            <!-- <small v-if="errors.lat" class="flex text-red-500 items-center">{{ errors.lat }}</small> -->
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label"></div>
            <div>
              <Checkbox inputId="active" v-model="activeModel" binary class="daice-checkbox mr-2" />
              <label for="active">Active</label>
            </div>
          </div>

          <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
            <Button
              ref="submitRef"
              class="daice-action-btn text-xs"
              label="Save Dealer"
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
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";
import { computed, ref, watch, onMounted } from "vue";
import Card from "primevue/card";
import Divider from "primevue/divider";
import { useStoreStore } from "@/stores/storeStore";
import { storeToRefs } from "pinia";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Select from "primevue/select";
import { usePSGC } from "@/composables/usePSGC";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

import { useForm } from "vee-validate";
import * as yup from "yup";

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useStoresUpdate } from "@/composables/useStoresUpdate";
const { saveStore, loading } = useStoresUpdate();

import Popover from "primevue/popover";

import { useUnsavedChangesGuard } from "@/composables/useUnsavedChangesGuard";
const { markDirty, markClean } = useUnsavedChangesGuard();

const errorPopover = ref();
const currentError = ref("");
const showError = (event, message) => {
  currentError.value = message;
  errorPopover.value.toggle(event);
};

const toast = useToast();

const {
  provinces,
  cities,
  barangays,
  loadingProvinces,
  loadingCities,
  loadingBarangays,
  fetchProvinces,
  fetchCities,
  fetchBarangays,
} = usePSGC();

const schema = yup.object({
  name: yup.string().required("Store name is required").min(3, "Minimum 3 characters"),

  // acctNo: yup
  //     .string()
  //     .required("Account No. is required")
  //     .matches(/^\d+$/, "Account No. must be a number")
  //     .length(13, "Account No. must be exactly 13 digits"),

  address: yup
    .string()
    .required("Provide a Unit/Room No., Floor, Building Name, House No., or Street")
    .min(3, "Minimum 3 characters"),

  province: yup.string().required("Province is required"),
  city: yup.string().required("City is required"),
  barangay: yup.string().required("Barangay is required"),
  lon: yup
    .number()
    .typeError("Longitude must be a valid number")
    .required("Longitude is required")
    .min(-180)
    .max(180),
  lat: yup
    .number()
    .typeError("Latitude must be a valid number")
    .required("Latitude is required")
    .min(-90)
    .max(90),
});

const router = useRouter();
const storeStore = useStoreStore();
const { selectedStore: store } = storeToRefs(storeStore);

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  validateOnMount: false,

  initialValues: {
    name: store.value?.name || "",
    acctNo: store.value?.acctNo || "",
    address: store.value?.address || "",

    lon: store.value?.lon || "",
    lat: store.value?.lat || "",
  },
});

const [name] = defineField("name");
const [acctNo] = defineField("acctNo");
const [address] = defineField("address");
const [province] = defineField("province");
const [city] = defineField("city");
const [barangay] = defineField("barangay");
const [lon] = defineField("lon");
const [lat] = defineField("lat");

const activeModel = computed({
  get: () => store.value?.active ?? true,
  set: (val) => {
    if (store.value) store.value.active = val;
  },
});

const storeRef = ref(null);
const acctNoRef = ref(null);
const addressRef = ref(null);
const provinceRef = ref(null);
const cityRef = ref(null);
const barangayRef = ref(null);
const lonRef = ref(null);
const latRef = ref(null);
const submitRef = ref(null);

const refs = {
  storeRef,
  acctNoRef,
  addressRef,
  provinceRef,
  cityRef,
  barangayRef,
  lonRef,
  latRef,
  submitRef,
};
const { focusNext, focusNextSel, focusNextButton } = useFocusNavigation(refs);

const initializing = ref(true);

watch(province, async (newCode, oldCode) => {
  if (!newCode) return;

  await fetchCities(newCode);

  if (initializing.value && oldCode && newCode !== oldCode) {
    city.value = null;
    barangay.value = null;
  }
});

watch(city, async (newCode, oldCode) => {
  if (!newCode) return;

  await fetchBarangays(newCode);

  if (initializing.value && oldCode && newCode !== oldCode) {
    barangay.value = null;
  }
});

onMounted(async () => {
  await fetchProvinces();

  const selectedProvince = provinces.value.find(
    (p) => p.name?.trim().toLowerCase() === store.value?.province?.trim()?.toLowerCase(),
  );

  if (!selectedProvince) {
    return;
  }
  province.value = selectedProvince.code;

  await fetchCities(selectedProvince.code);

  const selectedCity = cities.value.find(
    (c) => c.name?.trim().toLowerCase() === store.value?.city?.trim()?.toLowerCase(),
  );
  if (!selectedCity) {
    console.error("City not found:", store.value.city);
    return;
  }
  city.value = selectedCity.code;

  await fetchBarangays(selectedCity.code);

  const selectedBarangay = barangays.value.find(
    (b) => b.name?.trim().toLowerCase() === store.value?.barangay?.trim()?.toLowerCase(),
  );
  if (!selectedBarangay) {
    console.error("Barangay not found:", store.value.barangay);
    return;
  }
  barangay.value = selectedBarangay.code;

  initializing.value = false;
});

// async function onSave() {
const onSave = handleSubmit(async () => {
  const selectedProvince = provinces.value.find((p) => p.code === province.value);
  const selectedCity = cities.value.find((c) => c.code === city.value);
  const selectedBarangay = barangays.value.find((b) => b.code === barangay.value);

  const payload = {
    id: store.value.id,
    name: name.value,
    acctNo: acctNo.value,
    address: address.value,

    provinceCode: province.value,
    provinceName: selectedProvince?.name,

    cityCode: city.value,
    cityName: selectedCity?.name,

    barangayCode: barangay.value,
    barangayName: selectedBarangay?.name,

    lon: lon.value,
    lat: lat.value,

    active: activeModel.value,
  };

  // console.log(payload);

  try {
    const result = await saveStore(store.value.id, payload);
    console.log("Updated successfully:", result);

    // toast.add({
    //   severity: "success",
    //   summary: "Saved",
    //   detail: "Store saved successfully",
    //   life: 3000,
    // });

    markClean();
    router.back();
  } catch (err) {
    console.error("Save failed:", err);
    toast.add({
      severity: "error",
      summary: "Saved Failed",
      detail: err.message || "Something went wrong",
      life: 4000,
    });
  }
});

watch([name, acctNo, address, province, lon, lat], markDirty);
</script>
