<script setup>
defineProps({
  location: Object,
  index: Number,
})
</script>

<template>
  <div class="weather-card">
    <h1>{{ location.location.name }}</h1>
    <p>Country: {{ location.location.country }}</p>
    <img :src="location.current.condition.icon" />
    <p>{{ location.current.condition.text }}</p>
    <p>Temperature: {{ location.current.temp_c }}</p>
    <p>Local time: {{ location.location.localtime }}</p>
    <button class="delete-button" @click="$emit('deleteCard', index)">X</button>
  </div>
</template>

<style scoped>
.weather-card {
  border: 1px solid black;
  padding: 1rem 2rem 1rem 1rem;
  position: relative;
}
h1 {
  margin-top: 0;
}
.delete-button {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
</style>
