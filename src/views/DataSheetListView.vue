<script setup>
import { computed, ref } from 'vue'
import Pagination from '@/components/Pagination.vue'

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: false,
        default: '',
    },
    fiches: {
        type: Array,
        required: true,
    },
})

const decodeHtmlEntities = (text) => {
    if (!text) return ''
    const el = document.createElement('textarea')
    el.innerHTML = text
    let decoded = el.value
    el.innerHTML = decoded
    decoded = el.value
    return decoded
}

const formatId = (rawId, prefix = '#') => {
    if (!rawId) return ''
    const match = rawId.match(/\d+/);
    return `${prefix}${match}`
}

const itemsPerPage = 10
const currentPage = ref(1)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(props.fiches.length / itemsPerPage))
)

const paginatedFiches = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return props.fiches.slice(start, start + itemsPerPage)
})

const handlePageChange = (page) => {
    currentPage.value = page
}

</script>

<template>
    <main class="home">
        <section class="home-section">
            <header class="home-hero">
                <div class="home-hero__content">
                    <h1>{{ title }}</h1>
                    <p v-if="subtitle" class="home-hero__subtitle">
                        {{ subtitle }}
                    </p>
                </div>
            </header>

            <section class="home-section">
                <header>
                    <h2>Liste des fiches</h2>
                    <p class="home-section__intro">
                        Chaque ligne correspond à une compétence avec son niveau de maîtrise.
                    </p>
                </header>
                <Pagination :current-page="currentPage" :total-pages="totalPages" @update:page="handlePageChange" />

                <ul class="fiche-list">
                    <li v-for="fiche in paginatedFiches" :key="fiche.fichier" class="fiche-list__item">
                        <div class="fiche-list__main">
                            <span class="pill pill--id">
                                {{ formatId(fiche.fichier) }}
                            </span>
                            <h3 class="fiche-title">
                                {{ decodeHtmlEntities(fiche.competence) }}
                            </h3>
                        </div>

                        <div class="fiche-list__meta">
                            <span v-if="fiche.niveau" class="pill pill--level" :data-level="fiche.niveau">
                                {{ fiche.niveau }}
                            </span>

                            <button class="btn btn--ghost btn-sm" type="button">
                                Voir la fiche
                            </button>
                        </div>
                    </li>
                </ul>
                <Pagination :current-page="currentPage" :total-pages="totalPages" @update:page="handlePageChange" />
            </section>
        </section>
    </main>
</template>
