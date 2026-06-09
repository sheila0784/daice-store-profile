<template>
  <div class="flex justify-center items-center min-h-screen p-8">
   <Card class="shadow-2 p-4">
      <template #title>
        <div class="text-2xl font-bold text-center">Da ICE Login</div>
      </template>
      <template #subtitle>
        <div class="text-center text-gray-500 mb-4">Mobile App Administration Portal</div>
      </template>

      <template #content>
        <div class="flex flex-col gap-3 m-4">
          <div>
            <label class="block mb-2">Email</label>
            <InputText v-model="email" class="w-full" />
          </div>

          <div>
            <label class="block mb-2">Password</label>
            <Password v-model="password" class="w-full" :feedback="false" toggleMask />
          </div>

          <Button label="Login" icon="pi pi-sign-in" :loading="loading" @click="login" class="w-full mb-4"/>

          <Message v-if="errorMessage" severity="error">
            {{ errorMessage }}
          </Message>

          <Message v-if="successMessage" severity="success">
            {{ successMessage }}
          </Message>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "../supabase";

import Message from "primevue/message";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const login = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    loading.value = true;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
      return;
    }

    successMessage.value = "Login successful!";

    console.log(data);

    router.push("/dashboard");
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
