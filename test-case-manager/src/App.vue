<script setup lang="ts">
import { onMounted, ref } from 'vue'

import TestCaseForm from './components/TestCaseForm.vue'
import TestCaseTable from './components/TestCaseTable.vue'
import {
  createTestCase,
  deleteTestCase,
  loadTestCases,
  updateTestCasePriority,
} from './services/test-case-storage'
import type { NewTestCase, Priority, TestCase } from './types/test-case'

const testCases = ref<TestCase[]>([])
const duplicateError = ref('')
const storageError = ref('')
const successMessage = ref('')
const formResetKey = ref(0)

onMounted(() => {
  testCases.value = loadTestCases()
})

function clearMessages(): void {
  storageError.value = ''
  successMessage.value = ''
}

function handleCreate(input: NewTestCase): void {
  clearMessages()

  try {
    const result = createTestCase(testCases.value, input)

    if (!result.ok) {
      duplicateError.value = result.message
      return
    }

    duplicateError.value = ''
    testCases.value = result.records
    successMessage.value = `“${result.created.testName}” was added.`
    formResetKey.value += 1
  } catch (error) {
    storageError.value =
      error instanceof Error ? error.message : 'The test case could not be saved.'
  }
}

function handlePriorityUpdate(id: string, priority: Priority): void {
  clearMessages()

  try {
    testCases.value = updateTestCasePriority(testCases.value, id, priority)
    successMessage.value = 'Priority updated.'
  } catch (error) {
    storageError.value =
      error instanceof Error ? error.message : 'The priority could not be updated.'
  }
}

function handleDelete(id: string): void {
  clearMessages()

  try {
    testCases.value = deleteTestCase(testCases.value, id)
    successMessage.value = 'Test case deleted.'
  } catch (error) {
    storageError.value =
      error instanceof Error ? error.message : 'The test case could not be deleted.'
  }
}
</script>

<template>
  <div class="app-shell">
    <header class="page-header">
      <div class="header-content">
        <div class="product-mark" aria-hidden="true">QA</div>
        <div>
          <p class="header-kicker">Automation workspace</p>
          <h1>Automated Test Case Manager</h1>
          <p class="header-subtitle">
            Create and maintain a focused inventory of automated test cases.
          </p>
        </div>
      </div>
      <div class="header-stat" aria-label="Saved test case count">
        <strong>{{ testCases.length }}</strong>
        <span>Saved {{ testCases.length === 1 ? 'case' : 'cases' }}</span>
      </div>
    </header>

    <main class="main-content">
      <div class="status-region" aria-live="polite" aria-atomic="true">
        <p v-if="successMessage" class="notice notice-success" role="status">
          {{ successMessage }}
        </p>
        <p v-if="storageError" class="notice notice-error" role="alert">
          {{ storageError }}
        </p>
      </div>

      <TestCaseForm
        :duplicate-error="duplicateError"
        :reset-key="formResetKey"
        @submit="handleCreate"
        @clear-duplicate-error="duplicateError = ''"
      />

      <TestCaseTable
        :test-cases="testCases"
        @update-priority="handlePriorityUpdate"
        @delete="handleDelete"
      />
    </main>

    <footer class="page-footer">
      Records are stored locally in this browser for this self-contained demo.
    </footer>
  </div>
</template>
