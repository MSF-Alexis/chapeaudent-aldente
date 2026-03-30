import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { apiFetch } from '@/services/api'
import type { Sheet } from '@/types/Sheet'

const sheetsCache: Ref<Map<string, Sheet>> = ref(new Map())
const loading = ref(false)
const error = ref<Error | null>(null)

export function useSheets() {
  const baseUrlCollection = "/sheets";
  const fetchSheet = async (slug: string): Promise<Sheet> => {
    if (sheetsCache.value.has(slug)) {
      return sheetsCache.value.get(slug)!
    }

    loading.value = true
    error.value = null

    try {
      const sheet = await apiFetch<Sheet>(`${baseUrlCollection}/${slug}`)
      sheetsCache.value.set(slug, sheet)
      return sheet
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllSheets = async (): Promise<Sheet[]> => {
    loading.value = true
    try {
      const sheets = await apiFetch<Sheet[]>(baseUrlCollection)
      sheets.forEach(sheet => sheetsCache.value.set(sheet.slug, sheet))
      return sheets
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }

  const sheetsByType = computed(() => {
    const grouped: Record<string, Sheet[]> = { html: [], css: [], js: [], integration: [] }
    sheetsCache.value.forEach(sheet => {
      grouped[sheet.type]?.push(sheet)
    })
    return grouped
  })

  const clearCache = () => sheetsCache.value.clear()

  return { fetchSheet, fetchAllSheets, sheetsByType, loading, error, clearCache }
}