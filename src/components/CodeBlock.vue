<script setup>
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'
import '@/assets/styles/prism.css'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'html'
  },
  label: {
    type: String,
    default: ''
  }
})

const copyFeedback = ref('📋 Copier')

const languageMap = {
  html: { prismLang: 'markup', prismDef: Prism.languages.markup },
  css: { prismLang: 'css', prismDef: Prism.languages.css },
  js: { prismLang: 'javascript', prismDef: Prism.languages.javascript },
  javascript: { prismLang: 'javascript', prismDef: Prism.languages.javascript }
}

const langConfig = computed(() => {
  return languageMap[props.language] || languageMap.html
})

const decodedCode = computed(() => {
  let decoded = props.code
  
  decoded = decoded
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
  
  const textarea = document.createElement('textarea')
  textarea.innerHTML = decoded
  return textarea.value
})

const highlightedCode = computed(() => {
  const config = langConfig.value
  return Prism.highlight(decodedCode.value, config.prismDef, config.prismLang)
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(decodedCode.value)
    copyFeedback.value = '✅ Copié !'
    setTimeout(() => {
      copyFeedback.value = '📋 Copier'
    }, 2000)
  } catch (err) {
    copyFeedback.value = '❌ Erreur'
    setTimeout(() => {
      copyFeedback.value = '📋 Copier'
    }, 2000)
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-label">{{ label || language.toUpperCase() }}</span>
      <button @click="copyCode" class="copy-btn btn-sm btn--ghost">
        {{ copyFeedback }}
      </button>
    </div>
    <pre class="code-pre"><code :class="`language-${langConfig.prismLang}`" v-html="highlightedCode"></code></pre>
  </div>
</template>

<style scoped>
.code-block {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}

.code-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.copy-btn {
  font-size: var(--font-size-xs);
  padding: var(--space-xs) var(--space-sm);
}

.code-pre {
  margin: 0;
  padding: var(--space-lg);
  overflow-x: auto;
  background-color: #f5f2f0;
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.code-pre code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  display: block;
  white-space: pre;
}
</style>
