import { ref } from "vue";
import { supabase } from "../supabase";
import { useStoreStore } from "@/stores/storeStore";

export function useRpt(dateRange) {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const items = ref([]);

  const loading = ref(false);
  const selectedItem = ref(null);
  const searchValue = ref("");
  const filterStatus = ref([]);

  const formatDate = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const fetchRpt = async () => {
    loading.value = true;

    try {
      // Calculate current dates every time the report is fetched
      const start = formatDate(dateRange.value?.[0]);
      const end = formatDate(dateRange.value?.[1]);

      const sv = searchValue.value?.trim() || "";

      const selectedStatus = Array.isArray(filterStatus.value)
        ? filterStatus.value[0]
        : filterStatus.value;

      // console.log("Filtering by date range:", {
      //   dateRange: dateRange.value,
      //   start,
      //   end,
      // });

      let query = supabase
        .from("report_ordersstatus")
        .select("*");

      if (start && end) {
        query = query
          .gte("order_date", start)
          .lte("order_date", end);
      }

      if (sv) {
        query = query.or(
          `dealer.ilike.%${sv}%,recipient.ilike.%${sv}%,code.ilike.%${sv}%`
        );
      }

      if (selectedStatus != null && selectedStatus !== "") {
        query = query.eq("status", selectedStatus);
      }

      const { data, error } = await query.order("order_date", {
        ascending: false,
      });

      if (error) throw error;

      items.value = data ?? [];
    } catch (error) {
      console.error("Supabase error:", error);
      items.value = [];
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
    fetchRpt,
    dateRange,
  };
}
