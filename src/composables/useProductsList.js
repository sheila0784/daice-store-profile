import { ref } from "vue";
import { supabase } from "../supabase";

export function useProductsList() {
  const rows = ref(10);
  const rowsPerPageOptions = ref([10, 20, 50, 100, 200]);

  const products = ref([]);
  const selectedProduct = ref(null);

  const loading = ref(false);
  const error = ref(null);
  const searchValue = ref("");
  const showDialog = ref(false);
  const dialogData = ref(null);

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
      const sv = searchValue.value?.trim() || "";

      let query = supabase
        .from("products")
        .select("*")
        .order("category", { ascending: true })
        .order("code", { ascending: true });

      if (sv) {
        query = query.or(`code.ilike.%${sv}%,category.ilike.%${sv}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        // console.error("Error fetching products:", fetchError);
        // error.value = "Failed to load products.";

        throw fetchError;
      }
      products.value = data ?? [];
    } catch (err) {
      console.error("Error fetching products:", err);

      error.value = err?.message || "Failed to load products.";
      products.value = [];
    } finally {
      loading.value = false;
    }
  };

  const createProduct = async (id, category, code, weight, price, unit, image_url) => {
    loading.value = true;
    error.value = null;

    console.log({
      id,
      category,
      code,
      weight,
      price,
      unit,
      image_url,
    });

    try {
      const payload = {
        id: id.trim(),
        category: category.trim(),
        code: code.trim(),
        weight: weight,
        price: price,
        unit: unit,
        image_url: image_url?.trim() || null,
      };

      const { data, error: createError } = await supabase
        .from("products")
        .insert([payload])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      if (data) {
        products.value.unshift(data);
      }

      return data;
    } catch (err) {
      console.error("Create product error:", err);

      error.value = err?.message || "Failed to create product.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const onRowClick = (event) => {
    const clickedProduct = event?.data;

    if (!clickedProduct) {
      return;
    }

    if (selectedProduct.value?.id === clickedProduct.id) {
      selectedProduct.value = null;
      dialogData.value = null;
      showDialog.value = false;
      return;
    }

    selectedProduct.value = clickedProduct;
    dialogData.value = clickedProduct;
    showDialog.value = true;
  };

  const fetchProductById = async (id) => {
    if (!id) {
      return null;
    }

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error("Error fetching product:", err);

      error.value = err?.message || "Failed to load product.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    rows,
    rowsPerPageOptions,
    products,
    selectedProduct,
    loading,
    error,
    searchValue,

    fetchProducts,
    fetchProductById,
    createProduct,
    showDialog,
    dialogData,
    onRowClick,
  };
}
