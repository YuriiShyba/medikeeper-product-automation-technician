<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue'

import { priorities, type NewTestCase, type Priority } from '../types/test-case'

const props = defineProps<{
  duplicateError: string
  resetKey: number
}>()

const emit = defineEmits<{
  submit: [testCase: NewTestCase]
  clearDuplicateError: []
}>()

interface FormState {
  testName: string
  scriptPath: string
  priority: Priority | ''
  createdBy: string
}

type TextField = 'testName' | 'scriptPath' | 'createdBy'

const initialState = (): FormState => ({
  testName: '',
  scriptPath: '',
  priority: '',
  createdBy: '',
})

const form = reactive<FormState>(initialState())
const errors = reactive<Record<keyof FormState, string>>({
  testName: '',
  scriptPath: '',
  priority: '',
  createdBy: '',
})
const testNameInput = ref<HTMLInputElement | null>(null)

function clearFieldError(field: keyof FormState): void {
  errors[field] = ''

  if (field === 'scriptPath') {
    emit('clearDuplicateError')
  }
}

function validate(): boolean {
  errors.testName = form.testName.trim() ? '' : 'Test Name is required.'
  errors.scriptPath = form.scriptPath.trim() ? '' : 'Script Path is required.'
  errors.priority = form.priority ? '' : 'Priority is required.'
  errors.createdBy = form.createdBy.trim() ? '' : 'Created By is required.'

  return Object.values(errors).every((message) => !message)
}

function submitForm(): void {
  emit('clearDuplicateError')

  if (!validate() || !form.priority) {
    return
  }

  emit('submit', {
    testName: form.testName.trim(),
    scriptPath: form.scriptPath.trim(),
    priority: form.priority,
    createdBy: form.createdBy.trim(),
  })
}

function handleTextInput(field: TextField): void {
  clearFieldError(field)
}

watch(
  () => props.resetKey,
  async () => {
    Object.assign(form, initialState())
    Object.keys(errors).forEach((field) => {
      errors[field as keyof FormState] = ''
    })
    await nextTick()
    testNameInput.value?.focus()
  },
)
</script>

<template>
  <section class="card form-card" aria-labelledby="create-test-case-title">
    <div class="section-heading">
      <div>
        <p class="eyebrow">New record</p>
        <h2 id="create-test-case-title">Create Test Case</h2>
      </div>
      <p>Required fields are marked with an asterisk.</p>
    </div>

    <form class="test-case-form" novalidate @submit.prevent="submitForm">
      <div class="field-group">
        <label for="test-name">Test Name <span aria-hidden="true">*</span></label>
        <input
          id="test-name"
          ref="testNameInput"
          v-model="form.testName"
          type="text"
          placeholder="e.g. Rejects duplicate script path"
          autocomplete="off"
          :aria-invalid="Boolean(errors.testName)"
          :aria-describedby="errors.testName ? 'test-name-error' : undefined"
          @input="handleTextInput('testName')"
        />
        <p v-if="errors.testName" id="test-name-error" class="field-error" role="alert">
          {{ errors.testName }}
        </p>
      </div>

      <div class="field-group path-field">
        <label for="script-path">Script Path <span aria-hidden="true">*</span></label>
        <input
          id="script-path"
          v-model="form.scriptPath"
          type="text"
          placeholder="e.g. cypress/e2e/registration/registration.spec.ts"
          autocomplete="off"
          :aria-invalid="Boolean(errors.scriptPath || duplicateError)"
          :aria-describedby="
            errors.scriptPath
              ? 'script-path-error'
              : duplicateError
                ? 'script-path-duplicate-error'
                : undefined
          "
          @input="handleTextInput('scriptPath')"
        />
        <p v-if="errors.scriptPath" id="script-path-error" class="field-error" role="alert">
          {{ errors.scriptPath }}
        </p>
        <p
          v-else-if="duplicateError"
          id="script-path-duplicate-error"
          class="field-error"
          role="alert"
        >
          {{ duplicateError }}
        </p>
      </div>

      <div class="field-group">
        <label for="priority">Priority <span aria-hidden="true">*</span></label>
        <select
          id="priority"
          v-model="form.priority"
          :aria-invalid="Boolean(errors.priority)"
          :aria-describedby="errors.priority ? 'priority-error' : undefined"
          @change="clearFieldError('priority')"
        >
          <option value="" disabled>Select priority</option>
          <option v-for="priority in priorities" :key="priority" :value="priority">
            {{ priority }}
          </option>
        </select>
        <p v-if="errors.priority" id="priority-error" class="field-error" role="alert">
          {{ errors.priority }}
        </p>
      </div>

      <div class="field-group">
        <label for="created-by">Created By <span aria-hidden="true">*</span></label>
        <input
          id="created-by"
          v-model="form.createdBy"
          type="text"
          placeholder="e.g. QA Engineer"
          autocomplete="name"
          :aria-invalid="Boolean(errors.createdBy)"
          :aria-describedby="errors.createdBy ? 'created-by-error' : undefined"
          @input="handleTextInput('createdBy')"
        />
        <p v-if="errors.createdBy" id="created-by-error" class="field-error" role="alert">
          {{ errors.createdBy }}
        </p>
      </div>

      <div class="form-actions">
        <button class="button button-primary" type="submit">
          <span aria-hidden="true">＋</span>
          Add Test Case
        </button>
      </div>
    </form>
  </section>
</template>
