import { config } from "dotenv";

config();

export const REST_API_PORT = process.env.REST_API_PORT;
export const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT;

export const PSQL_DB_USER = process.env.PG_DB_USER;
export const PSQL_DB_PASS = process.env.PG_DB_PASS;
export const PSQL_DB_HOST = process.env.PG_DB_HOST || "http://localhost";
export const PSQL_DB_PORT: number = process.env.PG_DB_PORT ? +process.env.PG_DB_PORT : 5432;
