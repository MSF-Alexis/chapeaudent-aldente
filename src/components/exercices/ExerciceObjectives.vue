<script setup lang="ts">
defineProps<{ objectives: string[] }>()
</script>

<template>
  <section class="exercice-section">
    <h2 class="exercice-section__title">🎯 Objectifs</h2>
    <ul class="exercice-list">
      <li v-for="(obj, i) in objectives" :key="i" class="exercice-list__item">
        {{ obj }}
      </li>
    </ul>
  </section>
</template>
