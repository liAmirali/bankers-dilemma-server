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

  io.on("connection", (socket): void => {
    console.log("A user connected.", socket.id);

    socket.send("Hello!");

    io.on("join_game", (data: JoinGameDataT) => {
      socket.join(data.gameId.toString());
    });

    io.on("leave_game", (data: LeaveGameDataT) => {
      socket.leave(data.gameId.toString());
    });

    io.on("play", (data: PlayDataT) => {
      console.log(socket.id, " PLAYED:", data);
      socket.to(data.gameId.toString()).emit(data.move);
    });
  });

  server.listen(PORT, () => {
    console.log(`Web Socket app started on port ${PORT}.`);
  });
};
