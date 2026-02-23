<script setup>
import { useDataSheetsStore } from "@/store/dataSheetStore";
const dataSheetStore = useDataSheetsStore();
import FicheListView from '@/views/DataSheetListView.vue'
</script>

<template>
  <FicheListView title="Notions d’intégration web"
    subtitle="Structure tes pages, relie HTML, CSS et JavaScript et entraîne‑toi à manipuler le DOM, les formulaires et les outils des navigateurs comme un intégrateur front-end."
    :fiches="dataSheetStore.integration" />

</template>
