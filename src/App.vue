<script setup>
const API_KEY = '877e1c5722a14576bd2112544261007'

import Card from '@/components/Card.vue'
import { ref } from 'vue'

const locationData = ref([])
const searchLocation = ref('')
const id = ref(0)
const isFetching = ref(false)

if (localStorage.getItem('weatherData')) {
  locationData.value = JSON.parse(localStorage.getItem('weatherData'))
  console.log(JSON.parse(localStorage.getItem('weatherData')))
  if (locationData.value.length > 0) {
    id.value = Math.max(...locationData.value.map((item) => item.id)) + 1
  }
}

async function fetchData() {
  isFetching.value = true
  const locationExists = locationData.value.find(
    (item) => item.location.name === searchLocation.value,
  )

  if (locationExists) {
    return
  }

  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchLocation.value}`,
  )
  const result = await response.json()
  isFetching.value = false

  if (result.error) {
    searchLocation.value = ''
    return
  }

  console.log(response, result)
  result.id = id.value++
  locationData.value.push(result)
  setLocalStorage()
  searchLocation.value = ''
}

function setLocalStorage() {
  localStorage.setItem('weatherData', JSON.stringify(locationData.value))
}

function clearAllData() {
  locationData.value = []
  localStorage.removeItem('weatherData')
  isFetching.value = false
}
</script>

<template>
  <input v-model="searchLocation" @keyup.enter="fetchData" />
  <button @click="fetchData">enter location</button>
  <button @click="clearAllData">Remove all cities</button>
  <div v-if="isFetching">
    <p>fetching data</p>
  </div>
  <div class="weather-cards" v-if="locationData.length > 0">
    <Card
      class="weather-card"
      v-for="location in locationData"
      :key="location.id"
      :location="location"
    />
  </div>
</template>

<style scoped>
.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}
.weather-card {
  border: 1px solid black;
  padding: 1rem;
}
</style>
