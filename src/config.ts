import dotnv from "dotenv";

dotnv.config();
const {
  PORT,
  NODE_ENV,
  PGUSER,
  PGHOST,
  PGDATABASETest,
  PGPORT,
  PGPASSWORD,
  PGDATABASEDev,
  BCRIPT_PASSWORD,
  SALT_ROUNDS,
  TOKEN_SECRET,
} = process.env;

export default {
  port: PORT,
  user: PGUSER,
  host: PGHOST,
  database: NODE_ENV === "DEV" ? PGDATABASEDev : PGDATABASETest,
  dbPort: PGPORT,
  password: PGPASSWORD,
  pepper: BCRIPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokenSecret: TOKEN_SECRET,
};
