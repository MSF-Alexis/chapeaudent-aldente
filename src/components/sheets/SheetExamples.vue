<script setup>
import { ref } from 'vue'
import CodeBlock from '@/components/sheets/CodeBlock.vue'

const props = defineProps({
    examples: {
        type: Array,
        required: true
    }
})
console.log('📦 CodeBlock props:', props)
const activeExampleIndex = ref(0)

const selectExample = (index) => {
    activeExampleIndex.value = index
}
</script>

<template>
    <section v-if="examples?.length" class="sheet-section sheet-section--examples">
        <h2 class="section-title">💻 Exemples</h2>

        <!-- Tabs si plusieurs exemples -->
        <div v-if="examples.length > 1" class="example-tabs">
            <button v-for="(example, index) in examples" :key="example.id" @click="selectExample(index)"
                :class="['example-tab', { 'example-tab--active': activeExampleIndex === index }]">
                {{ example.title }}
            </button>
        </div>

        <!-- Active example content -->
        <div v-if="examples[activeExampleIndex]" class="example-content">
            <!-- Title si un seul exemple -->
            <h3 v-if="examples.length === 1" class="example-title">
                {{ examples[activeExampleIndex].title }}
            </h3>

            <!-- Description -->
            <div v-if="examples[activeExampleIndex].description" v-html="examples[activeExampleIndex].description"
                class="example-description"></div>

            <!-- Code blocks -->
            <div class="code-blocks">
                <CodeBlock v-for="(block, idx) in examples[activeExampleIndex].blocks" :key="idx" :code="block.code"
                    :language="block.language" :label="block.label" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.sheet-section--examples {
    border-left: 4px solid var(--color-integration);
}

/* Tabs */
.example-tabs {
    display: flex;
    gap: var(--space-xs);
    margin-bottom: var(--space-lg);
    border-bottom: 2px solid var(--color-border);
    flex-wrap: wrap;
}

.example-tab {
    padding: var(--space-sm) var(--space-lg);
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--color-text-soft);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.example-tab:hover {
    color: var(--color-text-main);
    background-color: var(--color-bg-alt);
}

.example-tab--active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
    font-weight: 600;
}

/* Content */
.example-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}

.example-title {
    font-size: var(--font-size-lg);
    margin: 0;
    color: var(--color-text-main);
    font-weight: 600;
}

.example-description {
    color: var(--color-text-soft);
    line-height: 1.6;
}

.example-description :deep(p) {
    margin: 0;
}

.code-blocks {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

/* Responsive */
@media (max-width: 768px) {
    .example-tabs {
        overflow-x: auto;
    }

    .example-tab {
        flex-shrink: 0;
    }
}
</style>
