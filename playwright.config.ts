import { defineConfig } from "@playwright/test";

export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: 'tests',

  // Run all tests in parallel.
  fullyParallel: false,

  // Opt out of parallel tests on CI.
  workers: 1,
});
