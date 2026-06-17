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

    let query = supabase.from("profiles_with_email").select(`
      *,
      store:stores!profiles_store_id_fkey(
        id,
        acctNo,
        name,
        address, barangay, city, province, active
      )
    `);

    if (role) {
      query = query.or(`role.eq.${role},role.is.null`);
    }

    // AND display_name LIKE '%sv%'
    if (sv) {
      // query = query.ilike("display_name", `%${sv}%`);
      query = query.or(`display_name.ilike.%${sv}%,email.ilike.%${sv}%,contact.ilike.%${sv}%`);
    }

    const { data, error } = await query.order("updated_at", {
      ascending: false,
    });

    if (error) {
      console.error("Supabase error:", error);
    } else {
      items.value = data.map((item) => ({
        id: item.id,
        store_id: item.store_id,
        updated_at: item.updated_at,
        created_at: item.created_at,
        last_sign_in_at: item.last_sign_in_at,
        last_order_placed: item.last_order_placed,
        last_delivery_at: item.last_delivery_at,
       
        // profile fields
        display_name: item.display_name,
        contact: item.contact,
        role: item.role,
        status: item.status,
        avatar_url: item.avatar_url,
        email: item.email,

        // joined store
        name: item.store?.name,
        acctNo: item.store?.acctNo,
        address: item.store?.address,
        barangay: item.store?.barangay,
        city: item.store?.city,
        province: item.store?.province,
        active: item.store?.active,

        // joined shipping_addresses
        // recipient: item.recipient,
        // shipping_address: item.shipping_address,
        // shipping_barangay: item.shipping_barangay,
        // shipping_city: item.shipping_city,
        // shipping_province: item.shipping_province,
        shipping_details: item.shipping_details
        
        
      }));
    }

    loading.value = false;
  };

  const onRowClick = (event) => {
    console.log("Row clicked:", event.data);
    if (selectedItem.value?.id === event.data.id) {
      selectedItem.value = null;
      dialogData.value = null;
      showDialog.value = false;
      console.log("Deselected profile:", event.data);
    } else {
      selectedItem.value = event.data;
      dialogData.value = event.data;
      showDialog.value = true;
      console.log("Selected profile:", selectedItem.value, showDialog.value);
    }
    //fetchStoreSched(event.data.id);

    //storeStore.selectedStore = { ...event.data };
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
    onRowClick,
    showDialog,
    dialogData,
  };
}
