// import { defineStore } from "pinia";

// export const useStoreStore = defineStore("storeStore", {
//   state: () => ({
//     selectedStore: {
//       name: "",
//       acctNo: "",
//       address: "",
//       barangay: "",
//       city: "",
//       province: "",
//       lat: null,
//       lon: null,
//       active: true,
//     },
//     provinces: [],
//   }),

//   actions: {
//     async fetchProvinces() {
//       try {
//         const response = await fetch("https://psgc.gitlab.io/api/provinces/");

//         const data = await response.json();

//         data.push({
//           code: "130000000",
//           name: "Metro Manila",
//         });

//         this.provinces = data.sort((a, b) => a.name.localeCompare(b.name));
//       } catch (error) {
//         console.error("Failed to fetch provinces:", error);
//       }
//     },
//   },

//   persist: true,

//   // persist: {
//   //   paths: ["selectedStore"],
//   // },
  
// });


import { defineStore } from "pinia";

export const useStoreStore = defineStore("storeStore", {
  state: () => ({
    selectedStore: {
      name: "",
      acctNo: "",
      address: "",
      barangay: "",
      city: "",
      province: "",
      lat: null,
      lon: null,
      active: true,
    },
  }),

  persist: true,
});