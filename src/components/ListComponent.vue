<template>
  <div class="container">
    <!-- <p>{{ msg }}</p> -->
    <ul>
      <li v-for="entry in entries" :key="entry.id" @click="editEntry(entry)">
        <div class="name-amount">
          <span>{{ entry.name }}</span>
          <span>
            {{ Intl.NumberFormat().format(parseFloat(entry.amount)) }}
          </span>
        </div>
        <img
          src="@/assets/icons/delete.svg"
          alt="delete"
          @click="deleteEntry(entry.id)"
        />
      </li>
    </ul>
    <p class="total">
      <span>Total</span>
      <span>₦{{ Intl.NumberFormat().format(parseFloat(total)) }}</span>
    </p>
    <form @submit.prevent="addEntry">
      <input v-model="expense.name" />
      <input type="number" v-model="expense.amount" />
      <button type="submit">Add to entry</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from "vue";
import { useStorage } from "@vueuse/core";
import { useListStore } from "@/store/list";
import { useRoute } from "vue-router";

defineProps({
  msg: {
    type: String,
  },
});

let entries: any = ref([]);

const route = useRoute();

const store = useListStore();

const total = ref("0");

useStorage(route.fullPath.slice(1).replace("/", "-"), entries);

const expense = ref({
  id: 1,
  name: "",
  amount: null,
});

const addEntry = (e: any) => {
  if (!expense.value.amount) {
    e.target[1].focus();
  }
  if (!expense.value.name) {
    e.target[0].focus();
  }
  if (expense.value.name && expense.value.amount) {
    entries.value.push({
      id: Math.floor(Math.random() * 10000) + Date.now().toString(),
      name: expense.value.name,
      amount: parseInt(expense.value.amount),
    });
    expense.value.name = "";
    expense.value.amount = null;
    e.target[0].focus();
    getTotal();
  }
};

const deleteEntry = (id: any) => {
  entries.value = entries.value.filter((entry: any) => entry.id !== id);
  getTotal();
};

const editEntry = (selectedEntry: any) => {
  entries.value.find((entry: any) => entry.id != selectedEntry.id);

  console.log(selectedEntry);

  selectedEntry.name = "Dude";
};

const getTotal = () => {
  const totalArray: any = [];
  entries.value.forEach((element: any) => {
    totalArray.push(element.amount);
    const sum = totalArray.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    );
    total.value = sum;
  });
  if (entries.value.length == 0) {
    total.value = "0";
  }
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
    z-index: 1;
  }

  img {
    opacity: 0;
    width: 21px;
    position: relative;
    z-index: -1;
    cursor: pointer;
    transition: all ease-in-out 0.2s;

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
