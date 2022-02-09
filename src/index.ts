import express from "express";
import http from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

// Websocket Controllers
import chatMessageController from "./controllers/chatMessage";
import privateMessageController from "./controllers/privateMessage";

// Middleware
import { authMiddleware } from "./middleware/auth";

// Helpers
import { getConnectedUsers } from "./helpers";
import { persistentIdMiddleware } from "./middleware/persistentId";

const { PORT = 3001 } = process.env;

const app = express();

// Configure server & socket.io
const httpServer = http.createServer(app);
export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.0.17:3000"],
    methods: ["GET", "POST"],
    credentials: false,
  },
});

// Register middlewares
io.use(authMiddleware);
io.use(persistentIdMiddleware);

io.on("connection", (socket) => {

  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.emit("session", {
    sessionID: socket.data.sessionID,
    userID: socket.data.userID,
    username: socket.data.username,
  });

  console.log("Client connected");

  io.emit("connectedUsers", getConnectedUsers(io));

  socket.on("chatMessage", (message) => chatMessageController(io, message));
  socket.on("privateMessage", (message) =>
    privateMessageController(socket, message)
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    io.emit('disconnectedUser', {
      userId: socket.id,
      username: socket.handshake.auth.username,
    });
  });
});

// RUN SERVER
httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
