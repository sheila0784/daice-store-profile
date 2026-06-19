<template>
  <div>
    <Toast />
    <Card>
      <template #title>
        <div class="flex gap-3">
          <Button severity="danger" variant="text" icon="pi pi-arrow-left" @click="router.back()" />
          Profile
        </div>
      </template>
      <template #content>
        <Divider />

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-cmedium p-2">Id:</div>
          <InputText
            disabled
            v-model="profile.id"
            class="w-full"
            @keydown.enter="focusNext('profileNameRef')"
          />
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Profile Name:</div>
          <InputText
            autofocus
            ref="profileNameRef"
            v-model="display_name"
            class="w-full"
            :invalid="!!errors.display_name"
            @keydown.enter="focusNext('contactRef')"
          />
          <div />
          <small v-if="errors.display_name" class="flex text-red-500 items-center">{{
            errors.display_name
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Contact No.:</div>
          <InputText
            ref="contactRef"
            v-model="contact"
            class="w-full"
            :invalid="!!errors.contact"
            @keydown.enter.prevent="focusNextSel('roleRef')"
          />
          <div />
          <small v-if="errors.contact" class="flex text-red-500 items-center">{{
            errors.contact
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Role:</div>
          <Select
            ref="roleRef"
            v-model="role"
            :options="roles"
            optionLabel="name"
            optionValue="code"
            class="w-full"
          />
          <div />
          <small v-if="errors.role" class="flex text-red-500 items-center">{{ errors.role }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Email:</div>
          <InputText
            ref="emailRef"
            v-model="email"
            class="w-full"
            :invalid="!!errors.email"
            @keydown.enter.prevent="focusNext('passwordRef')"
          />
          <div />
          <small v-if="errors.email" class="flex text-red-500 items-center">{{
            errors.email
          }}</small>
        </div>

        <div
          v-if="!profile.id || showPasswordFields"
          class="grid grid-cols-[110px_1fr] gap-2 p-2 pb-1 items-center"
        >
          <div class="font-medium p-2">Password:</div>
          <InputText
            type="password"
            ref="passwordRef"
            v-model="password"
            class="w-full"
            :invalid="!!errors.password"
            @keydown.enter.prevent="focusNext('confirmPasswordRef')"
          />
          <div />
          <small class="flex text-red-500 items-center">{{ errors.password }}</small>
        </div>

        <div
          v-if="!profile.id || showPasswordFields"
          class="grid grid-cols-[110px_1fr] gap-2 p-2 pt-0 pb-0 items-center"
        >
          <div class="font-medium p-2">Confirm Password:</div>
          <InputText
            type="password"
            ref="confirmPasswordRef"
            v-model="confirmPassword"
            class="w-full"
            :invalid="!!errors.confirmPassword"
            @keydown.enter.prevent="focusNextSel('storeNameRef')"
          />
          <div />
          <small v-if="errors.confirmPassword" class="flex text-red-500 items-center">{{
            errors.confirmPassword
          }}</small>
        </div>

        <!-- @click="showPasswordFields = !showPasswordFields" -->
        <div v-if="profile.id" class="flex rounded relative justify-end text-xs mb-4" role="alert">
          <Button
            :label="showPasswordFields ? 'Cancel' : 'Set New Password'"
            severity="primary"
            variant="text"
            class="p-0 pr-2 border-none bg-transparent shadow-none underline text-blue-500 hover:text-blue-700 text-xs"
            @click="togglePasswordFields"
          />
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Store:</div>
          <Select
            ref="storeNameRef"
            v-model="storeName"
            :options="storeList"
            optionLabel="label"
            optionValue="value"
            class="w-full"
            @keydown.enter.prevent="focusNextSel('statusRef')"
          />
          <div />
          <small v-if="errors.storeName" class="flex text-red-500 items-center">{{
            errors.storeName
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Status:</div>
          <Select
            ref="statusRef"
            v-model="status"
            :options="statusOptions"
            optionLabel="name"
            optionValue="code"
            class="w-full"
          />
          <div />
          <small v-if="errors.status" class="flex text-red-500 items-center">{{
            errors.status
          }}</small>
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
import { onMounted, ref, watch, nextTick } from "vue";
import Card from "primevue/card";
import Divider from "primevue/divider";
import { useStoresProfile } from "@/stores/storeProfile";
import { storeToRefs } from "pinia";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import Toast from "primevue/toast";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

import { useForm } from "vee-validate";
import * as yup from "yup";

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useStoresProfileUpdate } from "@/composables/useStoresProfileUpdate";
const { saveProfile, loading, fetchStores, storeList } = useStoresProfileUpdate();

const toast = useToast();

const schema = yup.object({
  display_name: yup.string().required("Profile name is required").min(3, "Minimum 3 characters"),

  contact: yup.string().required("Provide a contact number.").min(9, "Minimum 9 digits"),

  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  
  password: yup.string().when([], {
    is: () => !profile.value?.id || showPasswordFields.value,
    then: (schema) => schema.required("Password is required").min(6, "Minimum 6 characters"),
    otherwise: (schema) =>
      schema.test(
        "password-length",
        "Minimum 6 characters",
        (value) => !value || value.length >= 6,
      ),
  }),

  confirmPassword: yup.string().when("password", {
    is: (password) => !!password,
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.notRequired(),
  }),

  storeName: yup.string().required("Store is required"),
  status: yup.string().required("Status is required"),
});

const router = useRouter();
const storesProfile = useStoresProfile();
const { storesProfile: profile } = storeToRefs(storesProfile);

const { defineField, errors, handleSubmit, resetForm , setFieldValue} = useForm({
  validationSchema: schema,
});

const [display_name] = defineField("display_name");
const [role] = defineField("role");
// const [avatar_url] = defineField("avatar_url");
const [contact] = defineField("contact");
// const [store_id] = defineField("store_id");
const [email] = defineField("email");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const [storeName] = defineField("storeName");
const [status] = defineField("status");

const profileNameRef = ref(null);
const contactRef = ref(null);
const roleRef = ref(null);
const emailRef = ref(null);
const passwordRef = ref(null);
const confirmPasswordRef = ref(null);
const storeNameRef = ref(null);
const statusRef = ref(null);
const submitRef = ref(null);

const showPasswordFields = ref(false);
// const passwordButtonLabel = computed(() =>
//   showPasswordFields.value ? "Cancel" : "Set New Password",
// );

const togglePasswordFields = () => {
  if (showPasswordFields.value) {
    password.value = '' // clear password when cancelling
    confirmPassword.value = ''
  }

  showPasswordFields.value = !showPasswordFields.value
}

const refs = {
  profileNameRef,
  contactRef,
  roleRef,
  emailRef,
  passwordRef,
  confirmPasswordRef,
  storeNameRef,
  statusRef,
  submitRef,
};
const { focusNext, focusNextSel } = useFocusNavigation(refs); //focusNextButton

const onSave = handleSubmit(async (values) => {
  console.log("clicked submit", values);

  try {
    await saveProfile({
      id: profile.value?.id ?? null,
      display_name: values.display_name,
      contact: values.contact,
      role: values.role,

      storeName: values.storeName,

      status: values.status,
      email: values.email,

      ...(values.password && {
        password: values.password,
      }),
    });

    toast.add({
      severity: "success",
      summary: "Saved",
      detail: "User saved successfully",
      life: 3000,
    });
    router.back();
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message,
      life: 3000,
    });
  }
});

const roles = [
  { name: "Dealer", code: "dealer" },
  { name: "Customer", code: "customer" },
  { name: "Rider", code: "rider" },
];

const statusOptions = [
  { name: "Approved", code: "approved" },
  { name: "Pending", code: "pending" },
  { name: "Blocked", code: "blocked" },
];

watch(
  profile,
  (value) => {
    if (!value) return;

    console.log("here ---- ", value.storeName);
    resetForm({
      values: {
        display_name: value.display_name,
        role: value.role,
        avatar_url: value.avatar_url,
        contact: value.contact,
        // store_id: value.storeName,
        email: value.email,
        password: value.password,
        storeName: value.storeName ?? value.name,
        status: value.status,
      },
    });
  },
  { immediate: true },
);

// onMounted(async () => {
//   await fetchStores();
// });

onMounted(async () => {
  await fetchStores();
  await nextTick();

  const selectedStore = storeList.value.find(
    (x) => x.label === profile.value?.name
  );

  setFieldValue("storeName", selectedStore?.value ?? null);
});

</script>
