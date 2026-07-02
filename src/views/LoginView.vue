<template>
  <div class="flex justify-center items-start min-h-screen p-4 pt-8 sm:p-6 md:p-8 login-page">
    <Card class="shadow-8 p-1 backdrop-blur-md border border-cyan-100 login-card">
      <template #title>
        <div class="flex justify-center">
          <img src="/daice-logo.png" alt="Da ICE Logo" class="w-5rem h-5rem object-contain" />
        </div>
      </template>

      <template #subtitle>
        <div class="portal-title">
          <i class="pi pi-mobile mr-2"></i>
          Mobile App Administration Portal
        </div>

        <Divider class="ice-divider" />
      </template>

      <template #content>
        <div class="flex flex-col gap-3 m-4">
          <div>
            <label class="text-xs block mb-2 text-gray-500">Email</label>
            <InputText v-model="email" class="daice-input w-full" />
          </div>

          <div>
            <label class="text-xs block mb-2 text-gray-500">Password</label>
            <Password
              v-model="password"
               class="daice-password w-full"
              
              inputClass="daice-input w-full"
              :feedback="false"
              toggleMask
            />
          </div>

          <Button
            label="Login"
            icon="pi pi-sign-in"
            :loading="loading"
            @click="login"
            iconClass="text-cyan-100"
            class="login-btn w-full mb-4 text-xs text-white"
            severity="info"
          />

          <Message v-if="errorMessage" severity="error" size="small">
            {{ errorMessage }}
          </Message>

          <Message v-if="successMessage" severity="success" size="small">
            {{ successMessage }}
          </Message>
        </div>
      </template>

      <template #footer>
        <Divider class="ice-divider" />

        <div class="footer-brand">
          <div class="company">Purified Tube Ice • Garantisadong LIMPYO!</div>
          <div class="copyright">© 2026 Da ICE · Powered by Mr. Freeze</div>
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

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

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

    // --------------Check for Role---------------------
    const userId = data.user.id;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role, status")
      .eq("id", userId)
      .single();

    if (profileError) {
      errorMessage.value = "Unable to verify user role.";
      await supabase.auth.signOut();
      return;
    }

    const deniedRoles = ["dealer", "rider", "customer"];
    // // const allowedRoles = ["admin", "superadmin"];

    // if (!allowedRoles.includes(profile.role?.toLowerCase())) {
    if (deniedRoles.includes(profile.role?.toLowerCase())) {
      errorMessage.value = "Access denied!";
      await supabase.auth.signOut();
      return;
    }
    //--------------------------------------------------------

    //---------------SAVE ROLE AFTER VALIDATION---------------
    authStore.setUser(data.user);
    authStore.setRole(profile.role);

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
