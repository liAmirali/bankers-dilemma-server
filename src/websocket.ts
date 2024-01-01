import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { WEB_SOCKET_PORT } from "../vars/env-variables";
import { trustedOrigins } from "../vars/constants";

export const startWebSocketServer = () => {
  const PORT = WEB_SOCKET_PORT;

  if (!PORT) {
    console.error("Didn't find port number. Web Socket app didn't start.");
    return;
  }

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [...trustedOrigins],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected.", socket.id);

    socket.send("Hello!");
  });

  server.listen(PORT, () => {
    console.log(`Web Socket app started on port ${PORT}.`);
  });
};
