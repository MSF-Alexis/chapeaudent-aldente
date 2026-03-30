<script setup lang="ts">
import type { Exercice } from '@/types/Exercice'
defineProps<{ exercice: Exercice }>()
</script>

<template>
  <header class="exercice-header">
    <div class="exercice-header__meta">
      <span class="pill pill--level">{{ exercice.level }}</span>
      <span v-if="exercice.estimatedDuration" class="exercice-header__duration">
        ⏱ {{ exercice.estimatedDuration }}
      </span>
      <span
        v-for="skill in exercice.rncpSkills"
        :key="skill"
        class="pill pill--rncp"
      >
        {{ skill }}
      </span>
    </div>
    <h1 class="exercice-header__title">{{ exercice.title }}</h1>
    <div class="exercice-header__context">
      <p class="exercice-header__context-label">🗂 Contexte</p>
      <p class="exercice-header__context-text">{{ exercice.context }}</p>
    </div>
  </header>
</template>
