<template>
  <div>
    <Toast />
    <Card>
      <template #title>
        <div class="flex gap-3">
          <Button severity="danger" variant="text" icon="pi pi-arrow-left" @click="router.back()" />
          Store Details
        </div>
      </template>
      <template #content>
        <Divider />

        <div v-if="store.id" class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-cmedium p-2">Id:</div>
          <InputText
            disabled
            v-model="store.id"
            class="w-full"
            @keydown.enter="focusNext('storeRef')"
          />
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Store:</div>
          <InputText
            autofocus
            ref="storeRef"
            v-model="name"
            class="w-full"
            :invalid="!!errors.name"
            @keydown.enter="focusNext('acctNoRef')"
          />
          <div />
          <small v-if="errors.name" class="flex text-red-500 items-center">{{ errors.name }}</small>
        </div>

        <!-- v-model="store.acctNo" 
             :invalid="!!errors.acctNo"
            :maxlength="13"
        -->
        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Account No.:</div>
          <InputText
            ref="acctNoRef"
            v-model="acctNo"
            class="w-full"
            @keydown.enter="focusNext('addressRef')"
          />
          <div />
          <small v-if="errors.acctNo" class="flex text-red-500 items-center">{{
            errors.acctNo
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Address:</div>
          <InputText
            ref="addressRef"
            v-model="address"
            class="w-full"
            :invalid="!!errors.address"
            @keydown.enter.prevent="focusNextSel('provinceRef')"
          />
          <div />
          <small v-if="errors.address" class="flex text-red-500 items-center">{{
            errors.address
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Province:</div>
          <Select
            ref="provinceRef"
            v-model="province"
            :options="provinces"
            optionLabel="name"
            optionValue="code"
            :loading="loadingProvinces"
            inputId="province"
            class="w-full"
            :invalid="!!errors.province"
          />
          <div />
          <small v-if="errors.province" class="flex text-red-500 items-center">{{
            errors.province
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">City / Municipality:</div>
          <Select
            ref="cityRef"
            v-model="city"
            :options="cities"
            optionLabel="name"
            optionValue="code"
            :loading="loadingCities"
            :disabled="!province"
            inputId="city"
            class="w-full"
            :invalid="!!errors.city"
          />
          <div />
          <small v-if="errors.city" class="flex text-red-500 items-center">{{ errors.city }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Barangay:</div>
          <Select
            ref="barangayRef"
            v-model="barangay"
            :options="barangays"
            optionLabel="name"
            optionValue="code"
            :loading="loadingBarangays"
            :disabled="!city"
            inputId="barangay"
            class="w-full"
            :invalid="!!errors.barangay"
          />
          <div />
          <small v-if="errors.barangay" class="flex text-red-500 items-center">{{
            errors.barangay
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Longitude:</div>
          <InputText
            ref="lonRef"
            v-model="lon"
            class="w-full"
            :invalid="!!errors.lon"
            @keydown.enter="focusNext('latRef')"
          />
          <div />
          <small v-if="errors.lon" class="flex text-red-500 items-center">{{ errors.lon }}</small>
        </div>
        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Latitude:</div>
          <InputText
            ref="latRef"
            v-model="lat"
            class="w-full"
            :invalid="!!errors.lat"
            @keydown.enter="focusNextButton('submitRef')"
          />
          <div />
          <small v-if="errors.lat" class="flex text-red-500 items-center">{{ errors.lat }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="flex font-medium p-2"></div>
          <div>
            <Checkbox inputId="active" v-model="activeModel" binary class="mr-2" />
            <label for="active">Active</label>
          </div>
        </div>

        <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
          <Button
            ref="submitRef"
            label="Submit"
            severity="primary"
            variant="text"
            class="flex justify-end"
            icon="pi pi-check"
            :loading="loading"
            @click="onSave"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
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
</script>
