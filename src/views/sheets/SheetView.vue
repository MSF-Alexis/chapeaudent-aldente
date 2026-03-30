<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, computed, nextTick, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSheets } from '@/composables/useSheets'
import { useSequencePlayer } from '@/composables/useSequencePlayer'
import '@/assets/styles/sheetView.css'

import SheetHeader from '@/components/sheets/SheetHeader.vue'
import SheetBody from '@/components/sheets/SheetBody.vue'
import SequenceProgressBanner from '@/components/sequences/SequenceProgressBanner.vue'
import SequenceSheetFooter from '@/components/sequences/SequenceSheetFooter.vue'

import type { Sheet } from '@/types/Sheet'
import type { Sequence } from '@/types/Sequence'
import { useSequenceDetail } from '@/composables/useSequenceDetail'

const route = useRoute()
const router = useRouter()

const { fetchSheet, loading, error } = useSheets()
const { fetchEnrichedSequence } = useSequenceDetail()

const sheet: Ref<Sheet | null> = ref(null)
const sequence: Ref<Sequence | null> = ref(null)
const player = shallowRef<ReturnType<typeof useSequencePlayer> | null>(null)
const currentStepIndex: Ref<number | null> = ref(null)

const hasSequenceContext = computed(() => !!route.query.parcours && !!sequence.value)

const loadSheet = async (slug: string) => {
  sheet.value = await fetchSheet(slug)
}

const loadSequenceContext = async () => {
  const sequenceSlug = route.query.parcours
  if (!sequenceSlug || typeof sequenceSlug !== 'string') {
    sequence.value = null
    player.value = null
    currentStepIndex.value = null
    return
  }

  sequence.value = await fetchEnrichedSequence(sequenceSlug)
  if (!sequence.value) {
    player.value = null
    currentStepIndex.value = null
    return
  }

  player.value = useSequencePlayer(sequence.value, router)

  const stepParam = route.query.step
  let indexFromStep: number | null = null
  if (typeof stepParam === 'string') {
    const parsed = Number.parseInt(stepParam, 10)
    if (!Number.isNaN(parsed)) indexFromStep = parsed
  }

  const indexFromSlug =
    typeof route.params.slug === 'string'
      ? player.value.findIndexBySlug(route.params.slug)
      : -1

  const resolvedIndex =
    indexFromStep != null && indexFromStep >= 0 && indexFromStep < player.value.totalSteps.value
      ? indexFromStep
      : indexFromSlug

  currentStepIndex.value = resolvedIndex >= 0 ? resolvedIndex : null
}

const goBack = () => {
  if (hasSequenceContext.value) {
    router.push(`/parcours/${sequence.value?.slug}`)
  } else {
    router.push('/')
  }
}

const goToStep = (index: number) => {
  if (!player.value) return
  if (index < 0 || index >= player.value.totalSteps.value) return
  player.value.goTo(index)
}

const goPrevStep = () => {
  if (currentStepIndex.value == null) return
  goToStep(currentStepIndex.value - 1)
}

const goNextStep = () => {
  if (currentStepIndex.value == null || !player.value) return
  if (currentStepIndex.value + 1 <= player.value.totalSteps.value - 1) {
    goToStep(currentStepIndex.value + 1)
  } else {
    goBack()
  }
}

const canGoPrev = computed(
  () => currentStepIndex.value != null && currentStepIndex.value > 0
)
const canGoNext = computed(
  () =>
    currentStepIndex.value != null &&
    player.value != null &&
    currentStepIndex.value < player.value.totalSteps.value - 1
)

const isCurrentStepCompleted = computed(() => {
  if (!player.value || currentStepIndex.value == null) return false
  return player.value.isStepCompleted(currentStepIndex.value)
})

const markCompleted = () => {
  if (!player.value || currentStepIndex.value == null) return
  const isMarkedCompleted = player.value.markStepCompleted(currentStepIndex.value)
  if (isMarkedCompleted) goNextStep()
}

const scrollToTop = async () => {
  await nextTick()
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

onMounted(async () => {
  if (typeof route.params.slug === 'string') {
    await loadSheet(route.params.slug)
  }
  await loadSequenceContext()
  await scrollToTop()
})

watch(
  () => route.params.slug,
  async (newSlug, oldSlug) => {
    if (newSlug && typeof newSlug === 'string' && newSlug !== oldSlug) {
      await loadSheet(newSlug)
      await loadSequenceContext()
      await scrollToTop()
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
      <button class="btn btn--secondary" @click="goBack">
        ← Retour à la liste
      </button>
    </div>

    <article v-else-if="sheet" class="sheet-content">
      <SequenceProgressBanner v-if="hasSequenceContext && sequence && currentStepIndex !== null" :sequence="sequence"
        :current-step="currentStepIndex" :total-steps="player!.totalSteps.value" :can-go-prev="canGoPrev"
        :can-go-next="canGoNext" @prev="goPrevStep" @next="goNextStep" />

      <SheetHeader :sheet="sheet" />
      <SheetBody :sheet="sheet" />

      <SequenceSheetFooter :has-sequence-context="hasSequenceContext"
        :is-current-step-completed="isCurrentStepCompleted" @back="goBack" @complete="markCompleted" />
    </article>
  </div>
</template>
