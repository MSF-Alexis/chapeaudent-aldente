<script setup>
import { ref } from 'vue'
import { useDataSheetsStore } from "@/store/dataSheetStore";
const dataSheetStore = useDataSheetsStore();
import FicheListView from '@/views/DataSheetListView.vue'
import BaseModal from '@/components/BaseModal.vue'

const isOpen = ref(false);
const handleOpenedModal = () => isOpen.value = true;
</script>

<template>
  <BaseModal v-model="isOpen" title-id="demo-modal-title">
    <template #title>
      <h2 id="demo-modal-title" class="modal__title">
        Détail de la fiche
      </h2>
    </template>

    <p>Contenu de ta modal (détail de fiche, etc.).</p>

    <template #footer>
      <button class="btn btn--ghost btn-sm" type="button" @click="isOpen = false">
        Annuler
      </button>
    </template>
  </BaseModal>
  <FicheListView 
    title="Notions CSS"
    subtitle="Travaille la mise en forme, les mises en page modernes (Flexbox, Grid), le responsive design et les bonnes pratiques de styles pour construire des interfaces propres et maintenables."
    :fiches="dataSheetStore.css"
    @update:modal="handleOpenedModal"
    />

</template>
