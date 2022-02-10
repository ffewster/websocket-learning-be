import express from "express";
import http from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

// CONTROLLERS
import { chatMessageController, privateMessageController } from "./controllers";

// MIDDLEWARE
import { authMiddleware, persistentIdMiddleware } from "./middleware";

// HELPERS
import { getConnectedUsers } from "./utils";

const { PORT = 3001 } = process.env;

const app = express();

/**
 * Configure http server and socket.io instance
 */
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

/**
 * REGISTER MIDDLWARES
 */
io.use(authMiddleware);
io.use(persistentIdMiddleware);

/**
 * On websocket connection
 */
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.emit("session", {
    sessionID: socket.data.sessionID,
    userID: socket.data.userID,
    username: socket.data.username,
  });


  io.emit("connectedUsers", getConnectedUsers(io));

  socket.on("chatMessage", (message) => chatMessageController(io, message));

  socket.on("privateMessage", (message) =>
    privateMessageController(socket, message)
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    io.emit("disconnectedUser", {
      userId: socket.id,
      username: socket.handshake.auth.username,
    });
  });
});

// RUN SERVER
httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
