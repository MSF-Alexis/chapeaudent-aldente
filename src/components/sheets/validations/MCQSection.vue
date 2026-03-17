<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { extractCodeBlocks } from '@/helpers/courseDisplayHelper'

const props = defineProps({
  mcq: {
    type: Array,
    required: true
  }
})

const answers = ref(props.mcq.map(() => null))
const explanationRefs = ref([])

const selectAnswer = (questionIndex, optionIndex) => {
  if (answers.value[questionIndex] !== null) return
  answers.value[questionIndex] = optionIndex
}

const getOptionStatus = (questionIndex, optionIndex) => {
  const answered = answers.value[questionIndex]
  if (answered === null) return 'default'
  const correctIndex = props.mcq[questionIndex].answerIndex
  if (optionIndex === correctIndex) return 'correct'
  if (optionIndex === answered && answered !== correctIndex) return 'wrong'
  return 'default'
}


const parsedExplanations = computed(() => {
  return props.mcq.map(q => extractCodeBlocks(q.explanation))
})


const injectExplanationCodes = async (qIndex) => {
  await nextTick()
  const el = explanationRefs.value[qIndex]
  if (!el) return

  const codeBlocks = parsedExplanations.value[qIndex]?.codeBlocks
  if (!codeBlocks?.length) return

  const placeholders = el.querySelectorAll('[data-code-block]')
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


watch(answers, (newAnswers) => {
  newAnswers.forEach((answer, qIndex) => {
    if (answer !== null) {
      injectExplanationCodes(qIndex)
    }
  })
}, { deep: true })

const score = computed(() => {
  return answers.value.filter(
    (answer, i) => answer === props.mcq[i].answerIndex
  ).length
})

const allAnswered = computed(() => {
  return answers.value.every(a => a !== null)
})

const reset = () => {
  answers.value = props.mcq.map(() => null)
}
</script>

<template>
  <section class="sheet-section sheet-section--mcq">
    <h2 class="section-title">🧠 QCM</h2>

    <div class="mcq-list">
      <div v-for="(question, qIndex) in mcq" :key="qIndex" class="mcq-question">
        <p class="mcq-question__text">
          <span class="mcq-question__number">{{ qIndex + 1 }}.</span>
          {{ question.question }}
        </p>

        <ul class="mcq-options">
          <li v-for="(option, oIndex) in question.options" :key="oIndex" class="mcq-option"
            :class="`mcq-option--${getOptionStatus(qIndex, oIndex)}`" @click="selectAnswer(qIndex, oIndex)">
            <span class="mcq-option__letter">{{ ['A', 'B', 'C', 'D'][oIndex] }}</span>
            <span class="mcq-option__text">{{ option.text }}</span>
            <span v-if="getOptionStatus(qIndex, oIndex) === 'correct'" class="mcq-option__icon">✅</span>
            <span v-if="getOptionStatus(qIndex, oIndex) === 'wrong'" class="mcq-option__icon">❌</span>
          </li>
        </ul>

        <Transition name="fade">
          <div v-if="answers[qIndex] !== null" class="mcq-explanation"
            :class="answers[qIndex] === question.answerIndex ? 'mcq-explanation--correct' : 'mcq-explanation--wrong'">
            
            <p :ref="el => explanationRefs[qIndex] = el" v-html="'💬 ' + parsedExplanations[qIndex].processedHtml"
              class="mcq-explanation__text"></p>
          </div>
        </Transition>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="allAnswered" class="mcq-score">
        <p class="mcq-score__text">
          Score : <strong>{{ score }} / {{ mcq.length }}</strong>
        </p>
        <button @click="reset" class="btn btn--ghost btn-sm">
          🔄 Recommencer
        </button>
      </div>
    </Transition>
  </section>
</template>


<style scoped>
.sheet-section--mcq {
  border-left: 4px solid #8b5cf6;
}

.mcq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.mcq-question__text {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-main);
  margin: 0 0 var(--space-md);
  line-height: 1.5;
}

.mcq-question__number {
  color: var(--color-primary);
  margin-right: var(--space-xs);
}

.mcq-options {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.mcq-option {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-alt);
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
}

.mcq-option--default:hover {
  border-color: var(--color-primary);
  background-color: #e5edff;
  transform: translateX(4px);
}

.mcq-option--correct {
  border-color: #22c55e;
  background-color: #f0fdf4;
  cursor: default;
}

.mcq-option--wrong {
  border-color: #ef4444;
  background-color: #fef2f2;
  cursor: default;
}

.mcq-question:has(.mcq-option--correct) .mcq-option--default,
.mcq-question:has(.mcq-option--wrong) .mcq-option--default {
  opacity: 0.5;
  cursor: default;
}

.mcq-option__letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-soft);
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-soft);
  flex-shrink: 0;
}

.mcq-option--correct .mcq-option__letter {
  background-color: #22c55e;
  border-color: #22c55e;
  color: white;
}

.mcq-option--wrong .mcq-option__letter {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

.mcq-option__text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-soft);
  line-height: 1.4;
}

.mcq-option--correct .mcq-option__text {
  color: #15803d;
  font-weight: 500;
}

.mcq-option--wrong .mcq-option__text {
  color: #b91c1c;
}

.mcq-option__icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.mcq-explanation {
  margin-top: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid transparent;
}

.mcq-explanation--correct {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
}

.mcq-explanation--wrong {
  background-color: #fef2f2;
  border-color: #fecaca;
}

.mcq-explanation__text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-soft);
  line-height: 1.6;
}

.mcq-score {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  margin-top: var(--space-xl);
  background-color: var(--color-bg-alt);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.mcq-score__text {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-soft);
}

.mcq-score__text strong {
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
  transform: translateY(-6px);
}
</style>
