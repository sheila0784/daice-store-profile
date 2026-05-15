import { ref } from "vue";
import { supabase } from "../supabase";
import { useStoreStore } from "@/stores/storeStore";

export function useStoresList() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const items = ref([]);
  const schedules = ref([]);

  const loading = ref(false);
  const selectedItem = ref(null);
  const searchValue = ref("");

  const showDialog = ref(false);
  const dialogData = ref(null);

  const longitude = ref(null);
  const latitude = ref(null);

  const fetchStores = async () => {
    loading.value = true;

    const sv = searchValue.value?.trim() || "";

    const { data, error } = await supabase
      .from("stores_with_coords")
      .select(
        `
        *,
        profiles:stores_user_id_fkey (
          display_name,
          role,
          contact
        )
      `,
      )
      .or(
        `name.ilike.%${sv}%,province.ilike.%${sv}%,city.ilike.%${sv}%,barangay.ilike.%${sv}%,acctNo.ilike.%${sv}%`,
      )
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Supabase error:", error);
    } else {
      items.value = data.map((item) => ({
        ...item,
        display_name: item.profiles?.display_name,
        contact: item.profiles?.contact,
        role: item.profiles?.role,
      }));
    }

    loading.value = false;
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");

    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12;
    h = h || 12;

    return `${h}:${minute} ${ampm}`;
  };

  const fetchStoreSched = async (storeId) => {
    loading.value = true;

    const { data, error } = await supabase
      .from("store_schedules")
      .select("*")
      .eq("store_id", storeId)
      .order("day_of_week");

    if (error) {
      console.error("Supabase error:", error);
      schedules.value = [];
      loading.value = false;
      return;
    }

    schedules.value = (data || []).map((itemsc) => ({
      ...itemsc,
      day_name: days[itemsc.day_of_week],
      open_time: formatTime(itemsc.open_time),
      close_time: formatTime(itemsc.close_time),
    }));

    loading.value = false;
  };

  const storeStore = useStoreStore();
  const onRowClick = (event) => {
    if (selectedItem.value?.id === event.data.id) {
      selectedItem.value = null;
      dialogData.value = null;
      longitude.value = null;
      latitude.value = null;
      showDialog.value = false;
      console.log("Deselected store:", event.data);
    } else {
      selectedItem.value = event.data;
      dialogData.value = event.data;
      longitude.value = event.data.lon;
      latitude.value = event.data.lat;
      showDialog.value = true;
      console.log("Selected store:", selectedItem.value, showDialog.value);
    }
    fetchStoreSched(event.data.id);

    storeStore.selectedStore = { ...event.data };
  };

  return {
    rows,
    rowsPerPageOptions,
    items,
    schedules,
    loading,
    selectedItem,
    searchValue,
    fetchStores,
    onRowClick,
    showDialog,
    dialogData,
    longitude,
    latitude,
    fetchStoreSched,
  };
}
