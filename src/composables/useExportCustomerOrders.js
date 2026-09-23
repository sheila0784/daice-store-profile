import { ref } from "vue";
import { supabase } from "../supabase";
import { useStoreStore } from "@/stores/storeStore";

export function useExportCustomerOrders(dateRange) {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const items = ref([]);

  const loading = ref(false);
  const selectedItem = ref(null);
  const searchValue = ref("");
  const filterStatus = ref([]);
  const customerOrders = ref([]);
  const selRowDate = ref(null);
  const selRowDealer = ref(null);
  const store_id = ref([]);

  const ordersPerDay = ref([]);
  const showDiaordersPerDay = ref(false);

  // const formatDate = (date) => {
  //   if (!date) return null;

  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
  //   const day = String(date.getDate()).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };

  const formatDate = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchCustomerOrders = async () => {
    loading.value = true;

    try {
      let start = null;
      let end = null;

      if (dateRange.value?.[0] && dateRange.value?.[1]) {
        start = formatDate(new Date(dateRange.value[0]));
        end = formatDate(new Date(dateRange.value[1]));
      }

      console.log("Fetching customer orders with parameters:", {
        start,
        end,
        store_ids: store_id.value?.length ? store_id.value.map(String) : null,
      });
      
      const { data, error } = await supabase.rpc("export_app_orders", {
        p_start_date: start,
        p_end_date: end,
        p_store_ids: store_id.value?.length ? store_id.value.map(String) : null,
      });

      if (error) throw error;


      customerOrders.value = data ?? [];
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      customerOrders.value = [];
    } finally {
      loading.value = false;
    }
  };

  return {
    rows,
    rowsPerPageOptions,
    items,
    loading,
    selectedItem,
    searchValue,
    filterStatus,
    dateRange,
    customerOrders,
    fetchCustomerOrders,
    selRowDate,
    selRowDealer,
    showDiaordersPerDay,

    ordersPerDay,

    store_id,
  };
}
