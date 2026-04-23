<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmap } from '@/composables/useRoadmap'
import type { EnrichedRoadmapItem } from '@/types/Roadmap'

type SequenceDomain = 'html' | 'css' | 'js'

const router = useRouter()
const { roadmap, loading, error, fetchRoadmap } = useRoadmap()

const sequences = computed<EnrichedRoadmapItem[]>(() => roadmap.value?.sequences ?? [])

const getDomainFromSlug = (slug: string): SequenceDomain => {
  if (slug.startsWith('parcours-css-')) return 'css'
  if (slug.startsWith('parcours-js-')) return 'js'
  return 'html'
}

const goToSequence = (slug: string) => {
  router.push({ name: 'sequences-view', params: { slug } })
}

onMounted(async () => {
  await fetchRoadmap('0fMyfQBsPK1beigHnpJY')
})
</script>

<template>
  <main class="roadmap-view">
    <header class="roadmap-view__header">
      <h1>Roadmap complète</h1>
      <p class="roadmap-view__subtitle">
        Un seul grand parcours de progression qui relie les 32 séquences,
        dans l’ordre prévu par la roadmap.
      </p>
    </header>

    <section class="roadmap-view__content">
      <div v-if="loading" class="roadmap-view__state">
        Chargement de la roadmap…
      </div>

      <div v-else-if="error" class="roadmap-view__state roadmap-view__state--error">
        Impossible de charger la roadmap.
      </div>

      <div v-else-if="!sequences.length" class="roadmap-view__state">
        Aucune séquence trouvée dans cette roadmap.
      </div>

      <div v-else class="roadmap-path">
        <div class="roadmap-path__line" />

        <article v-for="(item, index) in sequences" :key="item.slug" class="roadmap-step" :class="[
          index % 2 === 0 ? 'roadmap-step--left' : 'roadmap-step--right',
          `roadmap-step--${getDomainFromSlug(item.slug)}`
        ]">
          <div class="roadmap-step__side">
            <button type="button" class="roadmap-card" @click="goToSequence(item.slug)">
              <span class="roadmap-card__order">Étape {{ index + 1 }}</span>

              <span class="roadmap-card__domain">
                {{ getDomainFromSlug(item.slug).toUpperCase() }}
              </span>

              <h2 class="roadmap-card__title">{{ item.title }}</h2>

              <p v-if="item.description" class="roadmap-card__description">
                {{ item.description }}
              </p>
            </button>
          </div>
          <div class="roadmap-step__side roadmap-step__side--empty" />
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.roadmap-view {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text-main);
  font-family: var(--font-sans);
}

.roadmap-view__header {
  max-width: 80vw;
  margin-inline: auto;
  padding: var(--space-4xl) var(--space-xl) var(--space-2xl);
}

.roadmap-view__header h1 {
  font-size: clamp(2rem, 3vw, 2.6rem);
  margin-bottom: var(--space-sm);
}

.roadmap-view__subtitle {
  max-width: 46rem;
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: var(--color-text-soft);
}

.roadmap-view__content {
  max-width: 80vw;
  margin-inline: auto;
  padding: 0 var(--space-xl) var(--space-4xl);
}

.roadmap-view__state {
  padding: var(--space-3xl);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.roadmap-view__state--error {
  color: #b91c1c;
}

.roadmap-path {
  position: relative;
  padding-block: var(--space-lg);
}

.roadmap-path__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(to bottom,
      var(--color-html) 0%,
      var(--color-css) 50%,
      var(--color-js) 100%);
  opacity: 0.35;
}

.roadmap-step {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 4rem minmax(0, 1fr);
  align-items: center;
  margin-bottom: var(--space-xl);
}

.roadmap-step__side {
  display: flex;
  min-width: 0;
}

