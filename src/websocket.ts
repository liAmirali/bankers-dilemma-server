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

  const gamePlayers: Record<string, string[]> = {};

  io.on("connection", async (socket) => {
    const allConnectedSockets = await io.fetchSockets();
    const socketIds = allConnectedSockets.map((s) => s.id);

    console.log("A user connected.", socket.id);

    console.log("All sockets:", socketIds);
    console.log("*BEFORE* gamePlayers", gamePlayers);

    // Handler running before ALL events
    socket.onAny(async () => {
      console.log("HERE CLEANING UP");
      /**
       * Removing any disconnected user form the game rooms
       * */
      const allGameRooms = Object.keys(gamePlayers);
      allGameRooms.forEach((gameRoom) => {
        if (!gamePlayers[gameRoom]) return;

        gamePlayers[gameRoom] = gamePlayers[gameRoom].filter((playerSID) =>
          socketIds.includes(playerSID)
        );
      });
    });

    socket.on("join_game", (data: JoinGameDataT) => {
      console.log("JOIN game_id:", data.gameId, "sid:", socket.id);

      // Adding the player sid to the game monitor
      if (!gamePlayers[data.gameId]) gamePlayers[data.gameId] = [];
      gamePlayers[data.gameId].push(socket.id);

      // Socket joins the room
      socket.join(data.gameId.toString());
      socket.send("JOINED");

      console.log("gamePlayers", gamePlayers);
    });

    socket.on("leave_game", (data: LeaveGameDataT) => {
      console.log("**LEAVE game_id:", data.gameId, "sid:", socket.id);

      // Removing the player sid to the game monitor
      if (gamePlayers[data.gameId])
        gamePlayers[data.gameId] = gamePlayers[data.gameId].filter(
          (player) => player !== socket.id
        );

      // Socket leaves the room
      socket.leave(data.gameId.toString());
      socket.send("LEFT");

      console.log("gamePlayers", gamePlayers);
    });

    socket.on("play", (data: PlayDataT) => {
      console.log(socket.id, " PLAYED:", data);
      socket.to(data.gameId.toString()).emit(data.move);
    });

    console.log("*After* All sockets:", socketIds);
  });

  server.listen(PORT, () => {
    console.log(`Web Socket app started on port ${PORT}.`);
  });
};
