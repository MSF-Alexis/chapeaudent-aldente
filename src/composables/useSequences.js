import { ref, computed } from 'vue'

const baseUrl = 'https://chapeaudent-aldente-api-vercel.vercel.app'

const sequencesCache = ref(new Map())
const loading = ref(false)
const error = ref(null)

export function useSequences() {

    const fetchSequence = async (slug) => {
        if (sequencesCache.value.has(slug)) {
            return sequencesCache.value.get(slug)
        }

        loading.value = true
        error.value = null

        try {
            const response = await fetch(`${baseUrl}/sequence/${slug}`)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const sequence = await response.json()
            sequencesCache.value.set(slug, sequence)
            return sequence
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const fetchAllSequences = async () => {
        if (sequencesCache.value.size > 0) {
            return [...sequencesCache.value.values()]
        }

        loading.value = true
        error.value = null

        try {
            const response = await fetch(`${baseUrl}/sequence`)
            if (!response.ok) throw new Error(`HTTP ${response.status}`)

            const sequences = await response.json()
            sequences.forEach(seq => sequencesCache.value.set(seq.slug, seq))
            return sequences
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    const sequencesByLevel = computed(() => {
        const grouped = {}
        sequencesCache.value.forEach(seq => {
            const level = seq.level ?? 'Autre'
            if (!grouped[level]) grouped[level] = []
            grouped[level].push(seq)
        })
        return grouped
    })

    const clearCache = () => {
        sequencesCache.value.clear()
    }

    return {
        fetchSequence,
        fetchAllSequences,
        sequencesByLevel,
        loading,
        error,
        clearCache
    }
}
