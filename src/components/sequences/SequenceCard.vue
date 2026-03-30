<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Sequence } from '@/types/Sequence'

defineProps<{
  sequence: Sequence
}>()

const DOMAIN_LABELS: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  js: 'JavaScript',
  integration: 'Intégration',
}
</script>

<template>
  <article class="sequence-card">
    <div class="sequence-card__header">
      <h3 class="sequence-card__name">{{ sequence.name }}</h3>
      <span v-if="sequence.type" class="pill pill--domain" :data-domain="sequence.type">
        {{ DOMAIN_LABELS[sequence.type] ?? sequence.type }}
      </span>
    </div>

    <div class="sequence-card__body">
      <p v-if="sequence.description" class="sequence-card__description">
        {{ sequence.description }}
      </p>

      <div class="sequence-card__stats">
        <div class="sequence-card__stat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span class="sequence-card__stat-value">{{ sequence.nodes.length }}</span>
          <span class="sequence-card__stat-label">fiche{{ sequence.nodes.length > 1 ? 's' : '' }}</span>
        </div>

        <div v-if="sequence.estimatedHours" class="sequence-card__stat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="sequence-card__stat-value">{{ sequence.estimatedHours }}h</span>
          <span class="sequence-card__stat-label">estimées</span>
        </div>

        <div v-if="sequence.prerequisiteParcours?.length" class="sequence-card__stat">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span class="sequence-card__stat-value">{{ sequence.prerequisiteParcours.length }}</span>
          <span class="sequence-card__stat-label">prérequis</span>
        </div>
      </div>
    </div>

    <div class="sequence-card__actions">
      <RouterLink class="btn btn--primary padding-xs" :to="`/parcours/${sequence.slug}`">
        Démarrer ce parcours →
      </RouterLink>
    </div>
  </article>
</template>
