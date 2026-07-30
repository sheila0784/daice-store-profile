import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";

export function usePermissions() {
  const authStore = useAuthStore();
  const { role } = storeToRefs(authStore);

  const normalizedRole = computed(() => role.value?.toLowerCase());

  //   const showCreateNew = computed(() => role.value === "it");
  const showCreateNew = computed(() => ["it"].includes(normalizedRole.value));
  const showActionBtnEdit = computed(() => ["it"].includes(normalizedRole.value));
  const showActionBtnDelete = computed(() => ["it"].includes(normalizedRole.value));

  return {
    role,
    showCreateNew,
    showActionBtnEdit,
    showActionBtnDelete,
  };
}
