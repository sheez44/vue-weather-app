<script setup lang="ts">
import { getWeekday } from '@/utils/date'

const { forecast } = defineProps({
  forecast: Object,
})
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <div v-for="(day, index) in forecast.slice(1)" :key="index" class="flex flex-col items-center">
      <h3>{{ getWeekday(day.date_epoch) }}</h3>
      <img :src="day.day.condition.icon" height="32" width="32" />
      {{ day.day.maxtemp_c }}
    </div>
  </div>
</template>

<style scoped></style>
