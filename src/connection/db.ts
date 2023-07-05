import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "~/env.mjs";

// create the connection
const connection = connect({
  // host: process.env["DATABASE_HOST"],
  // username: process.env["DATABASE_USERNAME"],
  // password: process.env["DATABASE_PASSWORD"],
  url: env.DATABASE_URL,
});

export const db = drizzle(
  connection
  // ,{ logger: true }
);
