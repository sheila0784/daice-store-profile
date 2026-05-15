import { ref } from "vue";
import { supabase } from "../supabase";

export function useStoresUpdate() {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);

  const deleteStore = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const { data, error: err } = await supabase
        .from("stores")
        .delete()
        .eq("id",id)
        .select()
        
      if (err) throw err;

      success.value = true;
      return data;
    } catch (err) {
      error.value = err;
      console.error("Delete store error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const saveStore = async (id, payload) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const { data, error: err } = await supabase.rpc("stores_save", {
        p_id: id ?? null,
        p_name: payload.name,
        p_acct_no: payload.acctNo,
        p_address: payload.address,
        p_province: payload.provinceName,
        p_city: payload.cityName,
        p_barangay: payload.barangayName,
        p_lon: payload.lon,
        p_lat: payload.lat,
        p_active: payload.active,
      });

      if (err) throw err;

      success.value = true;
      return data;
    } catch (err) {
      error.value = err;
      console.error("Store save error:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    saveStore,
    deleteStore,
    loading,
    error,
    success,
  };
}
