import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

export const useListStore = defineStore("money-manager", {
  // const moneyManager = ref({});
  // const saveList = (payload: any) => {
  //   console.log("Here", payload);
  //   moneyManager.value = payload;
  //   console.log(moneyManager.value);
  // };
  // useStorage("demo", "moneyManager.value");
  // return { moneyManager, saveList };

  state: () => ({
    moneyManager: {},
  }),

  actions: {
    saveList(payload: any) {
      console.log("Here", payload);
      this.moneyManager = payload;
      console.log(this.moneyManager);
    },
  },
});
