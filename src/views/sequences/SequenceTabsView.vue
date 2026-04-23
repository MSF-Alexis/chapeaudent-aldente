<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SequenceList from '@/components/sequences/SequenceList.vue'
import { useSequences } from '@/composables/useSequences'
import type { Sequence } from '@/types/Sequence'

// Même union que dans useSequences
type SequenceType = 'html' | 'css' | 'js'

const TYPES: SequenceType[] = ['html', 'css', 'js']

const TAB_META: Record<SequenceType, { label: string; description: string }> = {
  html: {
    label: 'HTML',
    description: 'Structure, sémantique, formulaires, tableaux et accessibilité.',
  },
  css: {
    label: 'CSS',
    description: 'Mise en forme, layout, responsive design, animations et thèmes.',
  },
  js: {
    label: 'JavaScript',
    description: 'Logique, DOM, événements, asynchrone et interactions.',
  },
}

const route = useRoute()
const router = useRouter()

const {
  fetchSequencesByType,
  getCachedSequencesByType,
  loading,
  error,
} = useSequences()

const currentType = computed<SequenceType>(() => {
  const routeType = route.params.type
  if (typeof routeType === 'string' && TYPES.includes(routeType as SequenceType)) {
    return routeType as SequenceType
  }
  return 'html'
})

const currentSequences = computed<Sequence[]>(() => {
  return getCachedSequencesByType(currentType.value)
})

const changeTab = async (type: SequenceType) => {
  if (type === currentType.value) return
  await router.push(`/parcours/domaine/${type}`)
}

onMounted(async () => {
  if (route.path === '/parcours' || route.path === "/parcours/domaine") {
    await router.replace('/parcours/domaine/html')
    return
  }

  await fetchSequencesByType(currentType.value)
})

watch(
  () => currentType.value,
  async (type) => {
    await fetchSequencesByType(type)
  },
  { immediate: false }
)
</script>

<template>
  <main class="parcours-tabs-view">
    <section class="parcours-tabs-view__hero">
      <div class="parcours-tabs-view__hero-content">
        <h1>Parcours par domaine</h1>
        <p class="parcours-tabs-view__intro">
          Explore les parcours par technologie. Chaque onglet affiche uniquement
          le domaine sélectionné pour rendre la navigation plus claire.
        </p>
        <header class="parcours-tabs-view__panel-header">
          <h3>{{ TAB_META[currentType].label }}</h3>
          <p>{{ TAB_META[currentType].description }}</p>
        </header>
      </div>
    </section>

    <section class="parcours-tabs-view__content">
      <div class="parcours-tabs" role="tablist" aria-label="Domaines de parcours">
        <button v-for="type in TYPES" :key="type" type="button" class="parcours-tabs__tab" :class="[
          `parcours-tabs__tab--${type}`,
          { 'parcours-tabs__tab--active': currentType === type }
        ]" role="tab" :aria-selected="currentType === type" @click="changeTab(type)">
          {{ TAB_META[type].label }}
        </button>
      </div>

      <div class="parcours-tabs-view__panel">

        <p v-if="loading" class="parcours-tabs-view__state">
          Chargement des parcours…
        </p>

        <p v-else-if="error" class="parcours-tabs-view__state parcours-tabs-view__state--error">
          {{ error.message ?? 'Impossible de charger les parcours pour ce domaine.' }}
        </p>

        <SequenceList v-else :sequences="currentSequences" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.parcours-tabs-view {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text-main);
}

.parcours-tabs-view__hero {
  padding: var(--space-4xl) var(--space-xl) var(--space-2xl);
  border-bottom: 1px solid var(--color-border);
  background: radial-gradient(circle at top left, #e0f2fe, var(--color-bg) 42%);
}

.parcours-tabs-view__hero-content,
.parcours-tabs-view__content {
  max-width: 80vw;
  margin-inline: auto;
}

.parcours-tabs-view__intro {
  margin-top: var(--space-sm);
  max-width: 42rem;
  color: var(--color-text-soft);
  font-size: var(--font-size-md);
  line-height: 1.6;
}

.parcours-tabs-view__content {
  padding: var(--space-2xl) var(--space-xl) var(--space-4xl);
}

.parcours-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.parcours-tabs__tab {
  appearance: none;
  border: 1px solid var(--color-border-soft);
  background-color: var(--color-surface);
  color: var(--color-text-soft);
  border-radius: var(--radius-full);
  padding: 0.7rem 1rem;
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease,
    box-shadow 0.15s ease;
}

.parcours-tabs__tab:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.parcours-tabs__tab--active {
  color: #fff;
  border-color: transparent;
}

.parcours-tabs__tab--html.parcours-tabs__tab--active {
  background-color: var(--color-html);
}

.parcours-tabs__tab--css.parcours-tabs__tab--active {
  background-color: var(--color-css);
}

.parcours-tabs__tab--js.parcours-tabs__tab--active {
  background-color: var(--color-js);
}

.parcours-tabs-view__panel {
  padding: var(--space-xl);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.parcours-tabs-view__panel-header {
  margin-bottom: var(--space-xl);
}

.parcours-tabs-view__panel-header p {
  margin-top: var(--space-xs);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.parcours-tabs-view__state {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.parcours-tabs-view__state--error {
  color: #b91c1c;
}

@media (max-width: 640px) {
  .parcours-tabs-view__hero {
    padding: var(--space-2xl) var(--space-lg);
  }

  .parcours-tabs-view__hero-content,
  .parcours-tabs-view__content {
    max-width: 100%;
  }

  .parcours-tabs-view__content {
    padding: var(--space-xl) var(--space-lg) var(--space-3xl);
  }

  .parcours-tabs {
    flex-direction: column;
  }

  .parcours-tabs__tab {
    width: 100%;
    justify-content: center;
  }
}
</style>
