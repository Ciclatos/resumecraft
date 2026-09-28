import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    exclude: ["**/._*", "**/node_modules/**", "**/.git/**"],
  },
});
