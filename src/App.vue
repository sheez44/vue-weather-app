<script setup>
import Card from '@/components/Card.vue'
import Message from '@/components/Message.vue'
import { ref, computed } from 'vue'
import { useWeather } from '@/composables/Weather.vue'
import SearchResults from './components/SearchResults.vue'

const locationData = ref([])
const autosearchResults = ref([])
const searchLocation = ref('')
const errorMsg = ref('')
const isFetching = ref(false)
const isAutosearch = ref(false)
const options = ref({
  sortBy: null,
  direction: 'ascending',
})

const { getCurrent, getSearch, getForecast, data, error } = useWeather()

async function fetchCurrentWeather(search) {
  const query = search ? search : searchLocation.value

  await getCurrent(query)

  if (error.value) {
    errorMsg.value = error.value.message
  } else {
    locationData.value.push(data.value)
    setLocalStorage()
  }
  searchLocation.value = ''
  isAutosearch.value = false
}

if (localStorage.getItem('weatherData')) {
  locationData.value = JSON.parse(localStorage.getItem('weatherData'))
  console.log(JSON.parse(localStorage.getItem('weatherData')))
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

async function fetchSearch() {
  if (searchLocation.value.length <= 0) {
    isAutosearch.value = false
    return
  }
  await getSearch(searchLocation.value)

  if (error.value) {
    errorMsg.value = error.value.message
  } else {
    isAutosearch.value = true
    autosearchResults.value = data.value
    console.log(data.value)
  }
}
</script>

<template>
  <main class="container">
    <div class="relative">
      <input v-model="searchLocation" @keyup.enter="fetchCurrentWeather()" @keyup="fetchSearch" />
      <button @click="fetchCurrentWeather">enter location</button>
      <button @click="clearAllData">Remove all cities</button>
      <div v-if="isFetching">
        <Message message="Is fetching data" />
      </div>
      <div v-if="errorMsg.length">
        <Message :message="errorMsg" />
      </div>
      <SearchResults
        :autosearchResults="autosearchResults"
        v-on:fetchCurrentWeather="fetchCurrentWeather"
        :isAutosearch="isAutosearch"
      />
    </div>
    <div class="sorter">
      <p>Sort by</p>
      <button class="h-10" @click="toggleSort('temperature')">
        <span v-if="options.direction === 'ascending' && options.sortBy == 'temperature'">
          🌡️ Temp ↑
        </span>
        <span v-else-if="options.direction === 'descending' && options.sortBy == 'temperature'">
          🌡️ Temp ↓
        </span>
        <span v-else> 🌡️ Temp </span>
      </button>
      <button class="h-10" @click="toggleSort('alphabetical')">
        <span v-if="options.direction === 'ascending' && options.sortBy == 'alphabetical'">
          Abc ↑
        </span>
        <span v-else-if="options.direction === 'descending' && options.sortBy == 'alphabetical'">
          Zxy ↓
        </span>
        <span v-else> Alphabetical </span>
      </button>
      <button class="h-10" @click="toggleSort(null)">Reset</button>
    </div>
    <div
      class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 my-4"
      v-if="locationData.length > 0"
    >
      <Card
        v-for="(location, index) in displayedLocations"
        :key="index"
        :index="index"
        :location="location"
        v-on:deleteCard="removeLocation"
      />
    </div>
  </main>
</template>

<style scoped></style>
