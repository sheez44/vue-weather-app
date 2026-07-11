<script setup>
defineProps({
  message: String,
})
</script>

<template>
  <div class="message">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped></style>
