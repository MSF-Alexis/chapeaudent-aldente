<script setup>
import { computed, ref } from 'vue'
const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['update:page'])

const goToPage = (page) => {
    if (page < 1 || page > props.totalPages) return
    emit('update:page', page)
}

const goToPrevious = () => goToPage(props.currentPage - 1)
const goToNext = () => goToPage(props.currentPage + 1)

const visiblePages = computed(() => {
    const pages = []
    const maxAround = 1
    const start = Math.max(1, props.currentPage - maxAround)
    const end = Math.min(props.totalPages, props.currentPage + maxAround)
    for (let p = start; p <= end; p += 1) {
        pages.push(p)
    }
    return pages
})
</script>

<template>
    <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination des fiches">
        <button type="button" class="pagination__arrow" :disabled="currentPage === 1" @click="goToPrevious">
            ‹
        </button>

        <button v-if="visiblePages[0] > 1" type="button" class="pagination__page"
            :class="{ 'pagination__page--active': currentPage === 1 }" @click="goToPage(1)">
            1
        </button>
        <span v-if="visiblePages[0] > 2" class="pagination__ellipsis">
            …
        </span>

        <button v-for="page in visiblePages" :key="page" type="button" class="pagination__page"
            :class="{ 'pagination__page--active': currentPage === page }" @click="goToPage(page)">
            {{ page }}
        </button>

        <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="pagination__ellipsis">
            …
        </span>
        <button v-if="visiblePages[visiblePages.length - 1] < totalPages" type="button" class="pagination__page"
            :class="{ 'pagination__page--active': currentPage === totalPages }" @click="goToPage(totalPages)">
            {{ totalPages }}
        </button>

        <button type="button" class="pagination__arrow" :disabled="currentPage === totalPages" @click="goToNext">
            ›
        </button>
    </nav>
</template>
