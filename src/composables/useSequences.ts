import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { Sequence } from '@/types/Sequence'

export const TYPES = ['html', 'css', 'js', 'integration'] as const
export type SequenceType = typeof TYPES[number]

const sequencesCache: Ref<Map<string, Sequence>> = ref(new Map())
const sequencesByTypeCache = ref<Partial<Record<SequenceType, Sequence[]>>>({})

const loading = ref(false)
const error = ref<Error | null>(null)

export function useSequences() {
  const fetchAllSequences = async (): Promise<Sequence[]> => {
    if (sequencesCache.value.size > 0) {
      return [...sequencesCache.value.values()]
    }

    loading.value = true
    error.value = null

    try {
      const sequences = await apiFetch<Sequence[]>('/sequences')
      sequences.forEach((seq) => sequencesCache.value.set(seq.slug, seq))
      return sequences
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchSequencesByType = async (type: SequenceType): Promise<Sequence[]> => {
    const cached = sequencesByTypeCache.value[type]
    if (cached) return cached

    loading.value = true
    error.value = null

    try {
      const sequences = await apiFetch<Sequence[]>(`/sequences/type/${type}`)

      sequencesByTypeCache.value[type] = sequences
      sequences.forEach((seq) => sequencesCache.value.set(seq.slug, seq))

      return sequences
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCachedSequencesByType = (type: SequenceType): Sequence[] => {
    return sequencesByTypeCache.value[type] ?? []
  }

  const sequencesByLevel = computed(() => {
    const grouped: Record<string, Sequence[]> = {}

    sequencesCache.value.forEach((seq) => {
      const level = seq.level ?? 'Autre'
      if (!grouped[level]) grouped[level] = []
      grouped[level].push(seq)
    })

    return grouped
  })

  const clearCache = () => {
    sequencesCache.value.clear()
    sequencesByTypeCache.value = {}
  }

  return {
    fetchAllSequences,
    fetchSequencesByType,
    getCachedSequencesByType,
    sequencesByLevel,
    loading,
    error,
    clearCache,
  }
}
