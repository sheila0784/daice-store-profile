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

      let query = supabase.from("report_ordersstatus").select("*");

      if (start && end) {
        query = query.gte("order_date", start).lte("order_date", end);
      }

      if (sv) {
        query = query.or(`dealer.ilike.%${sv}%,recipient.ilike.%${sv}%,code.ilike.%${sv}%`);
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

  const deleteOrder = async (order) => {
    if (!order?.id) {
      throw new Error("Order ID is missing.");
    }

    // const orderId = order.id;
    const orderId = order?.order_id ?? order?.id;
    const tripId = order.trip_id;

    // Delete status history first
    const { data: deletedStatuses, error: statusError } = await supabase
      .from("order_status")
      .delete()
      .eq("order_id", orderId)
      .select("id, order_id");

    if (statusError) {
      throw new Error(`Failed to delete order statuses: ${statusError.message}`);
    }

    // console.log("Order ID used:", orderId);
    // console.log("Deleted statuses:", deletedStatuses);

    // if (!deletedStatuses?.length) {
    //   throw new Error(`No order_status records matched order_id ${orderId}.`);
    // }

    // Delete order items
    const { data: deletedItems, error: itemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId)
      .select();

    if (itemsError) {
      throw new Error(`Failed to delete order items: ${itemsError.message}`);
    }

    // // Delete status history
    // const { data: deletedStatuses, error: statusError } = await supabase
    //   .from("order_status")
    //   .delete()
    //   .eq("order_id", orderId)
    //   .select();

    // if (statusError) {
    //   throw new Error(`Failed to delete order statuses: ${statusError.message}`);
    // }

    // Delete parent order
    const { data: deletedOrder, error: orderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (orderError) {
      throw new Error(`Failed to delete order: ${orderError.message}`);
    }

    if (!deletedOrder) {
      throw new Error("Order was not found or could not be deleted.");
    }

    // Delete the associated trip only when one exists
    let deletedTrip = null;

    if (tripId) {
      const { data, error: tripError } = await supabase
        .from("order_trips")
        .delete()
        .eq("id", tripId)
        .select()
        .maybeSingle();

      if (tripError) {
        throw new Error(`Failed to delete order trip: ${tripError.message}`);
      }

      deletedTrip = data;
    }

    return {
      order: deletedOrder,
      items: deletedItems ?? [],
      statuses: deletedStatuses ?? [],
    };
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
    deleteOrder,
  };
}
