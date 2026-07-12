<script setup>
const { epoch } = defineProps({
  epoch: Number,
})

import { computed } from 'vue'

const time = computed(() => {
  const date = new Date(epoch * 1000)

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
})
</script>

<template>
  <span class="time">{{ time }}</span>
</template>

<style scoped></style>
