<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'
import { extractCodeBlocks } from '@/helpers/courseDisplayHelper'
import InlineCode from '@/components/InlineCode.vue'
import McqSection from '@/components/sheets/validations/MCQSection.vue'
import Checkpoint from '@/components/sheets/validations/Checkpoint.vue'
import SheetExamples from '@/components/sheets/SheetExamples.vue'

const props = defineProps({
  sheet: {
    type: Object,
    required: true
  }
})

// Process theory content
const theoryData = computed(() => {
  if (!props.sheet.theory) return null
  return extractCodeBlocks(props.sheet.theory)
})

const theoryRef = ref(null)

// Inject CodeBlock components after DOM update
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
      // Créer le code inline
      const codeEl = document.createElement('code')
      codeEl.className = 'inline-code'
      codeEl.textContent = codeBlock.content

      // Remplacer le placeholder
      placeholder.replaceWith(codeEl)
    }
  })
}
</script>

<template>
  <div class="sheet-body">
    <!-- WHY Section -->
    <section v-if="sheet.why" class="sheet-section sheet-section--why">
      <h2 class="section-title">💡 Pourquoi ?</h2>
      <div v-html="sheet.why" class="section-content"></div>
    </section>

    <!-- THEORY Section -->
    <section v-if="theoryData" class="sheet-section sheet-section--theory">
      <h2 class="section-title">📚 Théorie</h2>
      <div ref="theoryRef" v-html="theoryData.processedHtml" class="section-content"></div>
    </section>
    <SheetExamples v-if="sheet.examples" :examples="sheet.examples" />
    <McqSection v-if="sheet.validation?.mcq?.length" :mcq="sheet.validation.mcq" />
     <Checkpoint
      v-if="sheet.validation?.checkpoint"
      :checkpoint="sheet.validation.checkpoint"
    />
  </div>
</template>
