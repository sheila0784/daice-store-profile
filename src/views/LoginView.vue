<template>
  <div class="flex justify-center items-start min-h-screen p-8">
    <Card class="login-page flex shadow-8 p-1 bg-white/80 backdrop-blur-md border border-cyan-100 ">
      <!-- <div class="login-page flex justify-center items-start min-h-screen p-8"></div> -->
      
      <template #title>
        <div class="flex justify-center">
          <img src="/daice-logo.png" alt="Da ICE Logo" class="w-5rem h-5rem object-contain" />
        </div>
        <!-- <div class="text-2xl font-bold text-center text-blue-500">Da ICE Login</div> -->
      </template>
      <template #subtitle>
        <div class="text-sm text-center text-gray-500">Mobile App Administration Portal</div>
        <Divider class="ice-divider" />
      </template>

      <template #content>
        <div class="flex flex-col gap-3 m-4">
          <div>
            <label class="text-xs block mb-2 text-blue-400">Email</label>
            <InputText v-model="email" class="w-full text-sm" />
          </div>

          <div>
            <label class="text-xs block mb-2 text-blue-400">Password</label>
            <Password v-model="password" class="w-full text-sm" :feedback="false" toggleMask />
          </div>

          <Button
            label="Login"
            icon="pi pi-sign-in"
            :loading="loading"
            @click="login"
            iconClass="text-cyan-100"
            class="w-full mb-4 text-xs"
            severity="info"
          />

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
import Divider from "primevue/divider";

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

<style scoped>
/* :global(body) {
  background:
    linear-gradient(rgba(220, 240, 255, 0.65), rgba(220, 240, 255, 0.65)),
    url("/images/bg-login.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
} */

.login-page {
  min-height: 70vh;
  background:
    linear-gradient(rgba(220, 240, 255, 0.35), rgba(220, 240, 255, 0.35)),
    url("/images/bg-login.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
}

.ice-divider::before {
  content: "";
  display: block;
  height: 2px;
  border: none;

  background: linear-gradient(
    90deg,
    transparent,
    #ffffff,
    #7dd3fc,
    #38bdf8,
    #ffffff,
    transparent
  );

  background-size: 200% 100%;

  box-shadow:
    0 0 8px #7dd3fc,
    0 0 18px #38bdf8;

  animation: iceGlow 4s linear infinite;
}

@keyframes iceGlow {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}

</style>