.roadmap-step__center {
  grid-column: 2;
  width: 4rem;
  min-width: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.roadmap-step__side--empty {
  opacity: 0;
  pointer-events: none;
}

/* LEFT */
.roadmap-step--left .roadmap-step__side:first-child {
  grid-column: 1;
  justify-content: flex-end;
  padding-right: var(--space-lg);
}

.roadmap-step--left .roadmap-step__side--empty {
  grid-column: 3;
}

/* RIGHT */
.roadmap-step--right .roadmap-step__side:first-child {
  grid-column: 3;
  justify-content: flex-start;
  padding-left: var(--space-lg);
}

.roadmap-step--right .roadmap-step__side--empty {
  grid-column: 1;
}

.roadmap-step__node {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.06);
  z-index: 1;
  flex-shrink: 0;
}

.roadmap-card {
  width: min(100%, 28rem);
  text-align: left;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: var(--space-lg);
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    border-color 0.15s ease,
    background-color 0.15s ease;
}

.roadmap-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.roadmap-card__order {
  display: inline-block;
  margin-bottom: var(--space-xs);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.roadmap-card__domain {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-sm);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 700;
  border: 1px solid transparent;
}

.roadmap-card__title {
  margin: 0 0 var(--space-xs);
  font-size: var(--font-size-md);
  line-height: 1.4;
}

.roadmap-card__description {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.55;
  color: var(--color-text-soft);
}

/* HTML */
.roadmap-step--html .roadmap-step__node {
  background-color: var(--color-html);
}

.roadmap-step--html .roadmap-card {
  border-top: 3px solid var(--color-html);
}

.roadmap-step--html .roadmap-card__domain {
  color: var(--color-html);
  background-color: color-mix(in srgb, var(--color-html) 10%, white);
  border-color: color-mix(in srgb, var(--color-html) 18%, var(--color-border));
}

.roadmap-step--html .roadmap-card:hover {
  border-color: color-mix(in srgb, var(--color-html) 35%, var(--color-border));
  background-color: color-mix(in srgb, var(--color-html) 4%, white);
}

/* CSS */
.roadmap-step--css .roadmap-step__node {
  background-color: var(--color-css);
}

.roadmap-step--css .roadmap-card {
  border-top: 3px solid var(--color-css);
}

.roadmap-step--css .roadmap-card__domain {
  color: var(--color-css);
  background-color: color-mix(in srgb, var(--color-css) 10%, white);
  border-color: color-mix(in srgb, var(--color-css) 18%, var(--color-border));
}

.roadmap-step--css .roadmap-card:hover {
  border-color: color-mix(in srgb, var(--color-css) 35%, var(--color-border));
  background-color: color-mix(in srgb, var(--color-css) 4%, white);
}

/* JS */
.roadmap-step--js .roadmap-step__node {
  background-color: var(--color-js);
}

.roadmap-step--js .roadmap-card {
  border-top: 3px solid var(--color-js);
}

.roadmap-step--js .roadmap-card__domain {
  color: #8a6a00;
  background-color: color-mix(in srgb, var(--color-js) 16%, white);
  border-color: color-mix(in srgb, var(--color-js) 22%, var(--color-border));
}

.roadmap-step--js .roadmap-card:hover {
  border-color: color-mix(in srgb, var(--color-js) 40%, var(--color-border));
  background-color: color-mix(in srgb, var(--color-js) 8%, white);
}

@media (max-width: 768px) {

  .roadmap-view__header,
  .roadmap-view__content {
    max-width: 100%;
  }

  .roadmap-view__header {
    padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  }

  .roadmap-view__content {
    padding: 0 var(--space-lg) var(--space-3xl);
  }

  .roadmap-path__line {
    left: 0.55rem;
    transform: none;
  }

  .roadmap-step {
    grid-template-columns: 2rem 1fr;
    gap: var(--space-md);
  }

  .roadmap-step__center {
    grid-column: 1;
    grid-row: 1;
    width: 2rem;
    min-width: 2rem;
    align-self: stretch;
    justify-content: flex-start;
    padding-top: var(--space-lg);
  }

  .roadmap-step__side,
  .roadmap-step--right .roadmap-step__side:first-child,
  .roadmap-step--left .roadmap-step__side:first-child {
    grid-column: 2;
    justify-content: flex-start;
    padding: 0;
  }

  .roadmap-step__side--empty {
    display: none;
  }

  .roadmap-card {
    width: 100%;
  }
}
</style>
