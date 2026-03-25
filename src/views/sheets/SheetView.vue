<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSheets } from '@/composables/useSheets'
import { useSequences } from '@/composables/useSequences'
import { useSequencePlayer } from '@/composables/useSequencePlayer'
import '@/assets/styles/sheetView.css'

import SheetHeader from '@/components/sheets/SheetHeader.vue'
import SheetBody from '@/components/sheets/SheetBody.vue'

const route = useRoute()
const router = useRouter()

const { fetchSheet, loading, error } = useSheets()
const { fetchSequence } = useSequences()

const sheet = ref(null)

const sequence = ref(null)
let player = null
const currentStepIndex = ref(null)

const hasSequenceContext = computed(() => !!route.query.parcours && !!sequence.value)


const loadSheet = async (slug) => {
  sheet.value = await fetchSheet(slug)
}

const loadSequenceContext = async () => {
  const sequenceSlug = route.query.parcours
  if (!sequenceSlug || typeof sequenceSlug !== 'string') {
    sequence.value = null
    player = null
    currentStepIndex.value = null
    return
  }

  sequence.value = await fetchSequence(sequenceSlug)
  if (!sequence.value) {
    player = null
    currentStepIndex.value = null
    return
  }

  player = useSequencePlayer(sequence.value, router)

  // Priorité au query param step s'il est valide
  const stepParam = route.query.step
  let indexFromStep = null
  if (typeof stepParam === 'string') {
    const parsed = Number.parseInt(stepParam, 10)
    if (!Number.isNaN(parsed)) indexFromStep = parsed
  }

  // Sinon, retrouver l’index par slug de fiche
  const indexFromSlug =
    player.findIndexBySlug(route.params.slug)

  const resolvedIndex =
    indexFromStep != null && indexFromStep >= 0 && indexFromStep < player.totalSteps.value
      ? indexFromStep
      : indexFromSlug

  currentStepIndex.value = resolvedIndex >= 0 ? resolvedIndex : null
}

// ─── Navigation liste par type (comportement existant) ─────
const goBack = () => {
  if (sheet.value?.type) {
    router.push(`/${sheet.value.type}`)
  } else {
    router.push('/')
  }
}

// ─── Navigation dans le parcours ───────────────────────────
const goToStep = (index) => {
  if (!player || !sequence.value) return
  if (index < 0 || index >= player.totalSteps.value) return

  player.goTo(index)
}

const goPrevStep = () => {
  if (currentStepIndex.value == null) return
  goToStep(currentStepIndex.value - 1)
}

const goNextStep = () => {
  if (currentStepIndex.value == null) return
  goToStep(currentStepIndex.value + 1)
}

const canGoPrev = computed(
  () => currentStepIndex.value != null && currentStepIndex.value > 0
)
const canGoNext = computed(
  () => currentStepIndex.value != null && player && currentStepIndex.value < player.totalSteps.value - 1
)

const markCompleted = () => {
  if (player && currentStepIndex.value != null) {
    player.markStepCompleted(currentStepIndex.value)
  }
}

onMounted(async () => {
  await loadSheet(route.params.slug)
  await loadSequenceContext()
})

watch(
  () => route.params.slug,
  async (newSlug, oldSlug) => {
    if (newSlug && newSlug !== oldSlug) {
      await loadSheet(newSlug)
      await loadSequenceContext()
    }
  }
)

watch(
  () => route.query.parcours,
  async () => {
    await loadSequenceContext()
  }
)
</script>

<template>
  <div class="sheet-view">
    <div v-if="loading" class="sheet-loading">
      <p>Chargement de la fiche...</p>
    </div>

    <div v-else-if="error" class="sheet-error">
      <p>{{ error }}</p>
      <button @click="goBack" class="btn btn--secondary">
        ← Retour à la liste
      </button>
    </div>

    <article v-else-if="sheet" class="sheet-content">
      <div v-if="hasSequenceContext" class="sheet-sequence-banner">
        <div class="sheet-sequence-banner__main">
          <p class="sheet-sequence-banner__title">
            Parcours :
            <RouterLink
              class="sheet-sequence-banner__link"
              :to="`/parcours/${sequence.slug}`"
            >
              {{ sequence.name }}
            </RouterLink>
          </p>
          <p class="sheet-sequence-banner__meta" v-if="currentStepIndex !== null && player">
            Étape {{ currentStepIndex + 1 }} sur {{ player.totalSteps.value }}
          </p>
        </div>
        <div class="sheet-sequence-banner__actions">
          <button
            class="btn btn--ghost btn-sm"
            :disabled="!canGoPrev"
            @click="goPrevStep"
          >
            ← Étape précédente
          </button>
          <button
            class="btn btn--ghost btn-sm"
            :disabled="!canGoNext"
            @click="goNextStep"
          >
            Étape suivante →
          </button>
        </div>
      </div>

      <SheetHeader :sheet="sheet" />
      <SheetBody :sheet="sheet" />

      <footer class="sheet-footer">
        <button @click="goBack" class="btn btn--secondary">
          ← Retour à la liste
        </button>
        <button class="btn btn--primary" @click="markCompleted">
          Marquer comme complété
        </button>
      </footer>
    </article>
  </div>
</template>
