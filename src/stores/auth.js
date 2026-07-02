import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const role = ref(null);

  function setUser(userData) {
    user.value = userData;
  }

  function setRole(userRole) {
    role.value = userRole;
  }

  function clear() {
    user.value = null;
    role.value = null;
  }

  return {
    user,
    role,
    setUser,
    setRole,
    clear,
  };
});
