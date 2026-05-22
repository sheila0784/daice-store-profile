import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';

import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Tooltip from "primevue/tooltip";

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './style.css'

const app = createApp(App)

// 1. PrimeVue first (UI plugin)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 2. Router second (navigation layer)
app.use(router)
app.use(ToastService);
// eslint-disable-next-line vue/multi-word-component-names
app.component("Toast", Toast);
app.use(ConfirmationService);
app.component("ConfirmDialog", ConfirmDialog);
app.directive("tooltip", Tooltip);

// app.use(createPinia()) // Pinia for state management

// 3. Mount last
app.mount('#app')