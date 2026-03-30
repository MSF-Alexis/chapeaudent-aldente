<script setup lang="ts">
import { ref, shallowRef, onMounted, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useExercices } from '@/composables/useExercices'
import { useSequencePlayer } from '@/composables/useSequencePlayer'

import "@/assets/styles/exerciceView.css"

import ExerciceHeader from '@/components/exercices/ExerciceHeader.vue'
import ExerciceObjectives from '@/components/exercices/ExerciceObjectives.vue'
import ExerciceAssets from '@/components/exercices/ExerciceAssets.vue'
import ExerciceInstructions from '@/components/exercices/ExerciceInstructions.vue'
import ExerciceCriteria from '@/components/exercices/ExerciceCriteria.vue'
import SequenceProgressBanner from '@/components/sequences/SequenceProgressBanner.vue'
import SequenceSheetFooter from '@/components/sequences/SequenceSheetFooter.vue'

import type { Exercice } from '@/types/Exercice'
import type { Sequence } from '@/types/Sequence'
import { useSequenceDetail } from '@/composables/useSequenceDetail'

const props = defineProps<{ slug: string }>()
const route = useRoute()
const router = useRouter()

const { fetchExercice, loading, error } = useExercices()
const { fetchEnrichedSequence } = useSequenceDetail()

const exercice: Ref<Exercice | null> = ref(null)
const sequence: Ref<Sequence | null> = ref(null)
const player = shallowRef<ReturnType<typeof useSequencePlayer> | null>(null)
const currentStepIndex: Ref<number | null> = ref(null)

const hasSequenceContext = computed(() => !!route.query.parcours && !!sequence.value)

const loadExercice = async (slug: string) => {
  exercice.value = await fetchExercice(slug)
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
    typeof props.slug === 'string'
      ? player.value.findIndexBySlug(props.slug)
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
  const isMarked = player.value.markStepCompleted(currentStepIndex.value)
  if (isMarked) goNextStep()
}

onMounted(async () => {
  await loadExercice(props.slug)
  await loadSequenceContext()
})

watch(
  () => props.slug,
  async (newSlug, oldSlug) => {
    if (newSlug && newSlug !== oldSlug) {
      await loadExercice(newSlug)
      await loadSequenceContext()
    }
  }
)

watch(
  () => route.query.parcours,
  async () => { await loadSequenceContext() }
)
</script>

<template>
  <div class="exercice-view">
    <div v-if="loading" class="exercice-loading">
      <p>Chargement de l'exercice...</p>
    </div>

    <div v-else-if="error" class="exercice-error">
      <p>Impossible de charger cet exercice.</p>
      <button class="btn btn--secondary" @click="goBack">← Retour</button>
    </div>

    <article v-else-if="exercice" class="exercice-content">
      <SequenceProgressBanner v-if="hasSequenceContext && sequence && currentStepIndex !== null" :sequence="sequence"
        :current-step="currentStepIndex" :total-steps="player!.totalSteps.value" :can-go-prev="canGoPrev"
        :can-go-next="canGoNext" @prev="goPrevStep" @next="goNextStep" />

      <ExerciceHeader :exercice="exercice" />
      <ExerciceObjectives :objectives="exercice.objectives" />
      <ExerciceAssets :assets="exercice.startingAssets" />
      <ExerciceInstructions :instructions="exercice.instructions" />
      <ExerciceCriteria :criteria="exercice.successCriteria" />

      <SequenceSheetFooter :has-sequence-context="hasSequenceContext"
        :is-current-step-completed="isCurrentStepCompleted" @back="goBack" @complete="markCompleted" />
    </article>
  </div>
</template>
