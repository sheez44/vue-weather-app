<script setup>
const API_KEY = '877e1c5722a14576bd2112544261007'

import Card from '@/components/Card.vue'
import { ref } from 'vue'

const locationData = ref([])
const searchLocation = ref('')

const isFetching = ref(false)

if (localStorage.getItem('weatherData')) {
  locationData.value = JSON.parse(localStorage.getItem('weatherData'))
  console.log(JSON.parse(localStorage.getItem('weatherData')))
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
function removeLocation(locationId) {
  locationData.value.splice(locationId, 1)
  setLocalStorage()
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
      v-for="(location, index) in locationData"
      :key="index"
      :index="index"
      :location="location"
      v-on:deleteCard="removeLocation"
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
