import dotnv from "dotenv";

dotnv.config();
const { NODE_ENV, SECRET_BCYPT_KEY, SALT_ROUNDS, SECRET_Token_kEY, PORT } =
  process.env;

function env(key: string, defaultValue = ""): string {
  return process.env[key] ?? (defaultValue as string);
}

export default {
  env,
  PORT,
  NODE_ENV,
  pepperKey: SECRET_BCYPT_KEY,
  salt: SALT_ROUNDS,
  tokenSecretKey: SECRET_Token_kEY,
};
