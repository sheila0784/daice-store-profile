import { ref } from "vue";
import { supabase } from "../supabase";
import { useStoreStore } from "@/stores/storeStore";

export function useRpt() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const items = ref([]);

  const loading = ref(false);
  const selectedItem = ref(null);
  const searchValue = ref("");
  const filterStatus = ref([]);

  const fetchRpt = async () => {
    loading.value = true;

    const sv = searchValue.value?.trim() || "";
    const status = filterStatus.value;

    let query = supabase
      .from("report_ordersstatus")
      .select(`*`)
      .or(`dealer.ilike.%${sv}%,recipient.ilike.%${sv}%,code.ilike.%${sv}%`);

    const selectedStatus = Array.isArray(filterStatus.value)
      ? filterStatus.value[0]
      : filterStatus.value;

    if (selectedStatus != null && selectedStatus !== "") {
      console.log("Filtering by status:", selectedStatus);
      query = query.eq("status", selectedStatus);
    }

    // // ✅ Apply filter only when not null
    // if (status.length > 0 && status[0] !== null && status[0] !== undefined) {
    //   console.log("Filtering by status in condition:", status);
    //   query = query.eq("status", status);
    // }

    const { data, error } = await query.order("order_date", {
      ascending: false,
    });

    if (error) {
      console.error("Supabase error:", error);
    } else {
      items.value = data.map((item) => ({
        ...item,
        // profile_id: item.profiles?.id,
        // display_name: item.profiles?.display_name,
        // contact: item.profiles?.contact,
        // role: item.profiles?.role,
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
    filterStatus,
    fetchRpt,
  };
}
