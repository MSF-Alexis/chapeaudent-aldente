<script setup lang="ts">
defineProps({
  content: {
    type: String,
    required: true
  }
})
</script>

<template>
  <code class="inline-code">{{ content }}</code>
</template>
