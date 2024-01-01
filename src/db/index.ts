import { Pool } from "pg";
import { PSQL_DB_HOST, PSQL_DB_PASS, PSQL_DB_PORT, PSQL_DB_USER } from "../../vars/env-variables";

export const postgres = new Pool({
  database: "bankers_dilemma",
  user: PSQL_DB_USER,
  password: PSQL_DB_PASS,
  host: PSQL_DB_HOST,
  port: PSQL_DB_PORT,
});
