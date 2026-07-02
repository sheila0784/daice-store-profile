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

            Profile Maintenance
          </div>
          <Divider class="ice-divider" />
        </template>

        <template #content>
          <div class="grid grid-cols-[110px_1fr] gap-1 p-1">
            <div class="daice-label"></div>
            <div class="flex flex-col items-center">
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
            <div class="relative w-full mb-1">
              <InputText
                disabled
                v-model="profile.id"
                class="daice-input w-full bg-gray-200 text-sm"
                @keydown.enter="focusNext('profileNameRef')"
              />
            </div>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Profile Name:</div>
            <div class="relative w-full mb-1">
              <InputText
                autofocus
                ref="profileNameRef"
                v-model="display_name"
                class="daice-input w-full pr-10"
                :invalid="!!errors.display_name"
                @keydown.enter="focusNext('contactRef')"
              />
              <i
                v-if="errors.display_name"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.display_name)"
              ></i>
            </div>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Contact No.:</div>
            <div class="relative w-full mb-1">
              <InputText
                ref="contactRef"
                v-model="contact"
                class="daice-input w-full"
                :invalid="!!errors.contact"
                @keydown.enter.prevent="focusNextSel('roleRef')"
              />
              <i
                v-if="errors.contact"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.contact)"
              ></i>
              <div />
            </div>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Role:</div>
            <div class="relative w-full mb-1">
              <Select
                ref="roleRef"
                v-model="role"
                :options="roles"
                optionLabel="name"
                optionValue="code"
                class="daice-select w-full"
              />
              <i
                v-if="errors.role"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.role)"
              ></i>
            </div>

            <div />
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Email:</div>
            <div class="relative w-full mb-1">
              <InputText
                ref="emailRef"
                v-model="email"
                class="daice-input w-full"
                :invalid="!!errors.email"
                @keydown.enter.prevent="focusNext('passwordRef')"
              />
              <div />
              <i
                v-if="errors.email"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.email)"
              ></i>
            </div>
          </div>

          <div
            v-if="!profile.id || showPasswordFields"
            class="grid grid-cols-[110px_1fr] gap-2 p-2 pb-1 items-center"
          >
            <div class="daice-label">Password:</div>
            <div class="relative w-full mb-1">
              <InputText
                type="password"
                ref="passwordRef"
                v-model="password"
                class="daice-input w-full"
                :invalid="!!errors.password"
                @keydown.enter.prevent="focusNext('confirmPasswordRef')"
              />
              <i
                v-if="errors.password"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.password)"
              ></i>
            </div>
            <div />
          </div>

          <div
            v-if="!profile.id || showPasswordFields"
            class="grid grid-cols-[110px_1fr] gap-2 p-2 pt-0 pb-0 items-center"
          >
            <div class="daice-label">Confirm Password:</div>
            <div class="relative w-full mb-1">
              <InputText
                type="password"
                ref="confirmPasswordRef"
                v-model="confirmPassword"
                class="daice-input w-full"
                :invalid="!!errors.confirmPassword"
                @keydown.enter.prevent="focusNextSel('storeNameRef')"
              />
              <i
                v-if="errors.confirmPassword"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.confirmPassword)"
              ></i>
            </div>

            <div />
          </div>

          <div
            v-if="profile.id"
            class="flex rounded relative justify-end text-xs mb-2"
            role="alert"
          >
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

          <div
            v-if="['dealer', 'rider'].includes(role)"
            class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center"
          >
            <div class="daice-label">Store:</div>
            <div class="relative w-full mb-1">
              <Select
                ref="storeNameRef"
                v-model="store_id"
                :options="storeList"
                optionLabel="label"
                optionValue="value"
                class="daice-select w-full"
                @keydown.enter.prevent="focusNextSel('statusRef')"
              />
              <i
                v-if="errors.store_id"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.store_id)"
              ></i>
            </div>

            <div />
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 pt-2 items-center">
            <div class="daice-label">Status:</div>
            <div class="relative w-full mb-1">
              <Select
                ref="statusRef"
                v-model="status"
                :options="statusOptions"
                optionLabel="name"
                optionValue="code"
                class="daice-select w-full"
              />
              <i
                v-if="errors.status"
                class="pi pi-exclamation-circle daice-error-icon"
                @click="showError($event, errors.status)"
              ></i>
            </div>

            <div />
          </div>

          <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
            <Button
              ref="submitRef"
              class="daice-action-btn text-xs"
              icon="pi pi-check"
              label="Save Profile"
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

import Popover from "primevue/popover";

import { useUnsavedChangesGuard } from "@/composables/useUnsavedChangesGuard";
const { markDirty, markClean } = useUnsavedChangesGuard();

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useStoresProfileUpdate } from "@/composables/useStoresProfileUpdate";
const { saveProfile, loading, fetchStores, storeList } = useStoresProfileUpdate();

const toast = useToast();

const errorPopover = ref();
const currentError = ref("");
const showError = (event, message) => {
  currentError.value = message;
  errorPopover.value.toggle(event);
};

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

  store_id: yup.string().when("role", ([role], schema) => {
    return ["dealer", "rider"].includes(role)
      ? schema.required("Store is required")
      : schema.notRequired().nullable();
  }),

  status: yup.string().required("Status is required"),
});

const router = useRouter();
const storesProfile = useStoresProfile();
const { storesProfile: profile } = storeToRefs(storesProfile);

const { defineField, errors, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
});

// Tell VeeValidate not to validate on every model update.
const fieldOptions = {
  validateOnModelUpdate: false,
};
const [role] = defineField("role", fieldOptions);
const [store_id] = defineField("store_id", fieldOptions);

const [display_name] = defineField("display_name");
const [contact] = defineField("contact");
const [email] = defineField("email");
const [password] = defineField("password");
const [confirmPassword] = defineField("confirmPassword");
const [status] = defineField("status");
const [avatar_url] = defineField("avatar_url");
const selectedImageFile = ref(null);
const imagePreview = ref(null);

// Tell VeeValidate not to validate on every model update.
// const [store_id] = defineField("store_id", {
//   validateOnModelUpdate: false,
// });
// const [role] = defineField("role", {
//   validateOnModelUpdate: false,
// });

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
    markClean();
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
  { name: "IT", code: "it" },
  { name: "Viewer", code: "viewer" },
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

watch(
  () => role.value,
  (role) => {
    if (!["dealer", "rider"].includes(role)) {
      store_id.value = null;
      console.log("check here: ", role);
    }
  },
);

watch([display_name, contact, role, email, store_id, status, password, confirmPassword], markDirty);

onMounted(async () => {
  await fetchStores();
});
</script>

<style scoped>
:deep(.avatar-upload .p-fileupload-filename),
:deep(.avatar-upload .p-fileupload-file-name),
:deep(.avatar-upload .p-fileupload-content),
:deep(.avatar-upload .p-fileupload-files) {
  display: none !important;
}
</style>
