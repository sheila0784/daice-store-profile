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
            Announcement
          </div>
          <Divider class="ice-divider" />
        </template>
        <template #content>
          <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label">Id:</div>
            <InputText
              disabled
              v-model="id"
              class="daice-input w-full pr-10 bg-gray-200"
              @keydown.enter="focusNext('titleRef')"
            />
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label">Title:</div>
            <InputText
              autofocus
              ref="titleRef"
              v-model="title"
              class="daice-input w-full pr-10"
              @keydown.enter="focusNext('bodyRef')"
            />
            <div />
            <small v-if="errors.title" class="flex text-red-500 items-center">{{
              errors.title
            }}</small>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 pl-2 pr-2 items-center">
            <div class="daice-label">Body:</div>
            <Textarea ref="bodyRef" v-model="body" rows="5" autoResize class="daice-input w-full" />
            <div />
            <small v-if="errors.body" class="flex text-red-500 items-center">{{
              errors.body
            }}</small>
          </div>

          <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
            <div class="daice-label">Target Role:</div>
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex items-center gap-2">
                <Checkbox
                  ref="targetRolesRef"
                  v-model="target_roles"
                  inputId="dealer"
                  value="dealer"
                  class="daice-checkbox"
                />
                <label for="dealer">Dealer</label>
              </div>

              <div class="flex items-center gap-2">
                <Checkbox
                  v-model="target_roles"
                  inputId="customer"
                  value="customer"
                  class="daice-checkbox"
                />
                <label for="customer">Customer</label>
              </div>

              <div class="flex items-center gap-2">
                <Checkbox
                  v-model="target_roles"
                  value="rider"
                  @keydown.enter="focusNextButton('submitRef')"
                  class="daice-checkbox"
                />

                <label for="rider">Rider</label>
              </div>
            </div>
            <div />
            <small v-if="errors.target_roles" class="text-red-500">
              {{ errors.target_roles }}
            </small>
          </div>

          <div class="flex py-1 rounded relative gap-2 justify-end" role="alert">
            <Button
              ref="submitRef"
              :label="!id ? 'Publish' : 'Re-publish'"
              severity="primary"
              variant="text"
              class="daice-action-btn text-xs"
              icon="pi pi-check"
              :loading="loading"
              @click="onSave"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import MenuBar from "../components/Menubar.vue";
import { ref } from "vue";
import Card from "primevue/card";
import { useRouter } from "vue-router";
import Toast from "primevue/toast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";

import Divider from "primevue/divider";
import Textarea from "primevue/textarea";

import { useFocusNavigation } from "@/composables/useFocusNavigation";
import { useToast } from "primevue/usetoast";
import { useAppAnnouncements } from "@/composables/useAppAnnouncements";

import { useForm } from "vee-validate";
import * as yup from "yup";

// import { useUnsavedChangesGuard } from "@/composables/useUnsavedChangesGuard";
// const { markDirty, markClean } = useUnsavedChangesGuard();

// const publishButtonLabel = computed(() =>
//   id.value ? "Re-publish" : "Publish"
// );

const schema = yup.object({
  title: yup.string().required("Announcement title is required.").min(3, "Minimum 3 characters"),

  body: yup.string().required("Body is required.").min(9, "Minimum 9 characters"),

  target_roles: yup.array().min(1, "At least one role is required").required(),
});

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: schema,
});

const [title] = defineField("title");
const [body] = defineField("body");
const [target_roles] = defineField("target_roles");

const { createAnnouncement } = useAppAnnouncements();

const toast = useToast();

const loading = ref(false);
const titleRef = ref(null);
const bodyRef = ref(null);
const targetRolesRef = ref(null);
const submitRef = ref(null);

const refs = {
  titleRef,
  bodyRef,
  targetRolesRef,
  submitRef,
};
const { focusNext, focusNextButton } = useFocusNavigation(refs); //focusNextButton

const router = useRouter();

const onSave = handleSubmit(async (values) => {
  try {
    // await createAnnouncement(title.value, body.value, target_roles.value);

    await createAnnouncement(values.title, values.body, values.target_roles);

    toast.add({
      severity: "success",
      summary: "Saved",
      detail: "User saved successfully",
      life: 3000,
    });

    router.push("/appannouncements");
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: err.message,
      life: 3000,
    });
  }
});
</script>
