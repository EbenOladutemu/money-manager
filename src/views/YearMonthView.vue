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
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const loginStore = useLoginStore()
const { years, months } = useYearHelper()
const showYears = ref(false)
const currentYear: any = ref(new Date().getFullYear().toString())

onBeforeRouteLeave((to, from, next) => {
  currentYear.value = to.matched[0].path.slice(1)
  next()
})
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
</style>
