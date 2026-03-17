<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { extractCodeBlocks } from '@/helpers/courseDisplayHelper'

const props = defineProps({
  checkpoint: {
    type: Object,
    required: true
  }
})

const userAnswer = ref('')
const isRevealed = ref(false)
const isSelfValidated = ref(null)

const hasAnswer = computed(() => userAnswer.value.trim().length > 0)


const questionData = computed(() => extractCodeBlocks(props.checkpoint.question))
const answerData = computed(() => extractCodeBlocks(props.checkpoint.answer))

const questionRef = ref(null)
const answerRef = ref(null)


const injectCodeBlocks = (containerRef, codeBlocks) => {
  if (!containerRef.value || !codeBlocks?.length) return

  const placeholders = containerRef.value.querySelectorAll('[data-code-block]')

  placeholders.forEach((placeholder) => {
    const blockId = parseInt(placeholder.dataset.codeBlock)
    const codeBlock = codeBlocks[blockId]

    if (codeBlock) {
      const codeEl = document.createElement('code')
      codeEl.className = 'inline-code'
      codeEl.textContent = codeBlock.content
      placeholder.replaceWith(codeEl)
    }
  })
}


onMounted(async () => {
  await nextTick()
  injectCodeBlocks(questionRef, questionData.value?.codeBlocks)
})


watch(isRevealed, async (val) => {
  if (val) {
    await nextTick()
    injectCodeBlocks(answerRef, answerData.value?.codeBlocks)
  }
})

const reveal = () => {
  isRevealed.value = true
}

const validate = (isCorrect) => {
  isSelfValidated.value = isCorrect
}

const reset = () => {
  userAnswer.value = ''
  isRevealed.value = false
  isSelfValidated.value = null
}
</script>

<template>
  <section class="sheet-section sheet-section--checkpoint">
    <h2 class="section-title">✍️ Checkpoint</h2>

    
    <p
      ref="questionRef"
      v-html="questionData.processedHtml"
      class="checkpoint-question section-content"
    ></p>

    
    <div class="checkpoint-input-wrap" v-if="isSelfValidated === null">
      <textarea
        v-model="userAnswer"
        class="checkpoint-textarea"
        placeholder="Rédigez votre réponse ici..."
        rows="5"
        :disabled="isRevealed"
      ></textarea>

      <div class="checkpoint-actions">
        <button
          v-if="!isRevealed"
          @click="reveal"
          :disabled="!hasAnswer"
          class="btn btn--primary"
        >
          Voir la correction
        </button>
      </div>
    </div>

    
    <Transition name="fade">
      <div v-if="isRevealed && isSelfValidated === null" class="checkpoint-correction">
        <div class="checkpoint-correction__header">
          <span class="checkpoint-correction__label">📋 Correction</span>
        </div>

        
        <div
          ref="answerRef"
          v-html="answerData.processedHtml"
          class="checkpoint-correction__content section-content"
        ></div>

        
        <div class="checkpoint-self-eval">
          <p class="checkpoint-self-eval__question">
            Est-ce que votre réponse correspond ?
          </p>
          <div class="checkpoint-self-eval__actions">
            <button @click="validate(true)" class="btn btn--validate-yes">
              ✅ Oui, j'avais bon
            </button>
            <button @click="validate(false)" class="btn btn--validate-no">
              ❌ Non, pas tout à fait
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div
        v-if="isSelfValidated !== null"
        class="checkpoint-result"
        :class="isSelfValidated ? 'checkpoint-result--success' : 'checkpoint-result--fail'"
      >
        <p v-if="isSelfValidated" class="checkpoint-result__text">
          🎉 Bravo ! Vous avez bien assimilé ce point.
        </p>
        <p v-else class="checkpoint-result__text">
          📖 Pas de problème, relisez la section théorie et réessayez !
        </p>

        <button @click="reset" class="btn btn--ghost btn-sm">
          🔄 Recommencer
        </button>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.sheet-section--checkpoint {
  border-left: 4px solid #f59e0b;
}

.checkpoint-question {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-main);
  line-height: 1.6;
  margin: 0 0 var(--space-xl);
}

.checkpoint-input-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.checkpoint-textarea {
  width: 100%;
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans);
  font-size: var(--font-size-sm);
  color: var(--color-text-main);
  background-color: var(--color-bg-alt);
  line-height: 1.7;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.checkpoint-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.checkpoint-textarea:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  background-color: var(--color-surface-variant);
}

.checkpoint-actions {
  display: flex;
  justify-content: flex-end;
}

.checkpoint-correction {
  margin-top: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.checkpoint-correction__header {
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border);
}

.checkpoint-correction__label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-soft);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkpoint-correction__content {
  padding: var(--space-lg);
  background-color: var(--color-surface);
}

.checkpoint-self-eval {
  padding: var(--space-lg);
  background-color: var(--color-bg-alt);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.checkpoint-self-eval__question {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-soft);
}

.checkpoint-self-eval__actions {
  display: flex;
  gap: var(--space-sm);
}

.btn--validate-yes {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #22c55e;
  background-color: #f0fdf4;
  color: #15803d;
  transition: all 0.15s ease;
}

.btn--validate-yes:hover {
  background-color: #22c55e;
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.btn--validate-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ef4444;
  background-color: #fef2f2;
  color: #b91c1c;
  transition: all 0.15s ease;
}

.btn--validate-no:hover {
  background-color: #ef4444;
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}

.checkpoint-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
  margin-top: var(--space-xl);
  flex-wrap: wrap;
}

.checkpoint-result--success {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.checkpoint-result--fail {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.checkpoint-result__text {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-soft);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
