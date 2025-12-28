<template>
  <div class="container">
    <!-- <p>{{ msg }}</p> -->
    <div class="filters" v-if="availableTags.length">
      <span class="filter-label">Filter by tag:</span>
      <button
        v-for="tag in availableTags"
        :key="tag"
        type="button"
        class="filter-pill"
        :class="{ active: selectedTags.includes(tag) }"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
      <button
        v-if="selectedTags.length"
        type="button"
        class="clear-filter"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>

    <ul>
      <li v-for="entry in filteredEntries" :key="entry.id">
        <div class="entry-details">
          <div class="name-amount">
            <span>{{ entry.name }}</span>
            <span>
              {{ Intl.NumberFormat().format(parseFloat(entry.amount)) }}
            </span>
          </div>
          <div class="tags" v-if="entry.tags?.length">
            <span v-for="tag in entry.tags" :key="tag" class="tag-pill">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="actions">
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
      <input
        v-model="expense.tags"
        @input="clearError"
        placeholder="Add tags (comma separated)"
      />
      <button type="submit">{{ !isEditing ? 'Add to' : 'Edit' }} entry</button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import axios from 'axios'
import { useLoginStore } from '@/store/login'
import router from '@/router'
import Swal from 'sweetalert2'

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

const selectedTags = ref<string[]>([])

const route = useRoute()

const monthOfYear = ref('')

const expense = ref({
  id: 1,
  name: '',
  amount: '',
  tags: ''
})

const token = useLoginStore().token

const instance = axios.create({
  baseURL:
    'https://elereke-doughnut-default-rtdb.europe-west1.firebasedatabase.app',
  headers: {
    Authorization: `Bearer ${token}`,
    'Access-Control-Allow-Origin': '*'
  }
})

const normalizeTag = (tag: string) => {
  const trimmed = tag.trim()
  if (!trimmed) return ''
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

const parseTags = (rawTags: string | string[] | undefined) => {
  if (!rawTags) return []
  const tags = Array.isArray(rawTags) ? rawTags : rawTags.split(',')
  return tags
    .map((tag: string) => normalizeTag(tag))
    .filter((tag: string) => tag)
}

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  entries.value.forEach((entry: any) => {
    parseTags(entry.tags).forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b))
})

const filteredEntries = computed(() => {
  if (!selectedTags.value.length) return entries.value
  const loweredSelected = selectedTags.value.map((tag) => tag.toLowerCase())
  return entries.value.filter((entry: any) => {
    const entryTags = parseTags(entry.tags).map((tag) => tag.toLowerCase())
    return entryTags.some((tag: string) => loweredSelected.includes(tag))
  })
})

const total = computed(() =>
  filteredEntries.value.reduce(
    (accumulator: number, entry: any) => accumulator + Number(entry.amount || 0),
    0
  )
)

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((selected) => selected !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const clearFilters = () => {
  selectedTags.value = []
}

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
    editedEntry.tags = parseTags(expense.value.tags)
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
      amount: parseInt(expense.value.amount),
      tags: parseTags(expense.value.tags)
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
    console.log(response.data.data)
    if (!response.data.data) {
      entries.value = []
      return
    }
    entries.value = response.data.data.map((entry: any) => ({
      ...entry,
      amount: Number(entry.amount),
      tags: parseTags(entry.tags)
    }))
  } catch (error: any) {
    console.log('Can not get entries', error)
    entries.value = []
    if (error?.response?.status == 401) {
      Swal.fire({
        title: 'Unathorized request',
        text: 'Please login',
        icon: 'error'
      }).then((result: any) => {
        if (result.isConfirmed) {
          console.log('Bro')
          router.push('/login')
          location.reload()
        }
      })
      useLoginStore().$reset()
    }
  }
}

const clearError = () => {
  errorMessage.value = ''
}

const clearInput = () => {
  expense.value.name = ''
  expense.value.amount = ''
  expense.value.tags = ''
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
  expense.value.tags = parseTags(selectedEntry.tags).join(', ')
  selectedEntryId.value = selectedEntry.id
  selectedEntryName.value = selectedEntry.name
  isEditing.value = true
}

function formatRoute(path: string) {
  return path.slice(1).replace('/', '-')
}

onMounted(() => {
  monthOfYear.value = formatRoute(route.fullPath)
  getEntries()
})

onBeforeRouteLeave((to) => {
  monthOfYear.value = formatRoute(to.path)
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
  padding-bottom: 3rem;

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
  border-bottom: 1px solid #dadada;
  margin-bottom: 0.75rem;
  padding-bottom: 1rem;

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
  width: 100%;
  margin-top: 1px;

  span {
    padding-right: 0.5rem;
  }
}

.entry-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 60%;
}

.actions {
  display: flex;
  align-items: center;
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-pill {
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: #eef2ff;
  color: #312e99;
  font-size: 12px;
  border: 1px solid #dcdffe;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-label {
  font-weight: 600;
}

.filter-pill,
.clear-filter {
  border: 1px solid #dcdffe;
  background: #f7f8ff;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.filter-pill.active {
  background: #312e99;
  color: #fff;
  border-color: #312e99;
}

.clear-filter {
  border-color: #d01818;
  color: #d01818;
  background: #fff5f5;
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
    appearance: textfield;
    -moz-appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
