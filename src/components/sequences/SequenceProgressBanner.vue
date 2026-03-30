<script setup lang="ts">
import type { Sequence } from '@/types/Sequence'

defineProps<{
  sequence: Sequence
  currentStep: number
  totalSteps: number
  canGoPrev: boolean
  canGoNext: boolean
}>()

defineEmits<{
  (e: 'prev'): void
  (e: 'next'): void
}>()
</script>

<template>
  <div class="sheet-sequence-banner">
    <div class="sheet-sequence-banner__main">
      <p class="sheet-sequence-banner__title">
        Parcours :
        <RouterLink class="sheet-sequence-banner__link" :to="`/parcours/${sequence.slug}`">
          {{ sequence.name }}
        </RouterLink>
      </p>
      <p class="sheet-sequence-banner__meta">
        Étape {{ currentStep + 1 }} sur {{ totalSteps }}
      </p>
    </div>
    <div class="sheet-sequence-banner__actions">
      <button class="btn btn--ghost btn-sm" :disabled="!canGoPrev" @click="$emit('prev')">
        ← Étape précédente
      </button>
      <button class="btn btn--ghost btn-sm" :disabled="!canGoNext" @click="$emit('next')">
        Étape suivante →
      </button>
    </div>
  </div>
</template>
