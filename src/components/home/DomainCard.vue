<script setup lang="ts">
type DomainCardProps = {
  isLoading: boolean
  title: string
  sheetCount: number
  sequenceCount: number
  exerciceCount: number
  additionnalClasses?: string
  ctaLink: string
}

defineProps<{ domainCardProps: DomainCardProps }>()
</script>

<template>
  <article :class="['domain-card', domainCardProps.additionnalClasses]">
    <h3>{{ domainCardProps.title }}</h3>

    <p class="domain-card__description">
      <slot name="description" />
    </p>

    <ul class="domain-card__meta">
      <li class="domain-card__stats">
        <span class="pill pill--stat">
          <strong v-if="domainCardProps.isLoading">...</strong>
          <strong v-else>{{ domainCardProps.sheetCount }}</strong> fiches
        </span>
        <span class="pill pill--stat">
          <strong v-if="domainCardProps.isLoading">...</strong>
          <strong v-else>{{ domainCardProps.sequenceCount }}</strong> séquences
        </span>
        <span class="pill pill--stat">
          <strong v-if="domainCardProps.isLoading">...</strong>
          <strong v-else>{{ domainCardProps.exerciceCount }}</strong> exercices
        </span>
      </li>

      <li><strong>Niveaux :</strong> Initial → Expert</li>

      <li>
        <strong>Compétences clés :</strong>
        <slot name="key-skills" />
      </li>
    </ul>

    <div class="domain-card__actions">
      <RouterLink class="btn btn--secondary" :to="domainCardProps.ctaLink">
        Explorer les ressources {{ domainCardProps.title }}
      </RouterLink>
    </div>
  </article>
</template>
