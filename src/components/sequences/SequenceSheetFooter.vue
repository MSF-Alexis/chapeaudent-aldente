<script setup lang="ts">
defineProps<{
  hasSequenceContext: boolean
  isCurrentStepCompleted: boolean
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'complete'): void
}>()
</script>

<template>
  <footer class="sheet-footer">
    <button class="btn btn--secondary" @click="$emit('back')">
      ← Retour à la liste
    </button>
    <button
      v-if="hasSequenceContext"
      class="btn"
      :class="isCurrentStepCompleted ? 'btn--completed' : 'btn--primary'"
      @click="$emit('complete')"
    >
      {{ isCurrentStepCompleted ? 'Étape complétée ✓' : 'Marquer comme complété' }}
    </button>
  </footer>
</template>
