import { ref } from "vue";
import { supabase } from "../supabase";

export function useDashboardCards(dateRange) {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const salesData = ref([]);

  const loading = ref(false);

  const fetchDashboardCards = async () => {
    loading.value = true;

    let start = null;
    let end = null;

    if (dateRange.value?.[0] && dateRange.value?.[1]) {
      start = dateRange.value[0];
      // start.setHours(0, 0, 0, 0);
      start.setHours(23, 59, 59, 999);

      end = dateRange.value[1];
      end.setHours(23, 59, 59, 999);

      start = start.toISOString();
      end = end.toISOString();
    }
  
    console.log("Fetching sales data with date range:", { start, end });


    const { data, error } = await supabase.rpc("get_sales_summary", {
      start_date: start,
      end_date: end,
    });

    if (error) {
      console.error(error);
      return;
    }

    salesData.value = data;
    console.log("Fetched sales data:", salesData.value);
    // console.log("Date range in composable:", dateRange.value);

    loading.value = false;
  };

  const dealerCount = ref(0);
  const customerCount = ref(0);
  const riderCount = ref(0);

  const fetchCounts = async () => {
    const [
      { count: dealers, error: dealerError },
      { count: customers, error: customerError },
      { count: riders, error: riderError },

    ] = await Promise.all([
      supabase.from("stores").select("*", { count: "exact", head: true }).eq("active", true),

      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),

      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "rider"),

    ]);

    // console.log("Fetched dealer count:", dealers);
    // console.log("Fetched customer count:", customers);
    // console.log("Fetched rider count:", riders);  

    if (dealerError || customerError || riderError) {
      console.error(dealerError || customerError || riderError);
      return;
    }

    dealerCount.value = dealers ?? 0;
    customerCount.value = customers ?? 0;
    riderCount.value = riders ?? 0;

    return {
      dealers: dealerCount,
      customers: customerCount,
      riders: riderCount,
    };
  };

  return {
    rows,
    rowsPerPageOptions,
    loading,
    fetchDashboardCards,
    salesData,
    fetchCounts,
    dealerCount,
    customerCount,
    riderCount
  };
}
