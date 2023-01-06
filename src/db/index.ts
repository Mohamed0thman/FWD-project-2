import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: parseInt(config.dbPort as string, 10),
  max: 4,
});

pool.on("error", (error: Error) => {
  console.log(error);
});

export default pool;
