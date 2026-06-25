import { defineStore } from "pinia";

export const useProfileFilterStore = defineStore("profileFilter", {
  state: () => ({
    searchValue: "",
    filterRole: null,
  }),
});