<script setup>
const API_KEY = '877e1c5722a14576bd2112544261007'

import Card from '@/components/Card.vue'
import Message from '@/components/Message.vue'
import { ref, computed } from 'vue'

const locationData = ref([])
const searchLocation = ref('')
const errorMsg = ref('')
const isFetching = ref(false)
const options = ref({
  sortBy: null,
  direction: 'ascending',
})

if (localStorage.getItem('weatherData')) {
  locationData.value = JSON.parse(localStorage.getItem('weatherData'))
  console.log(JSON.parse(localStorage.getItem('weatherData')))
}

async function fetchData(autocall) {
  isFetching.value = true

  const locationExists = locationData.value.find(
    (item) => item.location.name === searchLocation.value,
  )

  if (locationExists) {
    isFetching.value = false
    return
  }

  if (searchLocation.value.length <= 0) {
    isFetching.value = false
    return
  }

  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${searchLocation.value}`,
  )
  const result = await response.json()
  isFetching.value = false

  console.log('fetching')

  if (result.error) {
    // dont show
    if (!autocall) {
      errorMsg.value = result.error.message
    }

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

const displayedLocations = computed(() => {
  let locations = [...locationData.value]

  if (options.value.sortBy === 'temperature') {
    if (options.value.direction === 'ascending') {
      locations.sort((a, b) => a.current.temp_c - b.current.temp_c)
    }
    if (options.value.direction === 'descending') {
      locations.sort((a, b) => b.current.temp_c - a.current.temp_c)
    }
  }

  if (options.value.sortBy === 'alphabetical') {
    if (options.value.direction === 'ascending') {
      locations.sort((a, b) => {
        return a.location.name.localeCompare(b.location.name)
      })
    }
    if (options.value.direction === 'descending') {
      locations.sort((a, b) => {
        return b.location.name.localeCompare(a.location.name)
      })
    }
  }

  return locations
})

function toggleSort(sortBy) {
  options.value.sortBy = sortBy

  if (options.value.direction === 'ascending') {
    options.value.direction = 'descending'
  } else {
    options.value.direction = 'ascending'
  }
}

fetchData(true)
</script>

<template>
  <input v-model="searchLocation" @keyup.enter="fetchData" />
  <button @click="fetchData">enter location</button>
  <button @click="clearAllData">Remove all cities</button>
  <div v-if="isFetching">
    <Message message="Is fetching data" />
  </div>
  <div v-if="errorMsg.length">
    <Message :message="errorMsg" />
  </div>
  <div class="sorter">
    <p>Sort by</p>
    <button @click="toggleSort('temperature')">
      <span v-if="options.direction === 'ascending' && options.sortBy == 'temperature'">
        🌡️ Temp ↑
      </span>
      <span v-else-if="options.direction === 'descending' && options.sortBy == 'temperature'">
        🌡️ Temp ↓
      </span>
      <span v-else> 🌡️ Temp </span>
    </button>
    <button @click="toggleSort('alphabetical')">
      <span v-if="options.direction === 'ascending' && options.sortBy == 'alphabetical'">
        Abc ↑
      </span>
      <span v-else-if="options.direction === 'descending' && options.sortBy == 'alphabetical'">
        Zxy ↓
      </span>
      <span v-else> Alphabetical </span>
    </button>
    <button @click="toggleSort(null)">Reset</button>
  </div>
  <div class="weather-cards" v-if="locationData.length > 0">
    <Card
      class="weather-card"
      v-for="(location, index) in displayedLocations"
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
</style>
