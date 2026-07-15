<script setup>
import Time from '@/components/Time.vue'
import Forecast from './Forecast.vue'

const { index, location } = defineProps({
  location: Object,
  index: Number,
})
</script>

<template>
  <div class="weather-card rounded shadow-md border border-gray-300 relative py-4 pr-8 pl-4">
    <h1 class="mt-0">{{ location.location.name }}</h1>
    <p>Country: {{ location.location.country }}</p>
    <img :src="location.current.condition.icon" />
    <p>{{ location.current.condition.text }}</p>
    <p>Temperature: {{ location.current.temp_c }}</p>
    <p>Humidity: {{ location.current.humidity }}</p>
    <p>Local time: <Time :timeString="location.location.localtime" /></p>
    <p>Last updated: <Time :epoch="location.current.last_updated_epoch" /></p>

    <Forecast />
    <button class="absolute right-4 top-4" @click="$emit('deleteCard', index)">X</button>
  </div>
</template>

<style scoped></style>
