<script setup>
import { useDataSheetsStore } from "@/store/dataSheetStore";
const dataSheetStore = useDataSheetsStore();
import FicheListView from '@/views/DataSheetListView.vue'
</script>

<template>
  <FicheListView
    title="Notions HTML"
    subtitle="Travaille la structure, la sémantique et les bonnes pratiques HTML à travers les fiches du référentiel."
    :fiches="dataSheetStore.js"
  />
</template>
