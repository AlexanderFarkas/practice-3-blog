import { defineConfig, Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

export default defineConfig({
  driver: PostgreSqlDriver,
  metadataProvider: TsMorphMetadataProvider,

  dbName: "postgres",
  clientUrl: "postgresql://postgres:postgres@localhost:5432",
  // folder-based discovery setup, using common filename suffix
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  // enable debug mode to log SQL queries and discovery information
  debug: true,
});
