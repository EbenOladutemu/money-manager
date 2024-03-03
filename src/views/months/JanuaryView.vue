<template>
  <div class="home">
    <ListComponent :msg="doughnut" />
    <span
      v-for="day in routine.days"
      :key="day.name"
      @click="day.selected = !day.selected"
    >
      {{ day.name }}
      <span v-show="day.selected">Their own</span>
    </span>
  </div>
  <div
    style="margin-top: 3rem"
    v-for="prop in properties"
    :key="prop.id"
    @click="chooseProp(prop)"
  >
    {{ prop.label }}
    <p v-show="prop.isExpanded">LSA Zone</p>
    <img src="@/assets/icons/delete.svg" :class="{ expand: prop.isExpanded }" />
  </div>
</template>

<script lang="ts" setup>
import ListComponent from '@/components/ListComponent.vue'
import { onMounted, ref } from 'vue'

const doughnut = ref('Elereke Yum Yum')

const activeProp = ref({})

const chooseProp = (prop: any) => {
  activeProp.value = prop
  prop.isExpanded = !prop.isExpanded

  // const not = properties.value.filter((prop) => prop.isExpanded == true)
  // console.log(not)
  // prop.label = Math.random()
}

const properties = ref([
  {
    id: 1,
    label: 'Doughnut The Yum',
    isExpanded: false,
  },
  {
    id: 2,
    label: 'Fluffy Yummy',
    isExpanded: false,
  },
])

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

onMounted(() => {
  console.log(routine.value)
})
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
