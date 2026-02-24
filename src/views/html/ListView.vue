<script setup>
import { ref, computed } from 'vue'
import { useDataSheetsStore } from "@/store/dataSheetStore";
import { highlightHtmlExample } from '@/helpers/highlightHtmlExample'
import FicheListView from '@/views/DataSheetListView.vue'
import BaseModal from '@/components/BaseModal.vue'

const dataSheetStore = useDataSheetsStore();
const isOpen = ref(false)
const currentFiche = ref(null)

const handleOpenedModal = (fiche) => {
  currentFiche.value = fiche
  isOpen.value = true
}

const formatId = (rawId, prefix = '#') => {
  if (!rawId) return ''
  const match = rawId.match(/\d+/);
  return `${prefix}${match}`
}

const highlightedExample = computed(() => {
  if (!currentFiche.value) return ''
  return highlightHtmlExample(currentFiche.value.exemple)
})

</script>

<template>
  <BaseModal v-model="isOpen" title-id="html-modal-title">
    <template #title>
      <div class="fiche-detail__header">
        <h2 id="html-modal-title" class="modal__title fiche-detail__title">
          {{ currentFiche?.competence || 'Détail de la fiche HTML' }}
        </h2>
        <p v-if="currentFiche" class="fiche-detail__subtitle">
          Fiche {{ formatId(currentFiche.fichier) }} · Niveau&nbsp;
          <span class="pill pill--level" :data-level="currentFiche.niveau">
            {{ currentFiche.niveau }}
          </span>
        </p>
      </div>
    </template>

    <section v-if="currentFiche" class="fiche-detail">
      <div class="fiche-detail__main">
        <article class="fiche-detail__section" v-html="currentFiche.objectif"></article>
        <article class="fiche-detail__section" v-html="currentFiche.theorie"></article>
        <article class="fiche-detail__exemple" v-html="highlightedExample" />
      </div>

      <aside class="fiche-detail__side">
        <section class="fiche-detail__card">
          <h4>Informations</h4>
          <p class="fiche-detail__meta-line">
            <span class="fiche-detail__meta-label">Identifiant</span>
            <span class="pill pill--id">{{ currentFiche.fichier }}</span>
          </p>
        </section>

        <section class="fiche-detail__card">
          <div class="fiche-detail__content" v-html="currentFiche.sources"></div>
        </section>

        <section v-if="currentFiche.infos_supplementaires" class="fiche-detail__card">
          <h4>Informations complémentaires</h4>
          <div class="fiche-detail__content" v-html="currentFiche.infos_supplementaires"></div>
        </section>
      </aside>
    </section>

    <p v-else class="fiche-detail__empty">
      Sélectionne une fiche dans la liste pour voir le détail.
    </p>

    <template #footer>
      <button class="btn btn--ghost btn-sm" type="button" @click="isOpen = false">
        Fermer
      </button>
    </template>
  </BaseModal>

  <FicheListView title="Notions HTML"
    subtitle="Structure, sémantique, accessibilité et bonnes pratiques pour un HTML propre et compréhensible."
    :fiches="dataSheetStore.html" @update:modal="handleOpenedModal" />
</template>

<style scoped>
/* === CONTENU DU JSON : h3 / texte / listes / code / liens === */

.fiche-detail__section :deep(h3) {
  margin-top: 0;
  margin-bottom: var(--space-sm);
  font-size: 1.05rem;
  line-height: 1.35;
  color: var(--color-text-main);
}

.fiche-detail__section :deep(p),
.fiche-detail__card :deep(p) {
  margin-bottom: var(--space-sm);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--color-text-soft);
  max-width: 70ch;
}

.fiche-detail__section :deep(ul),
.fiche-detail__card :deep(ul) {
  padding-left: 1.3rem;
  margin: var(--space-sm) 0;
}

.fiche-detail__section :deep(li),
.fiche-detail__card :deep(li) {
  margin-bottom: 0.3rem;
}

.fiche-detail__section :deep(li)::marker,
.fiche-detail__card :deep(li)::marker {
  color: var(--color-primary);
}

.fiche-detail__section :deep(code),
.fiche-detail__card :deep(code) {
  padding: 0.1rem 0.25rem;
  border-radius: 4px;
  background-color: var(--color-bg-alt);
  border: 1px solid var(--color-border-soft);
  font-size: 0.8rem;
}

.fiche-detail__section :deep(pre) {
  margin: var(--space-sm) 0 0;
  padding: var(--space-sm) var(--space-md);
  border-radius: 6px;
  background-color: #0f172a;
  color: #e5e7eb;
  font-size: 0.8rem;
  overflow-x: auto;
}

.fiche-detail__section :deep(a),
.fiche-detail__card :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid rgba(37, 99, 235, 0.25);
  padding-bottom: 0.05rem;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.fiche-detail__section :deep(a:hover),
.fiche-detail__card :deep(a:hover) {
  color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
  background-color: rgba(37, 99, 235, 0.08);
}

.fiche-detail__side {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.fiche-detail__card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-lg);
  box-shadow: var(--shadow-softer);
}

.fiche-detail__card:first-child {
  border-top: 3px solid var(--color-html);
}

.fiche-detail__card h4 {
  margin: 0 0 var(--space-sm);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.fiche-detail__content {
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--color-text-soft);
}

.fiche-detail__meta-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  margin: var(--space-xs) 0;
}

.fiche-detail__meta-label {
  color: var(--color-text-soft);
}

.fiche-detail__empty {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .fiche-detail {
    grid-template-columns: 1fr;
    padding: var(--space-md);
  }

  .fiche-detail__side {
    order: -1;
  }

  .fiche-detail__section {
    padding: var(--space-md);
  }
}
</style>
