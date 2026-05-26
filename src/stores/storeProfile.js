import { defineStore } from "pinia";

export const useStoresProfile = defineStore("storesProfile", {
  state: () => ({
    storesProfile: {}
  }),
  actions: {
    setProfile(data) {
      this.storesProfile = data;
    }
  }
});