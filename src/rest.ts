import express from "express";
import { createServer } from "http";
import { REST_API_PORT } from "../vars/env-variables";

export const startRestAPIServer = () => {
  const PORT = REST_API_PORT;

  const app = express();
  const server = createServer(app);

  server.listen(PORT, () => {
    console.log(`Rest API app started on port ${PORT}.`);
  });
};
