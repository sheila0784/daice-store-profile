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

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Password:</div>
          <InputText
            ref="passwordRef"
            v-model="password"
            class="w-full"
            :invalid="!!errors.password"
            @keydown.enter.prevent="focusNext('confirmPasswordRef')"
          />
          <div />
          <small v-if="errors.password" class="flex text-red-500 items-center">{{
            errors.password
          }}</small>
        </div>

         <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Confirm Password:</div>
          <InputText
            ref="confirmpasswordRef"
            v-model="confirmPassword"
            class="w-full"
            :invalid="!!errors.confirmPassword"
            @keydown.enter.prevent="focusNextButton('statusRef')"
          />
          <div />
          <small v-if="errors.confirmPassword" class="flex text-red-500 items-center">{{
            errors.confirmPassword
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Status:</div>
          <InputText
            ref="statusRef"
            v-model="status"
            class="w-full"
            :invalid="!!errors.status"
            @keydown.enter.prevent="focusNextButton('submitRef')"
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
import { ref } from "vue";
import Card from "primevue/card";
import Divider from "primevue/divider";
import { useStoresProfile } from "@/stores/storeProfile";
import { storeToRefs } from "pinia";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";

import { useForm } from "vee-validate";
import * as yup from "yup";

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useStoresProfileUpdate } from "@/composables/useStoresProfileUpdate";
const { saveProfile, loading } = useStoresProfileUpdate();

const toast = useToast();

const schema = yup.object({
  display_name: yup.string().required("Profile name is required").min(3, "Minimum 3 characters"),

  contact: yup.string().required("Provide a contact number.").min(9, "Minimum 9 digits"),

  role: yup.string().required("Role is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  confirmPassword: yup.string().min(6, "Minimum 6 characters").required("Password is required").oneOf([yup.ref("password"), null], "Passwords must match")
});

const router = useRouter();
const storesProfile = useStoresProfile();
const { storesProfile: profile } = storeToRefs(storesProfile);

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
  enableReinitialize: true,
  initialValues: {
    display_name: profile.value?.display_name,
    role: profile.value?.role,
    avatar_url: profile.value?.avatar_url,
    contact: profile.value?.contact,
    store_id: profile.value?.store_id,
    email: profile.value?.email,
    password: profile.value?.password,
    status: profile.value?.status,
  },
});

const [display_name] = defineField("display_name");
const [role] = defineField("role");
const [avatar_url] = defineField("avatar_url");
const [contact] = defineField("contact");
const [store_id] = defineField("store_id");
const [email] = defineField("email");
const [password] = defineField("password");
const [status] = defineField("status");

const profileNameRef = ref(null);
const contactRef = ref(null);
const roleRef = ref(null);
const emailRef = ref(null);
const passwordRef = ref(null);
const statusRef = ref(null);
const submitRef = ref(null);

const refs = {
  profileNameRef,
  contactRef,
  roleRef,
  emailRef,
  passwordRef,
  statusRef,
  submitRef,
};
const { focusNext, focusNextSel, focusNextButton } = useFocusNavigation(refs);

const onSave = handleSubmit(async () => {
  console.log("Form values:", {
    display_name: display_name.value,
    role: role.value,
    avatar_url: avatar_url.value,
    contact: contact.value,
    store_id: store_id.value,
    email: email.value,
    password: password.value,
    status: status.value,
  });

  const payload = {
    id: profile.value.id,
    display_name: display_name.value,
    role: role.value,
    avatar_url: avatar_url.value,
    contact: contact.value,
    store_id: store_id.value,
    email: email.value,
    password: password.value,
    status: status.value,
  };

  try {
    // const result = await saveProfile(profile.value.id, payload);
    // console.log("Updated successfully:", result);

    // router.back();
    console.log("Payload to save:", payload);
    // await saveProfile(profile.value.id, payload);
    toast.add({
      severity: "success",
      summary: "Saved Successfully",
      detail: "Your profile has been updated.",
      life: 4000,
    });
    // router.back();
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

const roles = [
  { name: "Dealer", code: "dealer" },
  { name: "Customer", code: "customer" },
  { name: "Rider", code: "rider" },
];
</script>
