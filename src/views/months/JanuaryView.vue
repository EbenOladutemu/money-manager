<template>
  <div class="home">
    <ListComponent :msg="doughnut" />
  </div>
</template>

<script lang="ts" setup>
import ListComponent from '@/components/ListComponent.vue'
import { ref } from 'vue'

const doughnut = ref('Elereke Yum Yum')

const routine = ref({
  days: [
    {
      name: 'Monday',
      selected: false,
    },
    {
      name: 'Tuesday',
      selected: false,
    },
    {
      name: 'Wednesday',
      selected: false,
    },
    {
      name: 'Thursday',
      selected: false,
    },
    {
      name: 'Friday',
      selected: false,
    },
    {
      name: 'Saturday',
      selected: false,
    },
    {
      name: 'Sunday',
      selected: false,
    },
  ],
})

const days = ref(['Monday', 'Tuesday', 'Friday'])

days.value.forEach((day) => {
  routine.value.days.filter((selectedDay) => {
    selectedDay.name == day ? (selectedDay.selected = true) : false
  })
})
</script>
