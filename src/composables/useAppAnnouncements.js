import { ref } from "vue";
import { supabase } from "../supabase";

export function useAppAnnouncements() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const announcements = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const searchValue = ref("");

  const fetchAnnouncements = async () => {
    loading.value = true;
    const sv = searchValue.value?.trim() || "";

    const { data, error: fetchError } = await supabase
      .from("announcements")
      .select("*")
      .or(`title.ilike.%${sv}%,body.ilike.%${sv}%`)

      .order("created_at", { ascending: false });
    if (fetchError) {
      console.error("Error fetching announcements:", fetchError);
      error.value = "Failed to load announcements.";
    }
    announcements.value = data;
    loading.value = false;
  };

  const createAnnouncement = async (title, body, target_roles) => {
    loading.value = true;

    console.log({
      title,
      body,
      target_roles,
    });

    try {
      const { data, error: createError } = await supabase

        .from("announcements")
        .insert([{ title, body, target_roles }])
        .select()
        .single();

      // if (createError) throw error;

      if (createError) {
        console.error("Create Error:", createError);
        throw createError;
      }

      announcements.value.unshift(data);

      return data;
    } finally {
      loading.value = false;
    }
  };

  return {
    rows,
    rowsPerPageOptions,
    announcements,
    loading,
    error,
    searchValue,
    fetchAnnouncements,
    createAnnouncement,
  };
}
