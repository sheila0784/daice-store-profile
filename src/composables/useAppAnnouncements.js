import { ref } from "vue";
import { supabase } from "../supabase";

export function useAppAnnouncements() {
  const announcements = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAnnouncements = async () => {
    loading.value = true;
    const { data, error: fetchError } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) {
      console.error("Error fetching announcements:", fetchError);
      error.value = "Failed to load announcements.";
    }
    announcements.value = data;
    loading.value = false;
  };

  const createAnnouncement = async (title, content) => {
    loading.value = true;
    const { data, error: createError } = await supabase

      .from("announcements")
      .insert([{ title, content }])
      .select()
      .single();
    if (createError) {
      console.error("Error creating announcement:", createError);
      error.value = "Failed to create announcement.";
    } else {
      announcements.value.unshift(data);
    }
    loading.value = false;
  };

  return {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    createAnnouncement,
  };
}
