import { config } from "dotenv";

config();

export const REST_API_PORT = process.env.REST_API_PORT;
export const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT;
