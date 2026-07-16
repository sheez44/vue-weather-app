<script>
import { ref } from 'vue'
const API_KEY = '877e1c5722a14576bd2112544261007'

export function useWeather() {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function getCurrent(location, forecast = true) {
    isLoading.value = true
    error.value = null
    const call = forecast ? 'forecast.json' : 'current.json'

    const url = `http://api.weatherapi.com/v1/${call}?key=${API_KEY}&q=${location}${forecast ? '&days=4' : ''}`
    const response = await fetch(url)
    const result = await response.json()

    if (result.error) {
      error.value = result.error
    } else {
      console.log(result)
      data.value = result
    }
  }

  async function getSearch(location) {
    isLoading.value = true
    error.value = null
    const url = `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${location}`
    const response = await fetch(url)
    const result = await response.json()

    if (result.error) {
      error.value = result.error
    } else {
      data.value = result
    }
  }

  return { getCurrent, getSearch, data, error, isLoading }
}
</script>
