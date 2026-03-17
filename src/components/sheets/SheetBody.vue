<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { extractCodeBlocks } from '@/helpers/courseDisplayHelper'
import McqSection from '@/components/sheets/validations/MCQ.vue'
import Checkpoint from '@/components/sheets/validations/Checkpoint.vue'
import SheetExamples from '@/components/sheets/SheetExamples.vue'
import FillTheGap from '@/components/sheets/validations/FillTheGap.vue'
import SpotTheBug from '@/components/sheets/validations/SpotTheBug.vue'


const props = defineProps({
  sheet: {
    type: Object,
    required: true
  }
})


const theoryData = computed(() => {
  if (!props.sheet.theory) return null
  return extractCodeBlocks(props.sheet.theory)
})

const theoryRef = ref(null)


onMounted(async () => {
  await nextTick()
  injectCodeBlocks()
})

const injectCodeBlocks = () => {
  if (!theoryRef.value || !theoryData.value) return

  const placeholders = theoryRef.value.querySelectorAll('[data-code-block]')

  placeholders.forEach((placeholder) => {
    const blockId = parseInt(placeholder.dataset.codeBlock)
    const codeBlock = theoryData.value.codeBlocks[blockId]

    if (codeBlock) {

      const codeEl = document.createElement('code')
      codeEl.className = 'inline-code'
      codeEl.textContent = codeBlock.content


      placeholder.replaceWith(codeEl)
    }
  })
}
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
    <Checkpoint v-if="sheet.validation?.checkpoint" :checkpoint="sheet.validation.checkpoint" />
    <FillTheGap v-if="sheet.validation?.fillTheGap" :fill-the-gap="sheet.validation.fillTheGap" />
    <SpotTheBug v-if="sheet.validation?.spotTheBug" :spot-the-bug="sheet.validation.spotTheBug" />
  </div>
</template>

<style scoped>
/* Style générique pour tous les liens dans une fiche */
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

/* Variante spécifique pour la section Sources (si tu veux la garder) */
.section-content--sources :deep(a) {
  color: var(--color-primary);
}

.section-content--sources :deep(a:hover) {
  color: var(--color-primary-strong, #1d4ed8);
}

</style>