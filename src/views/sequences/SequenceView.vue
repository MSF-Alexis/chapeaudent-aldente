<script setup>
import { ref, onMounted } from 'vue'
import { useSequences } from '@/composables/useSequences'
import { useSequencePlayer } from '@/composables/useSequencePlayer'
import '@/assets/styles/sequenceView.css'

const props = defineProps({ slug: { type: String, required: true } })

const { fetchSequence, loading, error } = useSequences()

const sequence = ref(null)

// ─── Player — refs plats pour le template ──────────────────
const orderedNodes = ref([])
const progression = ref({ completedSteps: [], lastStep: 0 })
const totalSteps = ref(0)

let player = null

const startPlayer = () => player?.start()
const goTo = (i) => player?.goTo(i)
const isStepCompleted = (i) => player?.isStepCompleted(i) ?? false
const resetProgression = () => {
  player?.resetProgression()
  progression.value = { completedSteps: [], lastStep: 0 }
}

onMounted(async () => {
  sequence.value = await fetchSequence(props.slug)
  if (sequence.value) {
    player = useSequencePlayer(sequence.value)
    orderedNodes.value = player.orderedNodes.value
    progression.value = player.progression.value
    totalSteps.value = player.totalSteps.value
  }
})
</script>

<template>
  <main class="sequence-view">

    <div v-if="loading" class="sequence-view__loading">
      <p>Chargement du parcours...</p>
    </div>

    <div v-else-if="error" class="sequence-view__error">
      <p>Impossible de charger ce parcours.</p>
      <RouterLink class="btn btn--secondary" to="/parcours">
        ← Retour aux parcours
      </RouterLink>
    </div>

    <template v-else-if="sequence && orderedNodes.length > 0">

      <!-- ── Header ──────────────────────────────────────── -->
      <header class="sequence-view__header">
        <div class="sequence-view__header-inner">

          <nav class="breadcrumb">
            <RouterLink class="breadcrumb__link" to="/parcours">Parcours</RouterLink>
            <span class="breadcrumb__separator">›</span>
            <span class="breadcrumb__current">{{ sequence.name }}</span>
          </nav>

          <div class="sequence-view__title-row">
            <h1 class="sequence-view__title">{{ sequence.name }}</h1>
            <span
              v-if="sequence.type"
              class="pill pill--domain"
              :data-domain="sequence.type"
            >
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
              <span class="sequence-view__stat-value">
                {{ progression.completedSteps.length }}
              </span>
              <span class="sequence-view__stat-label">complétées</span>
            </div>
          </div>

          <div class="sequence-view__actions">
            <button class="btn btn--primary" @click="startPlayer">
              {{ progression.completedSteps.length > 0 ? '▶ Continuer' : '▶ Commencer le parcours' }}
            </button>
            <button
              v-if="progression.completedSteps.length > 0"
              class="btn btn--ghost"
              @click="resetProgression"
            >
              Recommencer
            </button>
            <RouterLink class="btn btn--ghost" to="/parcours">
              ← Tous les parcours
            </RouterLink>
          </div>

        </div>
      </header>

      <!-- ── Stepper ─────────────────────────────────────── -->
      <section class="sequence-view__steps">
        <div class="sequence-view__steps-inner">
          <h2 class="sequence-view__steps-title">Étapes du parcours</h2>

          <ol class="stepper">
            <li
              v-for="(node, index) in orderedNodes"
              :key="node.id"
              class="stepper__item"
              :class="{
                'stepper__item--completed': isStepCompleted(index),
                'stepper__item--current': index === progression.lastStep && !isStepCompleted(index)
              }"
            >
              <div class="stepper__marker">
                <span v-if="isStepCompleted(index)">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>

              <div class="stepper__content">
                <span class="stepper__slug">{{ node.targetSlug }}</span>
                <span class="stepper__type pill pill--id">{{ node.type }}</span>
              </div>

              <button class="btn btn--ghost btn-sm" @click="goTo(index)">
                Voir →
              </button>
            </li>
          </ol>
        </div>
      </section>

    </template>
  </main>
</template>
