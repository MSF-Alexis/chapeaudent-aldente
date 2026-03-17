<script setup>
import { computed } from 'vue'

const props = defineProps({
  spotTheBug: {
    type: Object,
    required: true
  }
})

// On laisse Prism/CodeBlock gérer la coloration via ton composant global,
// ici on affiche simplement du code en <pre><code>.
const hasErrors = computed(() => props.spotTheBug.errors?.length > 0)
</script>

<template>
  <section class="sheet-section sheet-section--spot">
    <h2 class="section-title">🐛 Spot the bug</h2>

    <!-- Consigne -->
    <p class="spot-guideline">
      Le code ci-dessous contient une ou plusieurs erreurs. Identifie-les, puis compare avec la correction.
    </p>

    <!-- Code buggé -->
    <div class="spot-block">
      <div class="spot-block__header">
        <span class="spot-block__label">Code à corriger</span>
      </div>
      <pre class="spot-code"><code>{{ spotTheBug.buggedCode }}</code></pre>
    </div>

    <!-- Liste d’erreurs attendues -->
    <div v-if="hasErrors" class="spot-errors">
      <h3 class="spot-errors__title">🔍 Problèmes à détecter</h3>
      <ul class="spot-errors__list">
        <li
          v-for="(error, index) in spotTheBug.errors"
          :key="index"
          class="spot-errors__item"
        >
          {{ error }}
        </li>
      </ul>
    </div>

    <!-- Code corrigé -->
    <div class="spot-block spot-block--fixed">
      <div class="spot-block__header">
        <span class="spot-block__label">Code corrigé</span>
      </div>
      <pre class="spot-code"><code>{{ spotTheBug.fixedCode }}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.sheet-section--spot {
  border-left: 4px solid #ef4444;
}

.spot-guideline {
  margin: 0 0 var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-soft);
}

/* Blocs code */

.spot-block {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-lg);
  background-color: var(--color-surface);
}

.spot-block--fixed {
  border-color: #22c55e;
}

.spot-block__header {
  padding: var(--space-sm) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg-alt);
}

.spot-block__label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-soft);
}

.spot-code {
  margin: 0;
  padding: var(--space-lg);
  background-color: #f5f2f0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}

/* Erreurs */

.spot-errors {
  margin-bottom: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.spot-errors__title {
  margin: 0 0 var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: #b91c1c;
}

.spot-errors__list {
  margin: 0;
  padding-left: var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-soft);
}

.spot-errors__item + .spot-errors__item {
  margin-top: var(--space-xs);
}
</style>
