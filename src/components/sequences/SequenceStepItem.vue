<script setup lang="ts">
import type { EnrichedSequenceNode } from '@/types/Sequence'

defineProps<{
  node: EnrichedSequenceNode
  index: number
  isCompleted: boolean
  isCurrent: boolean
}>()

defineEmits<{
  (e: 'go', index: number): void
}>()
</script>

<template>
  <li class="stepper__item" :class="{
    'stepper__item--completed': isCompleted,
    'stepper__item--current': isCurrent,
  }">
    <div class="stepper__marker">
      <span v-if="isCompleted">✓</span>
      <span v-else>{{ index + 1 }}</span>
    </div>
    <div class="stepper__content">
      <span class="stepper__title">{{ node.title }}</span>
    </div>
    <span class="stepper__type pill pill--id">{{ node.type }}</span>
    <button class="btn btn--ghost btn-sm" @click="$emit('go', index)">Voir</button>
  </li>
</template>
