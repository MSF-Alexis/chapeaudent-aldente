<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSequenceDetail } from '@/composables/useSequenceDetail'
import { useSequencePlayer } from '@/composables/useSequencePlayer'
import SequenceStepItem from '@/components/sequences/SequenceStepItem.vue'
import type { EnrichedSequence } from '@/types/Sequence'
import '@/assets/styles/sequenceView.css'

const props = defineProps<{ slug: string }>()
const router = useRouter()

const { fetchEnrichedSequence, loading, error } = useSequenceDetail()

const sequence: Ref<EnrichedSequence | null> = ref(null)

// On stocke directement le retour du player, pas dans une ref imbriquée
let player: ReturnType<typeof useSequencePlayer> | null = null

// Ces computed lisent depuis player directement, réactifs car player est réassigné
const orderedNodes = computed(() => player?.orderedNodes.value ?? [])
const totalSteps = computed(() => player?.totalSteps.value ?? 0)
const progression = computed(() => player?.progression.value ?? { completedSteps: [], lastStep: 0 })

const loadSequence = async (slug: string) => {
  sequence.value = await fetchEnrichedSequence(slug)
  if (sequence.value) {
    player = useSequencePlayer(sequence.value, router)
  } else {
    player = null
  }
}

onMounted(() => loadSequence(props.slug))
watch(() => props.slug, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) loadSequence(newSlug)
})

const startPlayer = () => player?.start()
const goTo = (index: number) => player?.goTo(index)
const isStepCompleted = (index: number) => player?.isStepCompleted(index) ?? false
const resetProgression = () => player?.resetProgression()
</script>

<template>
  <main class="sequence-view">
    <div v-if="loading" class="sequence-view__loading">
      <p>Chargement du parcours...</p>
    </div>

    <div v-else-if="error" class="sequence-view__error">
      <p>Impossible de charger ce parcours.</p>
      <RouterLink class="btn btn--secondary" to="/parcours">← Retour aux parcours</RouterLink>
    </div>

    <template v-else-if="sequence && orderedNodes.length > 0">
      <header class="sequence-view__header">
        <div class="sequence-view__header-inner">
          <nav class="breadcrumb">
            <RouterLink class="breadcrumb__link" to="/parcours">Parcours</RouterLink>
            <span class="breadcrumb__separator">›</span>
            <span class="breadcrumb__current">{{ sequence.name }}</span>
          </nav>

          <div class="sequence-view__title-row">
            <h1 class="sequence-view__title">{{ sequence.name }}</h1>
            <span v-if="sequence.type" class="pill pill--domain" :data-domain="sequence.type">
              {{ sequence.type.toUpperCase() }}
            </span>
          </div>

          <p v-if="sequence.description" class="sequence-view__description">
            {{ sequence.description }}
          </p>

          <div class="sequence-view__stats">
            <div class="sequence-view__stat">
              <span class="sequence-view__stat-value">{{ totalSteps }}</span>
              <span class="sequence-view__stat-label">étapes</span>
            </div>
            <div v-if="sequence.estimatedHours" class="sequence-view__stat">
              <span class="sequence-view__stat-value">{{ sequence.estimatedHours }}h</span>
              <span class="sequence-view__stat-label">estimées</span>
            </div>
            <div class="sequence-view__stat">
              <span class="sequence-view__stat-value">{{ progression.completedSteps.length }}</span>
              <span class="sequence-view__stat-label">complétées</span>
            </div>
          </div>

          <div class="sequence-view__actions">
            <button class="btn btn--primary" @click="startPlayer">
              {{ progression.completedSteps.length > 0 ? '▶ Continuer' : '▶ Commencer le parcours' }}
            </button>
            <button v-if="progression.completedSteps.length > 0" class="btn btn--ghost" @click="resetProgression">
              Recommencer
            </button>
            <RouterLink class="btn btn--ghost" to="/parcours">← Tous les parcours</RouterLink>
          </div>
        </div>
      </header>

      <section class="sequence-view__steps">
        <div class="sequence-view__steps-inner">
          <h2 class="sequence-view__steps-title">Étapes du parcours</h2>
          <ol class="stepper">
            <SequenceStepItem v-for="(node, index) in orderedNodes" :key="node.id" :node="node" :index="index"
              :is-completed="isStepCompleted(index)"
              :is-current="index === progression.lastStep && !isStepCompleted(index)" @go="goTo" />
          </ol>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.btn {
  padding: var(--space-sm) var(--space-md);
}
</style>
