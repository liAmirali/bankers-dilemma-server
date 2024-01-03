import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";

import { REST_API_PORT } from "../vars/env-variables";
import { default as rootRouter } from "./routes";

export const startRestAPIServer = () => {
  const PORT = REST_API_PORT;

  const app = express();
  const server = createServer(app);

  app.use(bodyParser.json())

  app.use("/api/v1/", rootRouter);

  server.listen(PORT, () => {
    console.log(`Rest API app started on port ${PORT}.`);
  });
};
