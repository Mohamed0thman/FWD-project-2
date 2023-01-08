import { Pool } from "pg";
import config from "../config";
const dbMap: Record<string, string> = {
  test: "TEST_",
  dev: "DEV_",
};
const prefix = dbMap[config.NODE_ENV as string];

const db = new Pool({
  host: config.env(`${prefix}DATABASE_HOST`),
  user: config.env(`${prefix}DATABASE_USER`),
  password: config.env(`${prefix}DATABASE_PASSWORD`),
  database: config.env(`${prefix}DATABASE_NAME`),
  port: parseInt(config.env(`${prefix}DATABASE_PORT`), 10),
});

export default db;
