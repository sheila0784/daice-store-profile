<template>
  <div>
    <Toast />
    <Card>
      <template #title>
        <div class="flex gap-3">
          <Button severity="danger" variant="text" icon="pi pi-arrow-left" @click="router.back()" />
          Announcement
        </div>
      </template>
      <template #content>
        <Divider />

        <!-- <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-cmedium p-2">Id:</div>
          <InputText disabled v-model="id" class="w-full" @keydown.enter="focusNext('titleRef')" />
        </div> -->

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Title:</div>
          <InputText
            autofocus
            ref="titleRef"
            v-model="title"
            class="w-full"
            @keydown.enter="focusNext('bodyRef')"
          />
          <div />
          <small v-if="errors.title" class="flex text-red-500 items-center">{{
            errors.title
          }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Body:</div>
          <Textarea ref="bodyRef" v-model="body" rows="5" autoResize class="w-full" />

          <div />
          <small v-if="errors.body" class="flex text-red-500 items-center">{{ errors.body }}</small>
        </div>

        <div class="grid grid-cols-[110px_1fr] gap-2 p-2 items-center">
          <div class="font-medium p-2">Target Role:</div>
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex items-center gap-2">
              <Checkbox
                ref="targetRolesRef"
                v-model="target_roles"
                inputId="dealer"
                value="dealer"
              />
              <label for="dealer">Dealer</label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox v-model="target_roles" inputId="customer" value="customer" />
              <label for="customer">Customer</label>
            </div>

            <div class="flex items-center gap-2">
              <Checkbox
                v-model="target_roles"
                value="rider"
                @keydown.enter="focusNextButton('submitRef')"
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
