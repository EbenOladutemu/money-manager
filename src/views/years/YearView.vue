<template>
  <div>
    <p @click="showYears = !showYears">Toggle Year/Month</p>

    <nav v-show="showYears" v-for="year in years" :key="year">
      <router-link :to="`/${year}`" @click="showYears = false">
        {{ year }}
      </router-link>
      |
    </nav>

    <nav v-show="!showYears" v-for="month in months" :key="month">
      <router-link
        :to="{ name: `${month.toLowerCase()}-${currentYear}` }"
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
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const { years, months } = useYearHelper()
const showYears = ref(false)
const currentYear: any = ref(new Date().getFullYear().toString())

onBeforeRouteLeave((to, from, next) => {
  currentYear.value = to.matched[0].path.slice(1)
  next()
})
</script>

<style>
p {
  cursor: pointer;
}
</style>
