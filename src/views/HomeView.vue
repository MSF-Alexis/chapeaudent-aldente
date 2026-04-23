<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useStats } from '@/composables/useStats'
import type { EntitiesCount } from '@/types/Stat'
import DomainCard from '@/components/home/DomainCard.vue'

const { fetchStats, loading } = useStats()

const stats = ref<EntitiesCount | null>(null)
onMounted(async () => {
  stats.value = await fetchStats()
})

const getIndividualCount = (entity: keyof EntitiesCount, type: string): number => {
  const entityStats = stats.value?.[entity]

  if (!Array.isArray(entityStats)) return 0

  return entityStats.find((item) => item.type === type)?.count ?? 0
}

const sheetCount = computed(() => {
  return stats.value?.sheets?.reduce((accumulator, currentEntityCount) => accumulator + currentEntityCount.count, 0)
})

const sequenceCount = computed(() => {
  return stats.value?.sequences?.reduce((accumulator, currentEntityCount) => accumulator + currentEntityCount.count, 0)
})

const exerciceCount = computed(() => {
  return stats.value?.exercices?.reduce((accumulator, currentEntityCount) => accumulator + currentEntityCount.count, 0)
})


</script>

<template>
  <main class="home">
    <header class="home-hero">
      <div class="home-hero__content">
        <h1>Chapeaudent</h1>
        <p class="home-hero__subtitle">
          Un catalogue de fiches HTML, CSS, JavaScript et Intégration
          pour apprendre pas à pas, du niveau débutant à expert.
        </p>

        <div class="home-hero__actions">
          <RouterLink class="btn btn--primary" to="/parcours">
            Commencer un parcours
          </RouterLink>
        </div>

        <p class="home-hero__hint">
          Choisis un domaine ou un niveau, puis explore les fiches avec
          théorie, exemples, sources et exercices.
        </p>
      </div>
      <div class="home-stats">
        <div class="stat-card">
          <span class="stat-card__number">
            <span v-if="loading">…</span>
            <span v-else>{{ sheetCount }}</span>
          </span>
          <span class="stat-card__label">Fiches disponibles</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__number">
            <span v-if="loading">…</span>
            <span v-else>{{ sequenceCount }}</span>
          </span>
          <span class="stat-card__label">Parcours disponibles</span>
        </div>
        <div class="stat-card">
          <span class="stat-card__number">
            <span v-if="loading">…</span>
            <span v-else>{{ exerciceCount }}</span>
          </span>
          <span class="stat-card__label">Exercices disponibles</span>
        </div>
      </div>

    </header>

    <section class="home-section">

      <h2>Domaines de compétences</h2>

      <div class="domain-grid">
        <DomainCard :domain-card-props="{
          isLoading: loading,
          title: 'HTML',
          sheetCount: getIndividualCount('sheets', 'html'),
          sequenceCount: getIndividualCount('sequences', 'html'),
          exerciceCount: getIndividualCount('exercices', 'html'),
          additionnalClasses: 'domain-card--html',
          ctaLink: '/html',
        }">

          <template #description>
            Structurer le contenu, utiliser les balises sémantiques,
            formulaires, tableaux, accessibilité…
          </template>

          <template #key-skills>
            structure de page, formulaires, tableaux, accessibilité.
          </template>
        </DomainCard>

        <DomainCard :domain-card-props="{
          isLoading: loading,
          title: 'CSS',
          sheetCount: getIndividualCount('sheets', 'css'),
          sequenceCount: getIndividualCount('sequences', 'css'),
          exerciceCount: getIndividualCount('exercices', 'css'),
          additionnalClasses: 'domain-card--css',
          ctaLink: '/css',
        }">

          <template #description>
            Mise en forme, layout, responsive design, Flexbox, Grid,
            animations, thèmes et accessibilité.
          </template>

          <template #key-skills>
            box model, Flexbox, Grid, media queries.
          </template>
        </DomainCard>

        <DomainCard :domain-card-props="{
          isLoading: loading,
          title: 'JavaScript',
          sheetCount: getIndividualCount('sheets', 'js'),
          sequenceCount: getIndividualCount('sequences', 'js'),
          exerciceCount: getIndividualCount('exercices', 'js'),
          additionnalClasses: 'domain-card--js',
          ctaLink: '/js',
        }">
          <template #description>
            Logique, DOM, événements, JSON, asynchrone, gestion d’erreurs,
            localStorage et patterns avancés.
          </template>

          <template #key-skills>
            DOM, événements, tableaux, fonctions, async/await.
          </template>
        </DomainCard>
      </div>
    </section>
  </main>
</template>
<style scoped>
.home-stats {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  padding: 2rem 1rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 3rem;
  background: var(--color-surface, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 1rem;
  min-width: 160px;
}

.stat-card__number {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1;
}

.stat-card__label {
  font-size: 0.95rem;
  color: var(--color-text-muted, #64748b);
  text-align: center;
}

@media (max-width: 640px) {
  .home-stats {
    flex-direction: column;
    align-items: stretch;
  }

  .stat-card {
    width: 100%;
    padding: 1.25rem 1.5rem;
  }

  .stat-card__number {
    font-size: 2.2rem;
  }
}
</style>
