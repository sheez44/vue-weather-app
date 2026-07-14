<script setup>
import Card from '@/components/Card.vue'
import Message from '@/components/Message.vue'
import { ref, computed } from 'vue'
import { useWeather } from '@/composables/Weather.vue'

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

const { fetchWeather, data, error } = useWeather()

async function fetchData(search) {
  const query = search ? search : searchLocation.value

  await fetchWeather(query)

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
  await fetchWeather(searchLocation.value, ' /search.json')

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
      <input v-model="searchLocation" @keyup.enter="fetchData()" @keyup="fetchSearch" />
      <button @click="fetchData">enter location</button>
      <button @click="clearAllData">Remove all cities</button>
      <div v-if="isFetching">
        <Message message="Is fetching data" />
      </div>
      <div v-if="errorMsg.length">
        <Message :message="errorMsg" />
      </div>
      <div
        class="searchresults bg-white z-10 shadow-lg py-2 w-3/4 absolute flex flex-col gap-1"
        v-show="isAutosearch"
      >
        <div
          class="result px-4 py-1 hover:bg-blue-200 cursor-pointer"
          @click="fetchData(result.name)"
          v-for="(result, index) in autosearchResults"
          :key="index"
        >
          <p class="m-0">{{ result.name }}</p>
        </div>
      </div>
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
