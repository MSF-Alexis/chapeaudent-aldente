import { ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { Exercice } from '@/types/Exercice'

const cache = new Map<string, Exercice>()
const loading = ref(false)
const error = ref<Error | null>(null)

export function useExercices() {
  const fetchExercice = async (slug: string): Promise<Exercice | null> => {
    if (cache.has(slug)) return cache.get(slug)!

    loading.value = true
    error.value = null

    try {
      const exercice = await apiFetch<Exercice>(`/exercices/${slug}`)
      cache.set(slug, exercice)
      return exercice
    } catch (err) {
      error.value = err as Error
      return null
    } finally {
      loading.value = false
    }
  }

  return { fetchExercice, loading, error }
}
