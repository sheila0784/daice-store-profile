<template>
  <div class="daice-page min-h-screen">
    <Toast />
    <Card class="dashboard-shell">
      <!-- <template #title>
        <div class="flex gap-3">
          <Button severity="danger" variant="text" icon="pi pi-arrow-left" @click="router.back()" />
          Profile
        </div>
      </template> -->

      <template #title>
        <div class="dashboard-title flex items-center gap-3">
          <Button
            icon="pi pi-arrow-left"
            severity="contrast"
            variant="text"
            rounded
            @click="router.back()"
          />

          Profile Maintenance
        </div>
      </template>

      <template #subtitle>
        <div class="dashboard-subtitle">
          <i class="pi pi-user mr-2"></i>
          Da ICE Mobile App Administration Portal
        </div>

        <Divider class="ice-divider" />
      </template>

      <template #content>
        <div class="grid grid-cols-[110px_1fr] gap-1 p-1">
          <div class="daice-label"></div>
          <div class="flex flex-col items-center">
            <!-- <div>
              <img
                :src="imagePreview || avatar_url || defaultAvatar"
                class="w-[120px] h-[120px] object-cover rounded-full border-2 border-gray-300 shadow"
              />
            </div>

            <div>
              <FileUpload
                mode="basic"
                accept="image/*"
                @select="onImageSelected"
                :auto="true"
                :chooseButtonProps="{
                  severity: 'secondary',
                  variant: 'text',
                  size: 'small',
                  icon: 'pi pi-image',
                  label: 'Select Photo',
                }"
              />
            </div> -->

            <div class="flex flex-col items-center mb-4">
              <img :src="imagePreview || avatar_url || defaultAvatar" class="daice-avatar-lg" />

              <FileUpload
                mode="basic"
                accept="image/*"
                @select="onImageSelected"
                :auto="true"
                :chooseButtonProps="{
                  severity: 'secondary',
                  variant: 'text',
                  size: 'small',
                  icon: 'pi pi-image',
                  label: 'Select Photo',
                }"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="daice-label">Id:</div>
          <InputText
            disabled
            v-model="profile.id"
            class="daice-input w-full bg-gray-200 text-sm"
            @keydown.enter="focusNext('profileNameRef')"
          />
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Profile Name:</div>
          <InputText
            autofocus
            ref="profileNameRef"
            v-model="display_name"
            class="daice-input w-full"
            :invalid="!!errors.display_name"
            @keydown.enter="focusNext('contactRef')"
          />
          <div />
          <small v-if="errors.display_name" class="flex text-red-500 items-center">{{
            errors.display_name
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Contact No.:</div>
          <InputText
            ref="contactRef"
            v-model="contact"
            class="daice-input w-full"
            :invalid="!!errors.contact"
            @keydown.enter.prevent="focusNextSel('roleRef')"
          />
          <div />
          <small v-if="errors.contact" class="flex text-red-500 items-center">{{
            errors.contact
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Role:</div>
          <Select
            ref="roleRef"
            v-model="role"
            :options="roles"
            optionLabel="name"
            optionValue="code"
            class="daice-select w-full"
          />
          <div />
          <small v-if="errors.role" class="flex text-red-500 items-center">{{ errors.role }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Email:</div>
          <InputText
            ref="emailRef"
            v-model="email"
            class="daice-input w-full"
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
          <div class="daice-label">Password:</div>
          <InputText
            type="password"
            ref="passwordRef"
            v-model="password"
            class="daice-input w-full"
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
          <div class="daice-label">Confirm Password:</div>
          <InputText
            type="password"
            ref="confirmPasswordRef"
            v-model="confirmPassword"
            class="daice-input w-full"
            :invalid="!!errors.confirmPassword"
            @keydown.enter.prevent="focusNextSel('storeNameRef')"
          />
          <div />
          <small v-if="errors.confirmPassword" class="flex text-red-500 items-center">{{
            errors.confirmPassword
          }}</small>
        </div>

        <div v-if="profile.id" class="flex rounded relative justify-end text-xs mb-2" role="alert">
          <Button
            icon="pi pi-lock"
            :label="showPasswordFields ? 'Cancel' : 'Change Password'"
            severity="secondary"
            variant="outlined"
            size="small"
            class="text-xs"
            @click="togglePasswordFields"
          />
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Store:</div>
          <Select
            ref="storeNameRef"
            v-model="store_id"
            :options="storeList"
            optionLabel="label"
            optionValue="value"
            class="daice-select w-full"
            @keydown.enter.prevent="focusNextSel('statusRef')"
          />
          <div />
          <!-- <small v-if="errors.storeName" class="flex text-red-500 items-center">{{
            errors.storeName
          }}</small> -->

          <small v-if="errors.store_id" class="flex text-red-500 items-center">
            {{ errors.store_id }}
          </small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
          <div class="daice-label">Status:</div>
          <Select
            ref="statusRef"
            v-model="status"
            :options="statusOptions"
            optionLabel="name"
            optionValue="code"
            class="daice-select w-full"
          />
          <div />
          <small v-if="errors.status" class="flex text-red-500 items-center">{{
            errors.status
          }}</small>
        </div>

        <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
          <!-- <Button
            ref="submitRef"
            label="Submit"
            severity="primary"
            variant="text"
            class="flex justify-end"
            icon="pi pi-check"
            :loading="loading"
            @click="onSave"
          /> -->

          <Button
            ref="submitRef"
            class="daice-action-btn text-xs"
            icon="pi pi-check"
            label="Save Profile"
            :loading="loading"
            @click="onSave"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
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
import FileUpload from "primevue/fileupload";
import defaultAvatar from "@/assets/images/avatar-default.png";

import { useForm } from "vee-validate";
import * as yup from "yup";
import { supabase } from "../supabase";

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

  // storeName: yup.string().required("Store is required"),
  store_id: yup.string().required("Store is required"),

  status: yup.string().required("Status is required"),
});

const router = useRouter();
const storesProfile = useStoresProfile();
const { storesProfile: profile } = storeToRefs(storesProfile);

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

const [display_name] = defineField("display_name");
const [role] = defineField("role");
const [contact] = defineField("contact");
const [email] = defineField("email");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const [store_id] = defineField("store_id");
const [status] = defineField("status");

const [avatar_url] = defineField("avatar_url");
const selectedImageFile = ref(null);
const imagePreview = ref(null);

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

const togglePasswordFields = () => {
  if (showPasswordFields.value) {
    password.value = ""; // clear password when cancelling
    confirmPassword.value = "";
  }

  showPasswordFields.value = !showPasswordFields.value;
};

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
    const uploadedAvatarUrl = await uploadProfileImage();

    await saveProfile({
      id: profile.value?.id ?? null,
      display_name: values.display_name,
      contact: values.contact,
      role: values.role,
      store_id: values.store_id,

      status: values.status,
      email: values.email,
      avatar_url: uploadedAvatarUrl,

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
        email: value.email,
        password: value.password,
        store_id: value.store_id ?? value.store?.id ?? null,
        status: value.status,
      },
    });
  },
  { immediate: true },
);

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const resizeImage = (file, size = 512, quality = 0.85) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = size;
      canvas.height = size;

      // Crop to square
      const min = Math.min(img.width, img.height);

      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;

      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
              type: "image/jpeg",
            }),
          );
        },
        "image/jpeg",
        quality,
      );
    };

    reader.readAsDataURL(file);
  });
};

