<template>
  <div class="home">
    <ListComponent :msg="doughnut" />
  </div>
</template>

<script lang="ts" setup>
import ListComponent from '@/components/ListComponent.vue'
import { ref } from 'vue'

const doughnut = ref('Elereke Yum Yum')
</script>

<style>
span {
  margin-right: 1rem;
}

img {
  transition: transform 0.5s;
}

.expand {
  transform: rotate(45deg);
}
</style>
