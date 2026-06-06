import { ref } from "vue";
import { supabase } from "../supabase";

export function useStoresProfileUpdate() {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);

  const deleteProfile = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      // const { data, error: err } = await supabase
      //   .from("profiles_delete")
      //   .delete()
      //   .eq("id",id)
      //   .select()

      const { data, error: err } = await supabase.rpc("profiles_delete", { p_id: id });

      if (err) throw err;

      success.value = true;
      return data;
    } catch (err) {
      error.value = err;
      console.error("Delete profile error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const saveProfile = async (payload) => {
    loading.value = true;
    error.value = null;

    console.log("Saving profile with payload:", payload);

    try {
      const { data, error: err } = await supabase.functions.invoke("admin-user-save", {
        // body: payload,
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (err) throw err;

      return data;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    saveProfile,
    deleteProfile,
    loading,
    error,
    success,
  };
}
