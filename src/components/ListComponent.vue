<template>
  <div class="container">
    <!-- <p>{{ msg }}</p> -->
    <ul>
      <li v-for="entry in entries" :key="entry.id">
        <div class="name-amount">
          <span>{{ entry.name }}</span>
          <span>
            {{ Intl.NumberFormat().format(parseFloat(entry.amount)) }}
          </span>
        </div>
        <div>
          <img
            src="@/assets/icons/edit.svg"
            alt="edit"
            @click="editEntry(entry)"
          />
          <img
            src="@/assets/icons/delete.svg"
            alt="delete"
            @click="deleteEntry(entry.id)"
          />
        </div>
      </li>
    </ul>
    <p class="total">
      <span>Total</span>
      <span>₦{{ Intl.NumberFormat().format(parseFloat(total)) }}</span>
    </p>
    <p class="amount" :class="{ error: errorMessage != '' }">
      {{
        errorMessage == ''
          ? `Amount: ₦${Intl.NumberFormat().format(
              parseFloat(expense.amount.length == 0 ? '0' : expense.amount)
            )}`
          : errorMessage
      }}
    </p>
    <form @submit.prevent="addEntry">
      <input
        v-model="expense.name"
        @input="clearError"
        placeholder="Enter name"
      />
      <input
        type="number"
        v-model="expense.amount"
        @input="clearError"
        placeholder="Enter amount"
      />
      <button type="submit">{{ !isEditing ? 'Add to' : 'Edit' }} entry</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

defineProps({
  msg: {
    type: String
  }
})

let entries: any = ref([])

let errorMessage = ref('')

let isEditing = ref(false)

const selectedEntryId = ref('')

const selectedEntryName = ref('')

const route = useRoute()

const total = ref('0')

const monthOfYear = ref(route.fullPath.slice(1).replace('/', '-'))

const expense = ref({
  id: 1,
  name: '',
  amount: ''
})

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

function addEntry(e: any) {
  if (isEditing.value) {
    const editedEntry = entries.value.find(
      (entry: any) => entry.id == selectedEntryId.value
    )

    if (expense.value.name !== selectedEntryName.value) {
      if (
        entries.value.find(
          (entry: any) =>
            entry.name.toLowerCase() === expense.value.name.toLowerCase().trim()
        )
      ) {
        errorMessage.value = `This name exists. Do you mean to edit ${expense.value.name.toUpperCase()}?`
        return
      }
    }

    if (!expense.value.name || !expense.value.amount) {
      errorMessage.value = 'Please enter both name and amount'
      return
    }

    editedEntry.name = expense.value.name
    editedEntry.amount = expense.value.amount
    clearError()
    clearInput()
    saveEntry()
    e.target[0].focus()
    return
  }

  if (!expense.value.name) {
    e.target[0].focus()
  }

  if (
    entries.value.find(
      (entry: any) =>
        entry.name.toLowerCase() === expense.value.name.toLowerCase().trim()
    )
  ) {
    errorMessage.value =
      'Name already exists. Edit or delete the entry or enter a different name'
    return
  }

  if (!expense.value.amount) {
    e.target[1].focus()
  }

  if (expense.value.name && expense.value.amount) {
    entries.value.push({
      id: Math.floor(Math.random() * 10000) + Date.now().toString(),
      name: expense.value.name.trim(),
      amount: parseInt(expense.value.amount)
    })

    saveEntry()

    clearInput()
    e.target[0].focus()
  }
}

async function saveEntry() {
  try {
    const response = await instance.patch(`/${monthOfYear.value}.json`, {
      data: entries.value
    })
    console.log(response)
  } catch (error) {
    alert("Can't save entry right now " + error)
  }
}

async function getEntries() {
  try {
    const response = await instance.get(`/${monthOfYear.value}.json`)
    if (!response.data.data) {
      return
    }
    entries.value = response.data.data
    getTotal()
  } catch (error) {
    console.log("Can't save entry right now " + error)
  }
}

const clearError = () => {
  errorMessage.value = ''
}

const clearInput = () => {
  expense.value.name = ''
  expense.value.amount = ''
  getTotal()
  isEditing.value = false
}

const deleteEntry = (id: any) => {
  entries.value = entries.value.filter((entry: any) => entry.id !== id)
  clearError()
  saveEntry()
}

const editEntry = (selectedEntry: any) => {
  document.querySelectorAll('input')[1].focus()
  expense.value.name = selectedEntry.name
  expense.value.amount = selectedEntry.amount
  selectedEntryId.value = selectedEntry.id
  selectedEntryName.value = selectedEntry.name
  isEditing.value = true
}

const getTotal = () => {
  const totalArray: any = []
  entries.value.forEach((element: any) => {
    totalArray.push(element.amount)
    const sum = totalArray.reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue,
      0
    )
    total.value = sum
  })

  if (entries.value.length == 0) {
    total.value = '0'
  }
}

onMounted(() => {
  getEntries()
})
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

  &:hover img {
    opacity: 1;
    z-index: 1;
  }

  img {
    opacity: 0;
    width: 21px;
    position: relative;
    z-index: -1;
    cursor: pointer;
    transition: all ease-in-out 0.2s;

    &:first-child {
      width: 18px;
      margin-right: 1rem;
    }

    @media screen and (min-width: 991px) {
      margin-right: 13rem;
    }
  }
}

.name-amount {
  width: 60%;
  margin-top: 1px;

  span {
    padding-right: 0.5rem;
  }
}

li,
.name-amount,
.total {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media screen and (min-width: 800px) {
    width: 65%;
  }
}

.amount {
  color: #744eff;
  font-weight: 600;
}

.container {
  margin-left: 2rem;
  margin-right: 2rem;
}

.total {
  font-weight: bold;
  margin-top: 1rem;
  width: 58.5%;

  @media screen and (min-width: 800px) {
    width: 41.5%;
  }
}

.error {
  color: #d01818;
}

input {
  &[type='number'] {
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
