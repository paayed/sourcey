import { defineConfig } from "sourcey";

export default defineConfig({
  name: "sourcey",
  theme: {
    preset: "default",
  },
  navigation: {
    tabs: [
      {
        tab: "Documentation",
        slug: "",
        groups: [
          {
            group: "Getting Started",
            pages: ["introduction"],
          },
        ],
      },
      {
        tab: "API Reference",
        slug: "api",
        openapi: "../api.yaml",
      },
    ],
  },
});
