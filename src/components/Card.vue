<script setup>
const { location } = defineProps(['location'])
</script>

<template>
  <div class="weather-card">
    <h1>{{ location.location.name }}</h1>
    <p>Country: {{ location.location.country }}</p>
    <img :src="location.current.condition.icon" />
    <p>{{ location.current.condition.text }}</p>
    <p>Temperature: {{ location.current.temp_c }}</p>
    <p>Local time: {{ location.location.localtime }}</p>
    <button @click="removeLocation(location.id)">X</button>
  </div>
</template>

<style scoped>
.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}
.weather-card {
  border: 1px solid black;
  padding: 1rem;
}
h1 {
  margin-top: 0;
}
</style>
