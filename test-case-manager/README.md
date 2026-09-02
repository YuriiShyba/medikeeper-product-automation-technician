# Automated Test Case Manager

A small Vue 3 and TypeScript application demonstrating CRUD management of automated test case records.

Required fields are Test Name, Script Path, Priority, and Created By. Users can create and view records, update Priority immediately, and delete a record after confirmation. Script Path must be unique after trimming; an exact duplicate is rejected with a clear validation message. Created By is an additional demo field and does not represent verified identity.

Records persist in `localStorage`. This was selected intentionally so the demo remains self-contained and can later be deployed as a static application. The storage service can be replaced by an API or database-backed implementation if the application is expanded.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```
