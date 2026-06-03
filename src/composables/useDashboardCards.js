import { ref } from "vue";
import { supabase } from "../supabase";

export function useDashboardCards(dateRange) {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const salesData = ref([]);

  const loading = ref(false);

  // console.log("Date range in composable:", dateRange.value);

  const fetchDashboardCards = async () => {
    loading.value = true;

    let start = null;
    let end = null;

    if (dateRange.value?.[0] && dateRange.value?.[1]) {
      start = dateRange.value[0];
      end = dateRange.value[1];
    }

    // console.log("Fetching sales data with date range: ", { start, end });

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
    console.log("Date range in composable:", dateRange.value);

    loading.value = false;
  };

  return {
    rows,
    rowsPerPageOptions,
    loading,
    fetchDashboardCards,
    salesData,
  };
}
