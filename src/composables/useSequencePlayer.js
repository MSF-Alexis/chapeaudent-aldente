import { ref, computed } from 'vue'

const STORAGE_PREFIX = 'progression-'

export function useSequencePlayer(sequence, router) {

    // ─── Reconstruction de la liste ordonnée ──────────────────
    const orderedNodes = computed(() => {
        if (!sequence?.nodes || !sequence?.firstNodeId) return []

        const map = Object.fromEntries(sequence.nodes.map(n => [n.id, n]))
        const result = []
        let currentId = sequence.firstNodeId

        const seen = new Set()

        while (currentId && map[currentId] && !seen.has(currentId)) {
            seen.add(currentId)
            const node = map[currentId]
            result.push(node)
            currentId = node.nextNodeId ?? null
        }

        return result
    })

    const totalSteps = computed(() => orderedNodes.value.length)

    // ─── Progression (localStorage) ───────────────────────────
    const storageKey = `${STORAGE_PREFIX}${sequence?.slug}`

    const loadProgression = () => {
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

    const saveProgression = (p) => {
        localStorage.setItem(storageKey, JSON.stringify(p))
    }

    const progression = ref(loadProgression())

    const markStepCompleted = (index) => {
        if (index < 0 || index >= totalSteps.value) return
        if (!progression.value.completedSteps.includes(index)) {
            progression.value.completedSteps.push(index)
        }
        if (index > progression.value.lastStep) {
            progression.value.lastStep = index
        }
        saveProgression(progression.value)
    }

    const isStepCompleted = (index) => progression.value.completedSteps.includes(index)

    const resetProgression = () => {
        progression.value = { completedSteps: [], lastStep: 0 }
        localStorage.removeItem(storageKey)
    }

    // ─── Navigation ───────────────────────────────────────────
    const navigateTo = (index) => {
        const node = orderedNodes.value[index]
        if (!node || !node.targetSlug || !sequence?.slug) return

        router.push({
            name: 'sheets-view',             // ton nom de route actuel
            params: { slug: node.targetSlug },
            query: {
                parcours: sequence.slug,
                step: index,
            },
        })
    }

    const start = () => {
        // si progression lastStep est hors bornes, on repart de 0
        const index =
            progression.value.lastStep >= 0 &&
                progression.value.lastStep < totalSteps.value
                ? progression.value.lastStep
                : 0

        navigateTo(index)
    }

    const goTo = (index) => {
        if (index < 0 || index >= totalSteps.value) return
        navigateTo(index)
    }

    const goNext = (currentIndex) => {
        goTo(currentIndex + 1)
    }

    const goPrev = (currentIndex) => {
        goTo(currentIndex - 1)
    }

    // ─── Helpers ───────────────────────────────────────────────
    const getNodeAt = (index) => orderedNodes.value[index] ?? null

    const findIndexBySlug = (slug) => {
        return orderedNodes.value.findIndex((n) => n.targetSlug === slug)
    }

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
