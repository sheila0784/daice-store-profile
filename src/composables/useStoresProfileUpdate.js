import { ref } from "vue";
import { supabase } from "../supabase";

export function useStoresProfileUpdate() {
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);
  const storeList = ref([]);

  // const deleteProfile = async (id) => {
  //   loading.value = true;
  //   error.value = null;
  //   success.value = false;

  //   try {
  //     // const { data, error: err } = await supabase
  //     //   .from("profiles_delete")
  //     //   .delete()
  //     //   .eq("id",id)
  //     //   .select()

  //     const { data, error: err } = await supabase.rpc("profiles_delete", { p_id: id });

  //     if (err) throw err;

  //     success.value = true;
  //     return data;
  //   } catch (err) {
  //     error.value = err;
  //     console.error("Delete profile error:", err);
  //     throw err;
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  const deleteProfile = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const { data, error: err } = await supabase.functions.invoke("admin-user-delete", {
        body: { id },
      });

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

  const fetchStores = async () => {
    loading.value = true;

    let query = supabase
      .from("stores")
      .select(
        `
    id,name, user_id
   
  `,
      )
      .eq("active", true);
    // .is("user_id", null);

    const { data, error } = await query.order("name", {
      ascending: true,
    });

    if (error) {
      console.error("Supabase error:", error);
      storeList.value = [];
      loading.value = false;
      return;
    }

    storeList.value = (data || []).map((store) => ({
      label: store.name,
      value: store.id,
    }));

    console.log("data", data);
    console.log("error", error);

    loading.value = false;
  };

  return {
    saveProfile,
    deleteProfile,
    loading,
    error,
    success,
    fetchStores,
    storeList,
  };
}
