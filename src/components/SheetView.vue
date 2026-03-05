<script setup>
import { ref, onMounted, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useSheets } from '@/composables/useSheets'
import '@/assets/styles/sheetView.css'

import SheetHeader from '@/components/sheets/SheetHeader.vue'
import SheetBody from '@/components/sheets/SheetBody.vue'

const route = useRoute()
const router = useRouter()

const { fetchSheet, loading, error } = useSheets()
const sheet = ref(null)

const loadSheet = async (slug) => {
    sheet.value = await fetchSheet(slug)
}

onMounted(async () => {
    await loadSheet(route.params.slug)
})

watch(
    () => route.params.slug,
    async (newSlug, oldSlug) => {
        if (newSlug && newSlug !== oldSlug) {
            await loadSheet(newSlug)
        }
    }
)

const goBack = () => {
    router.push(`/${sheet.value.type}`)
}
</script>

<template>
    <div class="sheet-view">
        <div v-if="loading" class="sheet-loading">
            <p>Chargement de la fiche...</p>
        </div>

        <div v-else-if="error" class="sheet-error">
            <p>{{ error }}</p>
            <button @click="goBack" class="btn btn--secondary">
                ← Retour à la liste
            </button>
        </div>

        <article v-else-if="sheet" class="sheet-content">
            <SheetHeader :sheet="sheet" />
            <SheetBody :sheet="sheet" />


            <footer class="sheet-footer">
                <button @click="goBack" class="btn btn--secondary">
                    ← Retour à la liste
                </button>
                <button class="btn btn--primary">
                    Marquer comme complété
                </button>
            </footer>
        </article>
    </div>
</template>
