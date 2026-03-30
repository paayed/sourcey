import { defineConfig } from "sourcey";

export default defineConfig({
  navigation: {
    tabs: [
      {
        tab: "API Reference",
        openapi: "./api.yaml",
      },
    ],
  },
});