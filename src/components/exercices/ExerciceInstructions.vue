<script setup lang="ts">
defineProps<{ instructions: string[] }>()
</script>

<template>
  <section class="exercice-section">
    <h2 class="exercice-section__title">📋 Instructions</h2>
    <ol class="exercice-steps">
      <li
        v-for="(instruction, i) in instructions"
        :key="i"
        class="exercice-steps__item"
      >
        {{ instruction }}
      </li>
    </ol>
  </section>
</template>
