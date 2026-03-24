import { ref, computed } from 'vue'

const baseUrl = "https://chapeaudent-aldente-api-vercel.vercel.app";
const sheetsCache = ref(new Map())
const loading = ref(false)
const error = ref(null)

export function useSheets() {
  const fetchSheet = async (sheetSlug) => {
    if (sheetsCache.value.has(sheetSlug)) {
      return sheetsCache.value.get(sheetSlug)
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`${baseUrl}/sheet/${sheetSlug}`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const sheet = await response.json()
      sheetsCache.value.set(sheetSlug, sheet)
      return sheet
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllSheets = async () => {
    loading.value = true
    try {
      const response = await fetch(`${baseUrl}/api/sheets`)
      const sheets = await response.json()
      
      sheets.forEach(sheet => {
        sheetsCache.value.set(sheet.slug, sheet)
      })
      
      return sheets
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const sheetsByType = computed(() => {
    const grouped = { html: [], css: [], js: [], integration: [] }
    sheetsCache.value.forEach(sheet => {
      grouped[sheet.type]?.push(sheet)
    })
    return grouped
  })

  const clearCache = () => {
    sheetsCache.value.clear()
  }

  return {
    fetchSheet,
    fetchAllSheets,
    sheetsByType,
    loading,
    error,
    clearCache
  }
}
