<template>
  <div class="home">
    <ListComponent :msg="doughnut" />
    <!-- <HelloWord /> -->
  </div>
</template>

<script lang="ts" setup>
import ListComponent from "@/components/ListComponent.vue";
// import HelloWord from "@/components/HelloWorld.vue";
import { ref } from "vue";

const doughnut = ref("Elereke Yum Yum");
</script>
