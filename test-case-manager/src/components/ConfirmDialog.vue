<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

defineProps<{
  itemName: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const dialog = ref<HTMLElement | null>(null)
const cancelButton = ref<HTMLButtonElement | null>(null)

function cancel(): void {
  emit('cancel')
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    cancel()
  }
}

function keepFocusInDialog(event: KeyboardEvent): void {
  if (event.key !== 'Tab' || !dialog.value) {
    return
  }

  const focusableElements = Array.from(
    dialog.value.querySelectorAll<HTMLButtonElement>('button:not([disabled])'),
  )

  if (!focusableElements.length) {
    return
  }

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

onMounted(async () => {
  document.addEventListener('keydown', handleDocumentKeydown)
  await nextTick()
  cancelButton.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleDocumentKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="dialog-backdrop">
      <section
        ref="dialog"
        class="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        @keydown="keepFocusInDialog"
      >
        <div class="confirm-dialog-icon" aria-hidden="true">!</div>
        <div class="confirm-dialog-copy">
          <h2 id="confirm-dialog-title">Delete test case?</h2>
          <p id="confirm-dialog-description">
            Are you sure you want to delete
            <strong>“{{ itemName }}”</strong>? This action cannot be undone.
          </p>
        </div>

        <div class="confirm-dialog-actions">
          <button
            ref="cancelButton"
            class="button button-secondary"
            type="button"
            @click="cancel"
          >
            Cancel
          </button>
          <button class="button button-danger-solid" type="button" @click="emit('confirm')">
            Delete
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
