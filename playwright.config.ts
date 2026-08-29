import { defineConfig } from '@playwright/test'

const liveBaseURL = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  use: { baseURL: liveBaseURL ?? 'http://127.0.0.1:4174', browserName: 'chromium' },
  webServer: liveBaseURL ? undefined : { command: 'npm run preview -- --host 127.0.0.1 --port 4174', port: 4174, reuseExistingServer: true }
})
