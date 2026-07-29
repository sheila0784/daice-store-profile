import { ref } from "vue";
import { supabase } from "../supabase";

export function useAppAnnouncements() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const announcements = ref([]);
  const selectedAnnouncement = ref(null);

  const loading = ref(false);
  const error = ref(null);
  const searchValue = ref("");
  const showDialog = ref(false);
  const dialogData = ref(null);

  const fetchAnnouncements = async () => {
    loading.value = true;
    error.value = null;

    try {
      const sv = searchValue.value?.trim() || "";

      // const { data, error: fetchError } = await supabase
      //   .from("announcements")
      //   .select("*")
      //   .or(`title.ilike.%${sv}%,body.ilike.%${sv}%`)

      //   .order("created_at", { ascending: false });

      let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });

      if (sv) {
        query = query.or(`title.ilike.%${sv}%,body.ilike.%${sv}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        // console.error("Error fetching announcements:", fetchError);
        // error.value = "Failed to load announcements.";

        throw fetchError;
      }
      announcements.value = data ?? [];
    } catch (err) {
      console.error("Error fetching announcements:", err);

      error.value = err?.message || "Failed to load announcements.";
      announcements.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createAnnouncement = async (title, body, targetRoles) => {
    loading.value = true;
    error.value = null;

    console.log({
      title,
      body,
      targetRoles,
    });

    // try {
    //   const { data, error: createError } = await supabase

    //     .from("announcements")
    //     .insert([{ title, body, target_roles }])
    //     .select()
    //     .single();

    //   // if (createError) throw error;

    //   if (createError) {
    //     console.error("Create Error:", createError);
    //     throw createError;
    //   }

    //   announcements.value.unshift(data);

    //   return data;
    // } finally {
    //   loading.value = false;
    // }

    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        target_roles: targetRoles,
      };

      const { data, error: createError } = await supabase
        .from("announcements")
        .insert([payload])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      if (data) {
        announcements.value.unshift(data);
      }

      return data;
    } catch (err) {
      console.error("Create announcement error:", err);

      error.value = err?.message || "Failed to create announcement.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // const onRowClick = (event) => {
  //   console.log("on row click in composable");

  //   if (announcements.value?.id === event.data.id) {
  //     announcements.value = null;
  //     dialogData.value = null;

  //     showDialog.value = false;
  //     console.log("Deselected store:", event.data);
  //   } else {
  //     announcements.value = event.data;
  //     dialogData.value = event.data;

  //     showDialog.value = true;
  //     console.log("Selected announcement:", announcements.value, showDialog.value);
  //   }
  //   fetchAnnouncements(event.data.id);

  //   // fetchAnnouncements.selectedStore = { ...event.data };

  //   // showDialog.value = false;
  // };

  const onRowClick = (event) => {
    const clickedAnnouncement = event?.data;

    if (!clickedAnnouncement) {
      return;
    }

    if (selectedAnnouncement.value?.id === clickedAnnouncement.id) {
      selectedAnnouncement.value = null;
      dialogData.value = null;
      showDialog.value = false;
      return;
    }

    selectedAnnouncement.value = clickedAnnouncement;
    dialogData.value = clickedAnnouncement;
    showDialog.value = true;
  };

  const fetchAnnouncementById = async (id) => {
    if (!id) {
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("announcements")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error("Error fetching announcement:", err);

      error.value = err?.message || "Failed to load announcement.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    rows,
    rowsPerPageOptions,
    announcements,
    selectedAnnouncement,
    loading,
    error,
    searchValue,

    fetchAnnouncements,
    fetchAnnouncementById,
    createAnnouncement,
    showDialog,
    dialogData,
    onRowClick,
  };
}
