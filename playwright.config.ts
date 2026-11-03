import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:8766",
    viewport: { width: 1280, height: 600 },
    // Headless Chromium otherwise hides the space-consuming scrollbars used on Windows.
    launchOptions: { ignoreDefaultArgs: ["--hide-scrollbars"] },
  },
  webServer: {
    command: "python3 -m http.server 8766 --bind 127.0.0.1",
    url: "http://127.0.0.1:8766/appneoLocalTest/",
  },
});
