import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const STORAGE_PREFIX = 'progression-'

export function useSequencePlayer(sequence) {
    const router = useRouter()

    const orderedNodes = computed(() => {
        if (!sequence?.nodes || !sequence?.firstNodeId) return []

        const nodeMap = Object.fromEntries(sequence.nodes.map(n => [n.id, n]))
        const result = []
        let currentId = sequence.firstNodeId

        while (currentId && nodeMap[currentId]) {
            const node = nodeMap[currentId]
            result.push(node)
            currentId = node.nextNodeId ?? null
        }

        return result
    })

    const totalSteps = computed(() => orderedNodes.value.length)

    const storageKey = `${STORAGE_PREFIX}${sequence?.slug}`

    const loadProgression = () => {
        try {
            const raw = localStorage.getItem(storageKey)
            return raw ? JSON.parse(raw) : { completedSteps: [], lastStep: 0 }
        } catch {
            return { completedSteps: [], lastStep: 0 }
        }
    }

    const saveProgression = (progression) => {
        localStorage.setItem(storageKey, JSON.stringify(progression))
    }

    const progression = ref(loadProgression())

    const markStepCompleted = (index) => {
        if (!progression.value.completedSteps.includes(index)) {
            progression.value.completedSteps.push(index)
        }
        if (index > progression.value.lastStep) {
            progression.value.lastStep = index
        }
        saveProgression(progression.value)
    }

    const isStepCompleted = (index) => {
        return progression.value.completedSteps.includes(index)
    }

    const resetProgression = () => {
        progression.value = { completedSteps: [], lastStep: 0 }
        localStorage.removeItem(storageKey)
    }

    const navigateTo = (index) => {
        const node = orderedNodes.value[index]
        if (!node) return

        router.push({
            name: 'sheets-view',
            params: { slug: node.targetSlug },
            query: {
                parcours: sequence.slug,
                step: index
            }
        })
    }

    const start = () => {
        navigateTo(progression.value.lastStep)
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

    const getNodeAt = (index) => orderedNodes.value[index] ?? null

    const findIndexBySlug = (slug) => {
        return orderedNodes.value.findIndex(n => n.targetSlug === slug)
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
