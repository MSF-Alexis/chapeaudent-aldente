<script setup lang="ts">
import { computed } from 'vue'
import SequenceCard from '@/components/sequences/SequenceCard.vue'
import type { Sequence } from '@/types/Sequence'
import '@/assets/styles/sequenceList.css'

const props = defineProps<{
  sequences: Sequence[]
}>()

const LEVEL_ORDER = ['Initial', 'Basique', 'Intermédiaire', 'Opérationnel', 'Avancé', 'Expert']

const sequencesByLevel = computed<Record<string, Sequence[]>>(() => {
  const grouped: Record<string, Sequence[]> = {}

  props.sequences.forEach((seq) => {
    const level = seq.level ?? 'Autre'
    if (!grouped[level]) grouped[level] = []
    grouped[level].push(seq)
  })

  return grouped
})

const orderedLevels = computed<string[]>(() => {
  const groups = sequencesByLevel.value
  return [
    ...LEVEL_ORDER.filter((l) => groups[l] && groups[l].length > 0),
    ...Object.keys(groups).filter((l) => !LEVEL_ORDER.includes(l)),
  ]
})
</script>

<template>
  <section v-for="level in orderedLevels" :key="level" class="sequence-list__group">
    <h2 class="sequence-list__level-title">{{ level }}</h2>
    <div class="sequence-list__grid">
      <SequenceCard v-for="sequence in sequencesByLevel[level]" :key="sequence.slug" :sequence="sequence" />
    </div>
  </section>
</template>
