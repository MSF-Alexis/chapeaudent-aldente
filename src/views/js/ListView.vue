<script setup>
import { useDataSheetsStore } from "@/store/dataSheetStore";
const dataSheetStore = useDataSheetsStore();
import FicheListView from '@/views/DataSheetListView.vue'
</script>

<template>
  <FicheListView title="Notions JavaScript"
    subtitle="Progresse du JavaScript de base aux concepts avancés : variables, DOM, conditions, boucles, fonctions, tableaux, objets, asynchrone et bonnes pratiques pour ajouter de l’interactivité à tes pages."
    :fiches="dataSheetStore.js" />

</template>
