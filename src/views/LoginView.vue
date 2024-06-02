<template>
  <div>
    <h1>Expense Tracker</h1>
    <button @click="loginWithGoogle">Login</button>
  </div>
</template>

<script lang="ts" setup>
import { useLoginStore } from '@/store/login'
import { onMounted } from 'vue'

const { initFirebase, loginWithGoogle } = useLoginStore()

onMounted(() => {
  initFirebase()
})
</script>

<style scoped>
div {
  margin-top: 5rem;
}
</style>
