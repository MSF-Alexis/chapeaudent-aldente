import { ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { EnrichedRoadmap } from '@/types/Roadmap'

const roadmapCache = ref<EnrichedRoadmap | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

export function useRoadmap() {
  const fetchRoadmap = async (id = '0fMyfQBsPK1beigHnpJY'): Promise<EnrichedRoadmap | null> => {
    if (roadmapCache.value) return roadmapCache.value

    loading.value = true
    error.value = null

    try {
      const data = await apiFetch<EnrichedRoadmap>(`/roadmaps/${id}`)
      roadmapCache.value = data
      return data
    } catch (err) {
      error.value = err as Error
      return null
    } finally {
      loading.value = false
    }
  }

  const clearRoadmapCache = () => {
    roadmapCache.value = null
  }

  return {
    roadmap: roadmapCache,
    loading,
    error,
    fetchRoadmap,
    clearRoadmapCache,
  }
}
