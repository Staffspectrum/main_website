import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://staffspectrum_user:placeholder@127.0.0.1:5432/staffspectrum_next?schema=public",
  },
});
