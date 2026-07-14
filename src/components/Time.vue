<script setup>
import { computed } from 'vue'

const { timeString, epoch } = defineProps({
  epoch: Number,
  timeString: String,
})

const time = computed(() => {
  if (timeString) {
    // Extract just the time portion (HH:MM)
    return timeString.split(' ')[1]
  }

  if (epoch) {
    const date = new Date(epoch * 1000)
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  return ''
})
</script>

<template>
  <span class="time">{{ time }}</span>
</template>

<style scoped></style>
