<script>
import { ref } from 'vue'
const API_KEY = '877e1c5722a14576bd2112544261007'

export function useWeather() {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  async function fetchWeather(location = 'London', type = 'current.json') {
    isLoading.value = true
    error.value = null
    const url = `http://api.weatherapi.com/v1/${type}?key=${API_KEY}&q=${location}`
    const response = await fetch(url)
    const result = await response.json()

    if (result.error) {
      error.value = result.error
    } else {
      data.value = result
    }
  }

  return { fetchWeather, data, error, isLoading }
}
</script>
