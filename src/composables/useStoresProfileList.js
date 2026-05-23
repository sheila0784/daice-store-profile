import { ref } from "vue";
import { supabase } from "../supabase";

export function useStoresProfileList() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const items = ref([]);

  const loading = ref(false);
  const selectedItem = ref(null);
  const searchValue = ref("");
  const filterRole = ref("");

  const showDialog = ref(false);
  const dialogData = ref(null);

  const fetchStoresProfile = async () => {
    loading.value = true;

    const sv = searchValue.value?.trim() || "";
    const role = filterRole.value?.trim() || null;
    
    console.log("Fetching profiles with searchValue:", sv, "and filterRole:", role);

    // let query = supabase.from("profiles").select(`*`);

    let query = supabase.from("profiles").select(`
  *,
  store:stores!profiles_store_id_fkey(
    id,
    acctNo,
    name,
    address, barangay, city, province, active
  )
`);

    // (role = X OR role IS NULL)
    if (role) {
      query = query.or(`role.eq.${role},role.is.null`);
    }

    // AND display_name LIKE '%sv%'
    if (sv) {
      query = query.ilike("display_name", `%${sv}%`);
    }

    const { data, error } = await query.order("updated_at", {
      ascending: false,
    });

    // if (error) {
    //   console.error("Supabase error:", error);
    // } else {
    //   items.value = data.map((item) => ({
    //     ...item,
    //     display_name: item.profiles?.display_name,
    //     contact: item.profiles?.contact,
    //     role: item.profiles?.role,
    //     status: item.profiles?.status,
    //     name: item.store?.name,
    //   }));
    // }

    // console.log("Fetched profiles:", data);

    // if (error) {
    //   console.error("Supabase error:", error);
    // } else {
    //   items.value = data.map((item) => ({
    //     ...item,
    //     display_name: item.display_name,
    //     contact: item.contact,
    //     role: item.role,
    //     status: item.status,
    //   }));
    // }

    if (error) {
      console.error("Supabase error:", error);
    } else {
      items.value = data.map((item) => ({
        id: item.id,
        store_id: item.store_id,
        updated_at: item.updated_at,

        // profile fields
        display_name: item.display_name,
        contact: item.contact,
        role: item.role,
        status: item.status,

        // joined store
        name: item.store?.name,
        acctNo: item.store?.acctNo,
        address: item.store?.address,
        barangay: item.store?.barangay,
        city: item.store?.city,
        province: item.store?.province,
        active: item.store?.active,
      }));
    }

    loading.value = false;
  };

  return {
    rows,
    rowsPerPageOptions,
    items,
    loading,
    selectedItem,
    searchValue,
    filterRole,
    fetchStoresProfile,

    showDialog,
    dialogData,
  };
}
