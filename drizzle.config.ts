import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  tablesFilter: ["tutoring-app_*"],
} satisfies Config;