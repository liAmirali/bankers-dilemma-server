import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const PORT = 8001;

io.on("connection", (socket) => {
  console.log("A user connected.", socket.id);

  socket.send("Hello!");
});

app.use(cors());

server.listen(PORT, () => {
  console.log("App Started!");
});
