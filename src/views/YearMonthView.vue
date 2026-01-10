<template>
  <div class="home">
    <p class="welcome">
      Welcome, {{ loginStore.user.displayName }}
      <span>
        <button class="logout" @click="loginStore.logOut">Logout</button>
      </span>
    </p>
    <p class="toggle-years" @click="showYears = !showYears">
      Toggle {{ !showYears ? 'Years' : 'Months' }}
    </p>

    <p class="year-total">
      Year total (Jan - Dec): ₦{{ Intl.NumberFormat().format(yearTotal) }}
    </p>
    <p class="all-years-total">
      All years sumtotal: ₦{{ Intl.NumberFormat().format(allYearsTotal) }}
    </p>

    <nav v-show="showYears" v-for="year in years" :key="year">
      <router-link :to="`/${year}`" @click="showYears = false">
        {{ year }}
      </router-link>
      |
    </nav>

    <nav v-show="!showYears" v-for="month in months" :key="month">
      <router-link
        :to="{ name: `${month}-${currentYear}` }"
        :key="month"
        @click="showYears = false"
      >
        {{ month }}
      </router-link>
      |
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { useYearHelper } from '@/composables/year-helper'
import { useLoginStore } from '@/store/login'
import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import axios from 'axios'

const loginStore = useLoginStore()
const { years, months } = useYearHelper()
const showYears = ref(false)
const currentYear = ref(new Date().getFullYear().toString())
const yearTotal = ref(0)
const allYearsTotal = ref(0)
const route = useRoute()

const axiosInstance = axios.create({
  baseURL:
    'https://elereke-doughnut-default-rtdb.europe-west1.firebasedatabase.app',
  headers: {
    Authorization: `Bearer ${loginStore.token}`,
    'Access-Control-Allow-Origin': '*'
  }
})

const parseMonthKey = (year: string, month: string) =>
  `${year}-${month.toLowerCase()}`

const fetchYearTotal = async (year: string) => {
  try {
    const requests = months.map((month) =>
      axiosInstance.get(`/${parseMonthKey(year, month)}.json`)
    )
    const responses = await Promise.all(requests)
    const allEntries = responses.flatMap((res) => res.data?.data || [])
    yearTotal.value = allEntries.reduce(
      (sum: number, entry: any) => sum + Number(entry?.amount || 0),
      0
    )
  } catch (error) {
    console.log('Unable to fetch yearly total', error)
    yearTotal.value = 0
  }
}

const fetchAllYearsTotal = async () => {
  try {
    const currentYearNumber = new Date().getFullYear()
    const yearsToFetch = years.value
      .filter((year: number) => year <= currentYearNumber)
      .map(String)

    const requests = yearsToFetch.flatMap((year: string) =>
      months.map((month) =>
        axiosInstance.get(`/${parseMonthKey(year, month)}.json`)
      )
    )

    const responses = await Promise.all(requests)
    const allEntries = responses.flatMap((res) => res.data?.data || [])

    allYearsTotal.value = allEntries.reduce(
      (sum: number, entry: any) => sum + Number(entry?.amount || 0),
      0
    )
  } catch (error) {
    console.log('Unable to fetch all years total', error)
    allYearsTotal.value = 0
  }
}

onBeforeRouteLeave((to, from, next) => {
  currentYear.value = to.matched[0].path.slice(1)
  fetchYearTotal(currentYear.value)
  next()
})

onMounted(() => {
  loginStore.initFirebase()
  fetchYearTotal(currentYear.value)
  fetchAllYearsTotal()
})

watch(
  () => route.path,
  (newPath) => {
    const year = newPath.split('/')[1]
    if (year && year !== currentYear.value) {
      currentYear.value = year
      fetchYearTotal(year)
    }
  }
)
</script>

<style>
.welcome {
  font-size: 18px;
  font-weight: 600;
  margin-top: 3rem;
}

.toggle-years {
  cursor: pointer;
}

button.logout {
  background-color: #312e99;
  border-color: #312e99;
  position: absolute;
  top: 1rem;
  right: 2rem;
}

.year-total {
  margin: 0.5rem 0 1rem;
  font-weight: 700;
  color: #312e99;
}

.all-years-total {
  margin: 0 0 1.5rem;
  font-weight: 600;
  color: #eb7112;
}
</style>
