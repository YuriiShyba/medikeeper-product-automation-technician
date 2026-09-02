<script setup lang="ts">
import { nextTick, ref } from 'vue'

import ConfirmDialog from './ConfirmDialog.vue'
import { priorities, type Priority, type TestCase } from '../types/test-case'

defineProps<{
  testCases: TestCase[]
}>()

const emit = defineEmits<{
  updatePriority: [id: string, priority: Priority]
  delete: [id: string]
}>()

const pendingDelete = ref<TestCase | null>(null)
const deleteTrigger = ref<HTMLButtonElement | null>(null)
const tableTitle = ref<HTMLHeadingElement | null>(null)

function priorityClass(priority: Priority): string {
  return `priority-${priority.toLowerCase()}`
}

function handlePriorityChange(id: string, event: Event): void {
  const target = event.target as HTMLSelectElement
  emit('updatePriority', id, target.value as Priority)
}

function requestDelete(testCase: TestCase, event: MouseEvent): void {
  deleteTrigger.value = event.currentTarget as HTMLButtonElement
  pendingDelete.value = testCase
}

async function cancelDelete(): Promise<void> {
  pendingDelete.value = null
  await nextTick()
  deleteTrigger.value?.focus()
  deleteTrigger.value = null
}

async function confirmDelete(): Promise<void> {
  if (!pendingDelete.value) {
    return
  }

  const id = pendingDelete.value.id
  pendingDelete.value = null
  deleteTrigger.value = null
  emit('delete', id)
  await nextTick()
  tableTitle.value?.focus()
}
</script>

<template>
  <section class="card table-card" aria-labelledby="test-cases-title">
    <div class="section-heading table-heading">
      <div>
        <p class="eyebrow">Saved records</p>
        <h2 id="test-cases-title" ref="tableTitle" tabindex="-1">Test Cases</h2>
      </div>
      <span class="record-count" aria-live="polite">
        {{ testCases.length }} {{ testCases.length === 1 ? 'record' : 'records' }}
      </span>
    </div>

    <div v-if="testCases.length" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Test Name</th>
            <th scope="col">Script Path</th>
            <th scope="col">Priority</th>
            <th scope="col">Created By</th>
            <th scope="col" class="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="testCase in testCases" :key="testCase.id">
            <td data-label="Test Name">
              <span class="test-name">{{ testCase.testName }}</span>
            </td>
            <td data-label="Script Path">
              <code class="script-path">{{ testCase.scriptPath }}</code>
            </td>
            <td data-label="Priority">
              <label class="sr-only" :for="`priority-${testCase.id}`">
                Priority for {{ testCase.testName }}
              </label>
              <span class="priority-control" :class="priorityClass(testCase.priority)">
                <span class="priority-dot" aria-hidden="true"></span>
                <select
                  :id="`priority-${testCase.id}`"
                  :value="testCase.priority"
                  @change="handlePriorityChange(testCase.id, $event)"
                >
                  <option v-for="priority in priorities" :key="priority" :value="priority">
                    {{ priority }}
                  </option>
                </select>
              </span>
            </td>
            <td data-label="Created By">{{ testCase.createdBy }}</td>
            <td data-label="Actions" class="actions-cell">
              <button
                class="button button-danger"
                type="button"
                :aria-label="`Delete ${testCase.testName}`"
                @click="requestDelete(testCase, $event)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <div class="empty-state-mark" aria-hidden="true">TC</div>
      <h3>No test cases yet</h3>
      <p>Create the first automation record using the form above.</p>
    </div>

    <ConfirmDialog
      v-if="pendingDelete"
      :item-name="pendingDelete.testName"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </section>
</template>
