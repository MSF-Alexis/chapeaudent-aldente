<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSequences } from '@/composables/useSequences'
import SequenceCard from '@/components/sequences/SequenceCard.vue'
import '@/assets/styles/sequenceList.css'

const { fetchAllSequences, sequencesByLevel, loading, error } = useSequences()

const LEVEL_ORDER = ['Initial', 'Basique', 'Intermédiaire', 'Opérationnel', 'Avancé', 'Expert']
const orderedLevels = ref<string[]>([])

onMounted(async () => {
  await fetchAllSequences()
  orderedLevels.value = [
    ...LEVEL_ORDER.filter(l => sequencesByLevel.value[l]),
    ...Object.keys(sequencesByLevel.value).filter(l => !LEVEL_ORDER.includes(l)),
  ]
})
</script>

<template>
  <main class="sequence-list">
    <header class="sequence-list__header">
      <h1>Parcours d'apprentissage</h1>
      <p class="sequence-list__subtitle">
        Suis un parcours thématique pour progresser étape par étape,
        du niveau débutant jusqu'au niveau opérationnel.
      </p>
    </header>

    <div v-if="loading" class="sequence-list__loading">
      <p>Chargement des parcours...</p>
    </div>

    <div v-else-if="error" class="sequence-list__error">
      <p>Impossible de charger les parcours.</p>
    </div>

    <template v-else>
      <section v-for="level in orderedLevels" :key="level" class="sequence-list__group">
        <h2 class="sequence-list__level-title">{{ level }}</h2>
        <div class="sequence-list__grid">
          <SequenceCard
            v-for="sequence in sequencesByLevel[level]"
            :key="sequence.slug"
            :sequence="sequence"
          />
        </div>
      </section>
    </template>
  </main>
</template>
