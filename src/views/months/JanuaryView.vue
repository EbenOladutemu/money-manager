<template>
  <div class="home">
    <ListComponent :msg="doughnut" />
  </div>
</template>

<script lang="ts" setup>
import ListComponent from "@/components/ListComponent.vue";
import { ref } from "vue";

const doughnut = ref("Elereke Yum Yum");
</script>
