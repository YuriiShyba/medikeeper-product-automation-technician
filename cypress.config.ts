import { defineConfig } from 'cypress'

import { registerDatabaseTasks } from './cypress/tasks/database.tasks'

export default defineConfig({
  video: false,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'https://wwwprep.medikeeper.com',
    specPattern: 'cypress/e2e/**/*.spec.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      registerDatabaseTasks(on)
      return config
    },
  },
})
