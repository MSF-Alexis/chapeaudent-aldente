import { ref, computed } from 'vue'
import type { Router } from 'vue-router'
import type { EnrichedSequence, EnrichedSequenceNode } from '@/types/Sequence'

type Progression = {
  completedSteps: number[]
  lastStep: number
}

const STORAGE_PREFIX = 'progression-'

export function useSequencePlayer(sequence: EnrichedSequence, router: Router) {
  const orderedNodes = computed<EnrichedSequenceNode[]>(() => {
    if (!sequence.nodes || !sequence.firstNodeId) return []

    const map = new Map(sequence.nodes.map((n) => [n.id, n]))
    const result: EnrichedSequenceNode[] = []
    let currentId: string | null = sequence.firstNodeId
    const seen = new Set<string>()

    while (currentId && map.has(currentId) && !seen.has(currentId)) {
      seen.add(currentId)
      const node = map.get(currentId) as EnrichedSequenceNode // ← cast explicite
      result.push(node)
      currentId = node.nextNodeId ?? null
    }

    return result
  })

  const totalSteps = computed(() => orderedNodes.value.length)
  const storageKey = `${STORAGE_PREFIX}${sequence.slug}`

  const loadProgression = (): Progression => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return { completedSteps: [], lastStep: 0 }
      const parsed = JSON.parse(raw)
      return {
        completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
        lastStep: typeof parsed.lastStep === 'number' ? parsed.lastStep : 0,
      }
    } catch {
      return { completedSteps: [], lastStep: 0 }
    }
  }

  const progression = ref<Progression>(loadProgression())

  const saveProgression = (p: Progression) => {
    localStorage.setItem(storageKey, JSON.stringify(p))
  }

  const markStepCompleted = (index: number): boolean => {
    if (index < 0 || index >= totalSteps.value) return false
    const already = progression.value.completedSteps.includes(index)
    if (already) {
      progression.value.completedSteps = progression.value.completedSteps.filter((i) => i !== index)
      progression.value.lastStep = progression.value.completedSteps.length
        ? Math.max(...progression.value.completedSteps)
        : 0
    } else {
      progression.value.completedSteps.push(index)
      if (index > progression.value.lastStep) progression.value.lastStep = index
    }
    saveProgression(progression.value)
    return !already
  }

  const isStepCompleted = (index: number) => progression.value.completedSteps.includes(index)

  const resetProgression = () => {
    progression.value = { completedSteps: [], lastStep: 0 }
    localStorage.removeItem(storageKey)
  }

  const navigateTo = (index: number) => {
    const node = orderedNodes.value[index]
    if (!node?.targetSlug) return
    router.push({
      name: 'sheets-view',
      params: { slug: node.targetSlug },
      query: { parcours: sequence.slug, step: index },
    })
  }

  const start = () => {
    const index =
      progression.value.lastStep >= 0 && progression.value.lastStep < totalSteps.value
        ? progression.value.lastStep
        : 0
    navigateTo(index)
  }

  const goTo = (index: number) => {
    if (index >= 0 && index < totalSteps.value) navigateTo(index)
  }

  const goNext = (currentIndex: number) => goTo(currentIndex + 1)
  const goPrev = (currentIndex: number) => goTo(currentIndex - 1)
  const getNodeAt = (index: number): EnrichedSequenceNode | null =>
    orderedNodes.value[index] ?? null
  const findIndexBySlug = (slug: string) =>
    orderedNodes.value.findIndex((n) => n.targetSlug === slug)

  return {
    orderedNodes,
    totalSteps,
    progression,
    start,
    goTo,
    goNext,
    goPrev,
    getNodeAt,
    findIndexBySlug,
    markStepCompleted,
    isStepCompleted,
    resetProgression,
  }
}
