<template>
  <div class="container">
    <!-- <p>{{ msg }}</p> -->
    <ul>
      <li v-for="list in lists" :key="list.id">
        <div class="name-amount">
          <span>{{ list.name }}</span>
          <span>{{ Intl.NumberFormat().format(parseFloat(list.amount)) }}</span>
        </div>
        <img
          src="@/assets/icons/delete.svg"
          alt="delete"
          @click="deleteItem(list.id)"
        />
      </li>
    </ul>
    <p class="total">
      <span>Total</span>
      <span>₦{{ Intl.NumberFormat().format(parseFloat(total)) }}</span>
    </p>
    <form @submit.prevent="add">
      <input v-model="expense.name" />
      <input type="number" v-model="expense.amount" />
      <button type="submit">Add to list</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { list } from "@/store/modules";

defineProps<{
  msg: string;
}>();

let lists: any = ref([]);

const total = ref("");

useStorage("lists", lists);

const expense = ref({
  id: 1,
  name: "",
  amount: null,
});

const add = (e: any) => {
  if (!expense.value.amount) {
    e.target[1].focus();
  }
  if (!expense.value.name) {
    e.target[0].focus();
  }
  if (expense.value.name && expense.value.amount) {
    lists.value.push({
      id: Math.floor(Math.random() * 10000),
      name: expense.value.name,
      amount: parseInt(expense.value.amount),
    });
    console.log(lists.value);
    expense.value.name = "";
    expense.value.amount = null;
    e.target[0].focus();
    getTotal();
  }
};

const deleteItem = (id: any) => {
  lists.value = lists.value.filter((list: any) => list.id !== id);
  getTotal();
};

const getTotal = () => {
  const totalArray: any = [];
  lists.value.forEach((element: any) => {
    totalArray.push(element.amount);
    const sum = totalArray.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    );
    total.value = sum;
  });
};

onMounted(() => {
  getTotal();
});
</script>

<style lang="scss" scoped>
* {
  text-align: left;
}

form {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;

  input {
    margin-right: 0;
    margin-bottom: 0.5rem;
    padding: 0.45rem;
    border: 1px solid #a3a3a3;
    border-radius: 4px;
    outline: none;

    &:focus {
      border: 1.5px solid #a3a3a3;
    }
  }

  button {
    text-align: center;
    padding: 0.5rem;
    border: 1px solid #18bc9c;
    border-radius: 4px;
    background: #18bc9c;
    color: #fff;
    font-weight: 600;

    &:focus {
      opacity: 0.9;
    }
  }

  @media screen and (min-width: 768px) {
    display: block;

    input {
      margin-right: 0.5rem;
    }
  }
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.75rem;

  &:hover > img {
    opacity: 1;
    margin-bottom: -2px;
    transition: opacity 0.5s;
  }

  img {
    opacity: 0;
    width: 21px;
    cursor: pointer;

    @media screen and (min-width: 991px) {
      margin-right: 13rem;
    }
  }
}

.name-amount {
  width: 60%;
}

li,
.name-amount,
.total {
  display: flex;
  justify-content: space-between;

  @media screen and (min-width: 800px) {
    width: 50%;
  }
}

.container {
  margin-left: 2rem;
  margin-right: 2rem;
}

.total {
  font-weight: bold;
  margin-top: 1rem;
  width: 60%;

  @media screen and (min-width: 800px) {
    width: 25%;
  }
}

input {
  &[type="number"] {
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
