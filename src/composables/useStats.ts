import { ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { EntitiesCount } from '@/types/Stat'

type CacheEntityCount = {
  value: EntitiesCount
  fetchedAt: number
}

const CACHE_TTL = 30 * 60 * 1000

let cache: CacheEntityCount | null = null
const loading = ref(false)
const error = ref<Error | null>(null)

export function useStats() {
  const fetchStats = async (forceRefresh = false): Promise<EntitiesCount | null> => {
    const now = Date.now()
    if (
      !forceRefresh &&
      cache &&
      now - cache.fetchedAt < CACHE_TTL
    ) {
      return cache.value
    }
    loading.value = true
    error.value = null

    try {
      const stats = await apiFetch<EntitiesCount>('/stats/count-all')

      cache = {
        fetchedAt: now,
        value: stats,
      }

      return stats
    } catch (err) {
      error.value = err as Error
      return null
    } finally {
      loading.value = false
    }
  }

  const clearCache = () => {
    cache = null
  }

  return { fetchStats, loading, error, clearCache }
}
