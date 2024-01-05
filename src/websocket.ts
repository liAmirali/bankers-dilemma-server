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
    // Handler running before ALL events
    socket.onAny(async () => {
      const allConnectedSockets = await io.fetchSockets();
      const socketIds = allConnectedSockets.map((s) => s.id);
      console.log("CONN socketIds :>> ", socketIds);
      /**
       * Removing any disconnected user form the game rooms
       * */
      const allGameRoomIds = Object.keys(gameRooms);
      allGameRoomIds.forEach((gameRoomId) => {
        if (!gameRooms[gameRoomId]) return;

        gameRooms[gameRoomId].playersCount = 0;
        gameRooms[gameRoomId].players.forEach((player, player_index) => {
          if (!player) return;

          if (socketIds.includes(player.sid)) {
            gameRooms[gameRoomId].playersCount++;
          } else {
            gameRooms[gameRoomId].players[player_index] = null;
          }
        });

        // Removing the game room object if no users were connected
        if (gameRooms[gameRoomId].playersCount === 0) {
          delete gameRooms[gameRoomId];
        }
      });
    });

    socket.on("join_game", (data: JoinGameDataT) => {
      console.log("JOIN game_id:", data.gameId, "sid:", socket.id);

      // Creating the game detail object if it doesn't exist
      if (!gameRooms[data.gameId])
        gameRooms[data.gameId] = {
          players: [null, null],
          isStarted: false,
          playersCount: 0,
        };

      // Initializing the player data
      if (gameRooms[data.gameId].playersCount === 2) {
        socket.send("Game room is full.");
        return;
      }
      const playerIndex = gameRooms[data.gameId].players[0] === null ? 0 : 1;
      gameRooms[data.gameId].players[playerIndex] = {
        sid: socket.id,
        score: 0,
        latestMove: null,
      };
      gameRooms[data.gameId].playersCount++;

      // Player joins the room
      socket.join(data.gameId.toString());
      socket.send("JOINED");

      console.log("gamePlayers", gameRooms);

      if (gameRooms[data.gameId].playersCount === 2) {
        gameRooms[data.gameId].isStarted = true;
        io.in(data.gameId.toString()).emit("start_game", gameRooms[data.gameId]);
      }
    });

    socket.on("leave_game", (data: LeaveGameDataT) => {
      console.log("**LEAVE game_id:", data.gameId, "sid:", socket.id);

      // Removing the player sid to the game monitor
      if (gameRooms[data.gameId]) {
        gameRooms[data.gameId].players.forEach((player, player_index) => {
          if (player && player.sid === socket.id) {
            gameRooms[data.gameId].players[player_index] = null;
          }
        });
        gameRooms[data.gameId].playersCount--;
      }

      // Socket leaves the room
      socket.leave(data.gameId.toString());
      socket.send("LEFT");

      console.log("gamePlayers", gameRooms);
    });

    socket.on("play", (data: PlayDataT) => {
      console.log(socket.id, " PLAYED:", data);
      console.log("GAME_STATE", gameRooms[data.gameId]);

      if (gameRooms[data.gameId]) {
        gameRooms[data.gameId].players.forEach((player) => {
          console.log("socket Ids:", player?.sid, socket.id);
          if (player && player.sid === socket.id) {
            console.log("UPDATING LATEST MOVE");
            player.latestMove = data.move;
          }
        });

        // When the two players have played their turn, emit the results
        let movesCount = 0;
        gameRooms[data.gameId].players.forEach((player) => {
          if (player && player.latestMove) movesCount++;
        });

        console.log("movesCount:", movesCount);

        if (movesCount === 2) {
          const resultData: TurnResultT = {
            gameId: data.gameId,
            moves: gameRooms[data.gameId].players.map((player) => ({
              sid: player!.sid,
              move: player!.latestMove!,
            })) as [PlayerMoveT, PlayerMoveT],
          };

          io.in(data.gameId.toString()).emit("results", resultData);

          gameRooms[data.gameId].players.forEach((player) => {
            if (player) {
              player.latestMove = null;
            }
          });
        }
      }

      console.log("GAME_STATE", gameRooms[data.gameId]);
    });
  });

  server.listen(PORT, () => {
    console.log(`Web Socket app started on port ${PORT}.`);
  });
};
