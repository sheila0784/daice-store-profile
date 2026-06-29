<template>
  <div
    class="flex justify-center items-start min-h-screen p-8 bg-gradient-to-br from-white via-cyan-50 to-blue-100 login-page"
  >
    <Card class="shadow-8 p-1 bg-white/80 backdrop-blur-md border border-cyan-100 login-card">
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
            <InputText v-model="email" class="w-full text-sm text-gray-600" />
          </div>

          <div>
            <label class="text-xs block mb-2 text-gray-500">Password</label>
            <Password
              v-model="password"
              class="w-full text-sm"
              inputClass="w-full text-gray-700"
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
            class="login-btn w-full mb-4 text-xs"
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

  background: linear-gradient(90deg, transparent, #ffffff, #7dd3fc, #38bdf8, #ffffff, transparent);

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

.login-card {
  width: 100%;
  max-width: 380px;
  border-radius: 24px;

  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.92),
    rgba(244, 251, 255, 0.9),
    rgba(227, 245, 255, 0.88)
  );

  box-shadow:
    0 12px 30px rgba(0, 80, 150, 0.1),
    0 0 20px rgba(125, 211, 252, 0.18),
    inset 0 1px rgba(255, 255, 255, 0.9);
}

.login-btn {
  background: linear-gradient(180deg, #42b8ff, #0ea5e9);
  border: none;
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.3);
}

:deep(.login-btn .p-button-label) {
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-shadow: 0 1px 2px rgba(0, 70, 120, 0.25);
}

:deep(.login-btn .p-button-icon) {
  color: #f0fbff;
}

/* FOR EMAIL AND PASSWORD INTERFACE */
:deep(.p-inputtext),
:deep(.p-password-input) {
  background: rgba(255, 255, 255, 0.82) !important;
  color: #334155 !important; /* visible in light/dark browser theme */
  caret-color: #0284c7;

  border: 1px solid #cfefff;
  border-radius: 12px;

  backdrop-filter: blur(8px);
  transition: all 0.25s ease;

  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.8),
    0 0 8px rgba(125, 211, 252, 0.08);
}

:deep(.p-inputtext::placeholder),
:deep(.p-password-input::placeholder) {
  color: #94a3b8 !important;
}

:deep(.p-inputtext:hover),
:deep(.p-password-input:hover) {
  border-color: #7dd3fc;
}

:deep(.p-inputtext:focus),
:deep(.p-password-input:focus) {
  color: #334155 !important;
  background: rgba(255, 255, 255, 0.92) !important;

  border-color: #38bdf8;

  box-shadow:
    0 0 0 0.15rem rgba(56, 189, 248, 0.18),
    0 0 14px rgba(125, 211, 252, 0.25);
}
/* END OF EMAIL AND PASSWORD INTERFACE */

.portal-title {
  text-align: center;

  color: #38bdf8;

  font-size: 0.7rem;

  letter-spacing: 0.15em;

  text-transform: uppercase;

  font-weight: 600;

  opacity: 0.9;
}

/* FOOTER INTERFACE */
.footer-brand {
  text-align: center;
}

.company {
  font-size: 0.72rem;
  color: #64748b;
  font-weight: 500;
}

.copyright {
  margin-top: 0.4rem;
  font-size: 0.65rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

/* END OF FOOTER INTERFACE */
</style>
