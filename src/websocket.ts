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

  const gameRooms: Record<string, GameRoomDetails> = {};

  io.on("connection", async (socket) => {
    const allConnectedSockets = await io.fetchSockets();
    const socketIds = allConnectedSockets.map((s) => s.id);

    // Handler running before ALL events
    socket.onAny(async () => {
      /**
       * Removing any disconnected user form the game rooms
       * */
      const allGameRoomIds = Object.keys(gameRooms);
      allGameRoomIds.forEach((gameRoomId) => {
        if (!gameRooms[gameRoomId]) return;

        gameRooms[gameRoomId].players = gameRooms[gameRoomId].players.filter((playerSID) =>
          socketIds.includes(playerSID)
        );
      });
    });

    socket.on("join_game", (data: JoinGameDataT) => {
      console.log("JOIN game_id:", data.gameId, "sid:", socket.id);

      // Adding the player sid to the game monitor
      if (!gameRooms[data.gameId]) gameRooms[data.gameId] = { players: [], isStarted: false };
      gameRooms[data.gameId].players.push(socket.id);

      // Socket joins the room
      socket.join(data.gameId.toString());
      socket.send("JOINED");

      console.log("gamePlayers", gameRooms);

      if (gameRooms[data.gameId].players.length === 2) {
        gameRooms[data.gameId].isStarted = true;
        io.in(data.gameId.toString()).emit("start_game");
      }
    });

    socket.on("leave_game", (data: LeaveGameDataT) => {
      console.log("**LEAVE game_id:", data.gameId, "sid:", socket.id);

      // Removing the player sid to the game monitor
      if (gameRooms[data.gameId])
        gameRooms[data.gameId].players = gameRooms[data.gameId].players.filter(
          (player) => player !== socket.id
        );

      // Socket leaves the room
      socket.leave(data.gameId.toString());
      socket.send("LEFT");

      console.log("gamePlayers", gameRooms);
    });

    socket.on("play", (data: PlayDataT) => {
      console.log(socket.id, " PLAYED:", data);
      io.in(data.gameId.toString()).emit("results", { move: data.move, sid: socket.id });
    });

    console.log("All sockets:", socketIds);
  });

  server.listen(PORT, () => {
    console.log(`Web Socket app started on port ${PORT}.`);
  });
};
