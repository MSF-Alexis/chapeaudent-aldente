import { ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { EnrichedSequence } from '@/types/Sequence'

const loading = ref(false)
const error = ref<Error | null>(null)

export function useSequenceDetail() {
  const fetchEnrichedSequence = async (slug: string): Promise<EnrichedSequence | null> => {
    loading.value = true
    error.value = null

    try {
      return await apiFetch<EnrichedSequence>(`/sequences/${slug}`)
    } catch (err) {
      error.value = err as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return { fetchEnrichedSequence, loading, error }
}