const onImageSelected = async (event) => {
  // const file = event.target.files?.[0];

  const file = event.files?.[0];
  if (!file) return;

  // Resize the image
  selectedImageFile.value = await resizeImage(file);
  // Preview the resized image
  imagePreview.value = URL.createObjectURL(selectedImageFile.value);

  // Optional: Check resized size
  if (selectedImageFile.value.size > MAX_FILE_SIZE) {
    toast.add({
      severity: "error",
      summary: "Image too large",
      detail: "Resized image is still larger than 2 MB.",
      life: 3000,
    });

    selectedImageFile.value = null;
    imagePreview.value = null;
    //event.target.value = "";
    return;
  }
};

const uploadProfileImage = async () => {
  // const { data: sessionData } = await supabase.auth.getSession();

  // console.log("Session:", sessionData?.session);
  // console.log("User:", sessionData?.session?.user);

  if (!selectedImageFile.value) {
    return avatar_url.value || null;
  }

  const file = selectedImageFile.value;
  const fileName = `${Date.now()}.jpg`;
  const filePath = `profiles/${fileName}`;

  const { data, error } = await supabase.storage.from("avatars").upload(filePath, file, {
    contentType: "image/jpeg",
    upsert: false,
  });

  console.log("Upload data:", data);
  console.log("Upload error:", error);

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

onMounted(async () => {
  await fetchStores();
});
</script>

<!-- <style scoped>
:deep(.p-fileupload-filename) {
  display: none;
}
</style> -->

<style scoped>
:deep(.avatar-upload .p-fileupload-filename),
:deep(.avatar-upload .p-fileupload-file-name),
:deep(.avatar-upload .p-fileupload-content),
:deep(.avatar-upload .p-fileupload-files) {
  display: none !important;
}
</style>
