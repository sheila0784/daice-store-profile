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

  const saveProfile = async (id, payload) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const { data, error: err } = await supabase.rpc("profiles_save", {
        p_id: id ?? null,
        p_role: payload.role,
        p_contact: payload.contact,
        p_display_name: payload.display_name,
        p_status: payload.status,
        p_email: payload.email,
        p_password: payload.password,
        p_store_id: payload.store_id,

      });

      if (err) throw err;

      success.value = true;
      return data;
    } catch (err) {
      error.value = err;
      console.error("Profile save error:", err);
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
