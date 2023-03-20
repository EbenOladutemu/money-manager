import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export const useListStore = defineStore("list", () => {
  const list = ref({
    name: "Doughnut",
    amount: 20000,
  });
  const saveList = (payload: any) => {
    console.log("Here", payload);
    list.value = payload;
  };

  return { list, saveList };
});
