<script setup>
import { useDataSheetsStore } from "@/store/dataSheetStore";
const dataSheetStore = useDataSheetsStore();
import FicheListView from '@/views/DataSheetListView.vue'
</script>

<template>
  <FicheListView title="Notions CSS"
    subtitle="Travaille la mise en forme, les mises en page modernes (Flexbox, Grid), le responsive design et les bonnes pratiques de styles pour construire des interfaces propres et maintenables."
    :fiches="dataSheetStore.css" />

</template>
