<script setup lang="ts">
import { ref } from 'vue'
import type { StartingAsset } from '@/types/Exercice'

defineProps<{ assets: StartingAsset[] }>()

const copyFeedbacks = ref<Record<string, string>>({})

const copyAsset = async (name: string, content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    copyFeedbacks.value[name] = '✅ Copié !'
  } catch {
    copyFeedbacks.value[name] = '❌ Erreur'
  } finally {
    setTimeout(() => {
      copyFeedbacks.value[name] = '📋 Copier'
    }, 2000)
  }
}

const getFeedback = (name: string) => copyFeedbacks.value[name] ?? '📋 Copier'
</script>

<template>
  <section v-if="assets.length > 0" class="exercice-section">
    <h2 class="exercice-section__title">📎 Fichiers de départ</h2>
    <div v-for="asset in assets" :key="asset.name" class="exercice-asset">
      <div class="exercice-asset__header">
        <div class="exercice-asset__header-left">
          <span class="exercice-asset__name">{{ asset.name }}</span>
          <span class="exercice-asset__desc">{{ asset.description }}</span>
        </div>
        <button class="btn-sm btn--ghost copy-btn" @click="copyAsset(asset.name, asset.content)">
          {{ getFeedback(asset.name) }}
        </button>
      </div>
      <pre class="exercice-asset__code"><code>{{ asset.content }}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.exercice-asset__header {
  justify-content: space-between;
}

.exercice-asset__header-left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.copy-btn {
  border-radius: var(--radius-lg);
  font-size: var(--font-size-xs);
  padding: var(--space-xs) var(--space-sm);
  flex-shrink: 0;
}
</style>
