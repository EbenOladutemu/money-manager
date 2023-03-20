<template>
  <div>
    <!-- <p>{{ msg }}</p> -->
    <ul>
      <li v-for="list in lists" :key="list.id">
        <span>{{ list.name }}</span>
        &nbsp; &nbsp;
        <span>{{ list.amount }}</span>
      </li>
    </ul>
    <form @submit.prevent="add">
      <input v-model="expense.name" />
      <input v-model="expense.amount" />
      <button type="submit">Add to list</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { list } from "@/store/modules";

defineProps<{
  msg: string;
}>();

let lists = ref([
  {
    id: 0,
    name: "",
    amount: null,
  },
]);

const expense = ref({
  id: 1,
  name: "",
  amount: null,
});

const add = () => {
  lists.value.push({
    id: Math.floor(Math.random() * 1000),
    name: expense.value.name,
    amount: expense.value.amount,
  });
  console.log(expense.value);
  console.log(lists.value);
};
</script>

<style lang="scss" scoped>
* {
  text-align: left;
}

ul {
  list-style: none;
}
</style>
