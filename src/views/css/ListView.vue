<script setup>
import { ref, computed } from 'vue'
import { useDataSheetsStore } from "@/store/dataSheetStore";
import { prettifyCode, formatId, copyElementValue } from '@/helpers/courseDisplayHelper'
import FicheListView from '@/views/DataSheetListView.vue'
import "@/assets/styles/modal.css";
import BaseModal from '@/components/BaseModal.vue'

const dataSheetStore = useDataSheetsStore();
const isOpen = ref(false)
const currentFiche = ref(null)
const copyFeedback = ref('Copier le code')

const handleOpenedModal = (fiche) => {
  currentFiche.value = fiche
  isOpen.value = true
}

const highlightedExample = computed(() => {
  if (!currentFiche.value) return ''
  return prettifyCode(currentFiche.value.exemple, { type: 'css' })
})

const handleCopyExample = async () => {
  if (!currentFiche.value) return
  await copyElementValue(copyFeedback);
}

</script>

<template>
  <BaseModal v-model="isOpen" title-id="html-modal-title">
    <template #title>
      <div class="fiche-detail__header">
        <h2 id="html-modal-title" class="modal__title fiche-detail__title">
          {{ currentFiche?.competence || 'Détail de la fiche CSS' }}
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
        <article class="fiche-detail__exemple">
          <div class="pre-body">
            <div class="fiche-detail__exemple-actions">
              <button type="button" class="btn btn--light btn-xs text-on-light" @click="handleCopyExample">
                {{ copyFeedback }}
              </button>
            </div>
            <div v-html="highlightedExample" />
          </div>

        </article>
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
  <FicheListView title="Notions CSS"
    subtitle="Travaille la mise en forme, les mises en page modernes (Flexbox, Grid), le responsive design et les bonnes pratiques de styles pour construire des interfaces propres et maintenables."
    :fiches="dataSheetStore.css" @update:modal="handleOpenedModal" />

</template>
