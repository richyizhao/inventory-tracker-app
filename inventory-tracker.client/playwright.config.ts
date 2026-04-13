import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

const isCi = Boolean(process.env.CI);
const frontendUrl = `${isCi ? "http" : "https"}://127.0.0.1:4173`;
const backendUrl = `${isCi ? "http" : "https"}://127.0.0.1:${isCi ? "5137" : "7227"}`;

export default defineConfig({
  testDir: "./e2e/test",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: frontendUrl,
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command: "dotnet inventory-tracker.Server.dll",
      cwd: "../.tmp-e2e-server",
      url: `${backendUrl}/swagger`,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ASPNETCORE_ENVIRONMENT: "Development",
        ASPNETCORE_URLS: backendUrl,
        DOTNET_SKIP_FIRST_TIME_EXPERIENCE: "1",
        DOTNET_CLI_HOME: "../.dotnet-cli-home",
      },
    },
    {
      command: "npm run dev -- --host 127.0.0.1 --port 4173",
      cwd: ".",
      url: frontendUrl,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        ASPNETCORE_URLS: backendUrl,
        DEV_SERVER_PORT: "4173",
      },
    },
  ],
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "teardown",
      testMatch: /.*\.teardown\.ts/,
      dependencies: ["chromium"],
    },
  ],
});
