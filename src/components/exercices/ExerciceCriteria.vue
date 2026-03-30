<script setup lang="ts">
defineProps<{ criteria: string[] }>()
</script>

<template>
  <section class="exercice-section exercice-section--criteria">
    <h2 class="exercice-section__title">✅ Critères de réussite</h2>
    <ul class="exercice-criteria">
      <li
        v-for="(criterion, i) in criteria"
        :key="i"
        class="exercice-criteria__item"
      >
        {{ criterion }}
      </li>
    </ul>
  </section>
</template>
