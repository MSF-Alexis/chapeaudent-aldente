<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
    sheet: {
        type: Object,
        required: true
    }
})

const typeBadgeClass = computed(() => {
    if (!props.sheet?.type) return ''
    const typeMap = {
        html: 'badge--html',
        css: 'badge--css',
        js: 'badge--js',
        integration: 'badge--integration'
    }
    return typeMap[props.sheet.type] || ''
})

const levelDataAttr = computed(() => {
    return props.sheet?.level || ''
})
</script>

<template>
    <header class="sheet-header">
        <div class="breadcrumb">
            <a :href="`/${sheet.type}`" class="breadcrumb__link">
                {{ sheet.type.toUpperCase() }}
            </a>
            <span class="breadcrumb__separator">/</span>
            <span class="breadcrumb__current">{{ sheet.slug }}</span>
        </div>

        <h1 class="sheet-title">{{ sheet.skillTitle }}</h1>

        <div class="sheet-meta">
            <span class="pill pill--type" :class="typeBadgeClass">
                {{ sheet.type.toUpperCase() }}
            </span>
            <span class="pill pill--level" :data-level="levelDataAttr">
                {{ sheet.level }}
            </span>
        </div>

        <div v-if="sheet.prerequisites?.length" class="sheet-prerequisites">
            <strong class="prerequisites-label">Prérequis :</strong>
            <div class="prerequisites-list">
                <RouterLink v-for="prereqSheetSlug in sheet.prerequisites" :key="prereqSheetSlug"
                    :to="{ name: 'sheets-view', params: { slug: prereqSheetSlug } }" class="prereq-link">
                    {{ prereqSheetSlug }}
                </RouterLink>
            </div>
        </div>

        <div v-if="sheet.rncpSkills?.length" class="sheet-rncp">
            <strong class="rncp-label">Compétences RNCP :</strong>
            <div class="rncp-list">
                <span v-for="skill in sheet.rncpSkills" :key="skill" class="pill pill--rncp">
                    {{ skill }}
                </span>
            </div>
        </div>
    </header>
</template>