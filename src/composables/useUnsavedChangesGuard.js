import { ref, onMounted, onBeforeUnmount } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useConfirm } from "primevue/useconfirm";

export function useUnsavedChangesGuard() {
  const confirm = useConfirm();
  const isDirty = ref(false);

  const markDirty = () => {
    isDirty.value = true;
  };

  const markClean = () => {
    isDirty.value = false;
  };

   const handleBeforeUnload = (event) => {
    if (!isDirty.value) return;

    event.preventDefault();
    event.returnValue = "";
  };

  onMounted(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });
  
  onBeforeRouteLeave((to, from, next) => {
    if (!isDirty.value) {
      next();
      return;
    }

    confirm.require({
      header: "Unsaved Changes",
      message: "You have unsaved changes. Leave this page?",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "Stay",
      acceptLabel: "Leave",
      rejectClass: "p-button-text",
      acceptClass: "p-button-danger",

      accept: () => {
        isDirty.value = false;
        next();
      },

      reject: () => next(false),
    });
  });

  return {
    isDirty,
    markDirty,
    markClean,
  };
}