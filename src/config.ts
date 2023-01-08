import dotnv from "dotenv";

dotnv.config();
const { NODE_ENV, BCRIPT_PASSWORD, SALT_ROUNDS, TOKEN_SECRET, PORT } =
  process.env;

function env(key: string, defaultValue = ""): string {
  return process.env[key] ?? (defaultValue as string);
}

export default {
  env,
  PORT,
  NODE_ENV,
  pepper: BCRIPT_PASSWORD,
  salt: SALT_ROUNDS,
  tokenSecret: TOKEN_SECRET,
};
