<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import type { FillTheGapValidation } from '@/types/Sheet'

const props = defineProps<{
  fillTheGap: FillTheGapValidation
}>()

type TextSegment = {
  type: 'text'
  content: string
}

type BlankSegment = {
  type: 'blank'
  blankIndex: number
  placeholder: string
  content: string
}

type Segment = TextSegment | BlankSegment

const userAnswers = ref(props.fillTheGap.blanks.map(() => ''))
const statuses: Ref<(string | null)[]> = ref(props.fillTheGap.blanks.map(() => null))
const showCorrection = ref(false)

const allFilled = computed(() =>
  userAnswers.value.every(a => a.trim().length > 0)
)

const allAnswered = computed(() =>
  statuses.value.every(s => s !== null)
)

const score = computed(() =>
  statuses.value.filter(s => s === 'correct').length
)

const processedGuideline = computed(() => {
  const g = props.fillTheGap.guideline
  if (!g) return ''

  return g
    .replace(/<code>/g, '<code class="inline-code">')
    .replace(/<code /g, '<code class="inline-code" ')
})

const parsedLines = computed(() => {
  const lines = props.fillTheGap.codeTemplate.split('\n')
  const blanks = props.fillTheGap.blanks

  return lines.map(line => {
    let segments: Segment[] = [{ type: 'text', content: line }]

    blanks.forEach((blank, blankIndex) => {
      const next: Segment[] = []
      segments.forEach(seg => {
        if (seg.type !== 'text') { next.push(seg); return }
        const parts = seg.content.split(blank.placeholder)
        parts.forEach((part, i) => {
          if (part !== '') next.push({ type: 'text', content: part })
          if (i < parts.length - 1) {
            next.push({ type: 'blank', blankIndex, placeholder: blank.placeholder, content: '' })
          }
        })
      })
      segments = next
    })

    return segments
  })
})
const validate = () => {
  statuses.value = props.fillTheGap.blanks.map((blank, i) => {
    return userAnswers.value[i]?.trim().toLowerCase() === blank.answer.trim().toLowerCase()
      ? 'correct' : 'wrong'
  })
  showCorrection.value = true
}

const reset = () => {
  userAnswers.value = props.fillTheGap.blanks.map(() => '')
  statuses.value = props.fillTheGap.blanks.map(() => null)
  showCorrection.value = false
}
</script>

<template>
  <section class="sheet-section sheet-section--ftg">
    <h2 class="section-title">🧩 Compléter le code</h2>
    <div v-if="processedGuideline" class="ftg-guideline section-content" v-html="processedGuideline"></div>
    <div class="ftg-code-wrap">
      <pre class="ftg-pre"><code class="ftg-code"><template v-for="(lineSegments, lineIndex) in parsedLines" :key="lineIndex"><template v-for="(seg, segIndex) in lineSegments" :key="segIndex"><template v-if="seg.type === 'text'">{{ seg.content }}</template><template
  v-else><span
              class="ftg-input-wrap"
              :class="{
                'ftg-input-wrap--correct': statuses[seg.blankIndex] === 'correct',
                'ftg-input-wrap--wrong': statuses[seg.blankIndex] === 'wrong'
              }"
            ><input
                v-model="userAnswers[seg.blankIndex]"
                :disabled="statuses[seg.blankIndex] !== null"
                :placeholder="seg.placeholder"
                class="ftg-input"
                :style="{ width: Math.max(seg.placeholder.length, 8) + 2 + 'ch' }"
                spellcheck="false"
                autocomplete="off"
              /><span v-if="statuses[seg.blankIndex] === 'correct'" class="ftg-icon">✅</span><span v-if="statuses[seg.blankIndex] === 'wrong'" class="ftg-icon">❌</span></span></template></template>
</template></code></pre>
    </div>

    <ul class="ftg-hints">
      <li v-for="(blank, index) in fillTheGap.blanks" :key="index" class="ftg-hint" :class="{
        'ftg-hint--correct': statuses[index] === 'correct',
        'ftg-hint--wrong': statuses[index] === 'wrong'
      }">
        <span class="ftg-hint__label">{{ index + 1 }}</span>
        <span class="ftg-hint__text">{{ blank.hint }}</span>
        <Transition name="fade">
          <span v-if="statuses[index] === 'wrong' && showCorrection" class="ftg-hint__answer">
            → <code class="inline-code">{{ blank.answer }}</code>
          </span>
        </Transition>
      </li>
    </ul>

    <div class="ftg-actions" v-if="!allAnswered">
      <button @click="validate" :disabled="!allFilled" class="btn btn--primary">
        ✅ Valider
      </button>
    </div>

    <Transition name="fade">
      <div v-if="allAnswered" class="ftg-score">
        <p class="ftg-score__text">
          Score : <strong>{{ score }} / {{ fillTheGap.blanks.length }}</strong>
        </p>
        <button @click="reset" class="btn btn--ghost btn-sm">
          🔄 Recommencer
        </button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.sheet-section--ftg {
  border-left: 4px solid #0ea5e9;
}

.ftg-code-wrap {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.ftg-pre {
  margin: 0;
  padding: var(--space-lg);
  background-color: #f5f2f0;
  overflow-x: auto;
  font-size: var(--font-size-sm);
  line-height: 2;
}

.ftg-guideline {
  margin-bottom: var(--space-lg);
  color: var(--color-text-soft);
  font-size: var(--font-size-sm);
}

.ftg-code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  white-space: pre;
  display: block;
}

.ftg-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  vertical-align: middle;
}

.ftg-input {
  display: inline-block;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: var(--font-size-sm);
  padding: 2px var(--space-sm);
  border: 2px dashed var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: #e5edff;
  color: var(--color-text-main);
  outline: none;
  transition: border-color 0.15s, background-color 0.15s;
  vertical-align: middle;
  min-width: 6ch;
}

.ftg-input:focus {
  border-style: solid;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.ftg-input:disabled {
  cursor: default;
  opacity: 1;
}

.ftg-input-wrap--correct .ftg-input {
  border: 2px solid #22c55e;
  background-color: #f0fdf4;
  color: #15803d;
}

.ftg-input-wrap--wrong .ftg-input {
  border: 2px solid #ef4444;
  background-color: #fef2f2;
  color: #b91c1c;
}

.ftg-icon {
  font-size: 0.85rem;
}

.ftg-hints {
  list-style: none;
  padding: 0;
  margin: var(--space-xl) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ftg-hint {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-alt);
  border: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  transition: border-color 0.15s, background-color 0.15s;
}

.ftg-hint--correct {
  border-color: #22c55e;
  background-color: #f0fdf4;
}

.ftg-hint--wrong {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.ftg-hint__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 700;
  flex-shrink: 0;
}

.ftg-hint__text {
  flex: 1;
  color: var(--color-text-soft);
}

.ftg-hint__answer {
  color: #b91c1c;
  font-size: var(--font-size-xs);
}

.ftg-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-lg);
}

.ftg-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  margin-top: var(--space-xl);
  background-color: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.ftg-score__text {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-soft);
}

.ftg-score__text strong {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
