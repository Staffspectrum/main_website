import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    env: {
      ADMIN_JWT_SECRET: "test_environment_secret_minimum_32_characters_for_admin_jwt",
    },
  },
});
