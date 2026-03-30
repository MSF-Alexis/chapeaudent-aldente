import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { Sequence } from '@/types/Sequence'

const sequencesCache: Ref<Map<string, Sequence>> = ref(new Map())
const loading = ref(false)
const error = ref<Error | null>(null)

export function useSequences() {
  const fetchAllSequences = async (): Promise<Sequence[]> => {
    if (sequencesCache.value.size > 0) return [...sequencesCache.value.values()]

    loading.value = true
    error.value = null

    try {
      const sequences = await apiFetch<Sequence[]>('/sequences')
      sequences.forEach(seq => sequencesCache.value.set(seq.slug, seq))
      return sequences
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const sequencesByLevel = computed(() => {
    const grouped: Record<string, Sequence[]> = {}
    sequencesCache.value.forEach(seq => {
      const level = seq.level ?? 'Autre'
      if (!grouped[level]) grouped[level] = []
      grouped[level].push(seq)
    })
    return grouped
  })

  const clearCache = () => sequencesCache.value.clear()

  return { fetchAllSequences, sequencesByLevel, loading, error, clearCache }
}
