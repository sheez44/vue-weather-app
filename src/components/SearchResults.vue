<script setup>
const { autosearchResults } = defineProps({
  autosearchResults: Object,
  isAutosearch: Boolean,
})
</script>

<template>
  <div
    class="searchresults bg-white z-10 shadow-lg py-2 w-3/4 absolute flex flex-col gap-1"
    v-show="isAutosearch"
  >
    <div
      class="result px-4 py-1 hover:bg-blue-200 cursor-pointer"
      @click="$emit('fetchCurrentWeather', result.name)"
      v-for="(result, index) in autosearchResults"
      :key="index"
    >
      <p class="m-0">{{ result.name }}</p>
    </div>
  </div>
</template>
