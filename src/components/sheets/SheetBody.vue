<script setup lang="ts">
import { computed, ref, onMounted, watch, nextTick } from 'vue'
import type { Sheet } from '@/types/Sheet'
import { extractCodeBlocks } from '@/helpers/courseDisplayHelper'
import McqSection from '@/components/sheets/validations/MCQ.vue'
import CheckPoint from '@/components/sheets/validations/CheckPoint.vue'
import SheetExamples from '@/components/sheets/SheetExamples.vue'
import FillTheGap from '@/components/sheets/validations/FillTheGap.vue'
import SpotTheBug from '@/components/sheets/validations/SpotTheBug.vue'

const props = defineProps<{
  sheet: Sheet
}>()

const theoryRef = ref<HTMLElement | null>(null)

const theoryData = computed(() => {
  if (!props.sheet.theory) return null
  return extractCodeBlocks(props.sheet.theory)
})

const renderTheory = async () => {
  await nextTick()
  injectCodeBlocks()
  const prism = (window as Window & { Prism?: { highlightAll: () => void } }).Prism
  if (prism) prism.highlightAll()
}

const injectCodeBlocks = () => {
  if (!theoryRef.value || !theoryData.value) return

  const placeholders = theoryRef.value.querySelectorAll('[data-code-block]')
  placeholders.forEach((placeholder) => {
    const blockId = parseInt((placeholder as HTMLElement).dataset.codeBlock ?? '')
    const codeBlock = theoryData.value!.codeBlocks[blockId]
    if (codeBlock) {
      const codeEl = document.createElement('code')
      codeEl.className = 'inline-code'
      codeEl.textContent = codeBlock.content
      placeholder.replaceWith(codeEl)
    }
  })
}

onMounted(renderTheory)
watch(() => props.sheet, renderTheory, { deep: true })
</script>

<template>
  <div class="sheet-body">

    <section v-if="sheet.why" class="sheet-section sheet-section--why">
      <h2 class="section-title">💡 Pourquoi ?</h2>
      <div v-html="sheet.why" class="section-content"></div>
    </section>


    <section v-if="theoryData" class="sheet-section sheet-section--theory">
      <h2 class="section-title">📚 Théorie</h2>
      <div ref="theoryRef" v-html="theoryData.processedHtml" class="section-content"></div>
    </section>
    <section v-if="sheet.sources" class="sheet-section sheet-section--sources">
      <h2 class="section-title">🧾 Sources</h2>
      <div v-html="sheet.sources" class="section-content section-content--sources"></div>
    </section>
    <SheetExamples v-if="sheet.examples" :examples="sheet.examples" />
    <McqSection v-if="sheet.validation?.mcq?.length" :mcq="sheet.validation.mcq" />
    <CheckPoint v-if="sheet.validation?.checkpoint" :checkpoint="sheet.validation.checkpoint" />
    <FillTheGap v-if="sheet.validation?.fillTheGap" :fill-the-gap="sheet.validation.fillTheGap" />
    <SpotTheBug v-if="sheet.validation?.spotTheBug" :spot-the-bug="sheet.validation.spotTheBug" />
  </div>
</template>

<style scoped>
.sheet-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  font-weight: 500;
}

.sheet-body :deep(a:hover) {
  color: var(--color-primary-strong, #1d4ed8);
}

.section-content--sources :deep(a) {
  color: var(--color-primary);
}

.section-content--sources :deep(a:hover) {
  color: var(--color-primary-strong, #1d4ed8);
}
</style>