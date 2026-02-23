<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  titleId: {
    type: String,
    default: 'base-modal-title',
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const dialogRef = ref(null)
let lastFocusedElement = null

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onKeydown = (event) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
  }
}

const focusFirstElement = () => {
  if (!dialogRef.value) return
  const focusable = dialogRef.value.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  if (focusable) focusable.focus()
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      lastFocusedElement = document.activeElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => focusFirstElement())
    } else {
      document.body.style.overflow = ''
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus()
      }
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="modelValue"
        class="modal-backdrop"
        role="presentation"
        @click.self="close"
      >
        <div
          ref="dialogRef"
          class="modal"
          role="dialog"
          :aria-labelledby="titleId"
          aria-modal="true"
        >
          <header class="modal__header">
            <slot name="title">
              <h2 :id="titleId" class="modal__title">
                Titre de la modal
              </h2>
            </slot>

            <button
              type="button"
              class="modal__close"
              aria-label="Fermer la fenêtre"
              @click="close"
            >
              ×
            </button>
          </header>

          <div class="modal__body">
            <slot />
          </div>

          <footer class="modal__footer">
            <slot name="footer">
              <button
                type="button"
                class="btn btn--ghost btn-sm"
                @click="close"
              >
                Fermer
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

