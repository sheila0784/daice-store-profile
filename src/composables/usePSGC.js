import { ref } from "vue";

export function usePSGC() {
  const provinces = ref([]);
  const cities = ref([]);
  const barangays = ref([]);

  const loadingProvinces = ref(false);
  const loadingCities = ref(false);
  const loadingBarangays = ref(false);

  const fetchProvinces = async () => {
    loadingProvinces.value = true;

    try {
      const res = await fetch("https://psgc.gitlab.io/api/provinces/");
      const data = await res.json();

      data.push({
        code: "130000000",
        name: "Metro Manila",
      });

      provinces.value = data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error("Failed to fetch provinces:", err);
    } finally {
        loadingProvinces.value=false;
    }
  };

  //   const fetchCities = async (provinceCode) => {
  //     try {

  //       const res = await fetch(
  //         `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`
  //       );

  //       const data = await res.json();
  //       cities.value = data.sort((a, b) =>
  //         a.name.localeCompare(b.name)
  //       );
  //     } catch (err) {
  //       console.error("Failed to fetch cities:", err);
  //     }
  //   };

  const fetchCities = async (provinceCode) => {
    loadingCities.value=true;
    try {
      const url =
        provinceCode == "130000000"
          ? `https://psgc.gitlab.io/api/regions/130000000/cities-municipalities/`
          : `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities/`;

      const res = await fetch(url);

      const data = await res.json();
      cities.value = data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    } finally {
        loadingCities.value=false;
    }
  };

  const fetchBarangays = async (cityCode) => {
    loadingBarangays.value=true;

    try {
      const res = await fetch(
        `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`,
      );

      const data = await res.json();
      barangays.value = data.sort((a, b) => a.name.localeCompare(b.name));
    } catch (err) {
      console.error("Failed to fetch barangays:", err);
    } finally {
        loadingBarangays.value=false;
    }
  };

  return {
    provinces,
    cities,
    barangays,

    loadingProvinces,
    loadingCities,
    loadingBarangays,
    
    fetchProvinces,
    fetchCities,
    fetchBarangays,
    
  };
}
