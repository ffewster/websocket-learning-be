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

io.on("connection", (socket) => {
  console.log('Client connected');
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  io.emit("connectedUsers", getConnectedUsers(io));

  socket.on("chatMessage", message => chatMessageController(io, message));
  socket.on('privateMessage', message => privateMessageController(socket, message));

  socket.on("disconnect", () => {
    console.log('Client disconnected');
    io.emit("connectedUsers", getConnectedUsers(io));
  });
});

// RUN SERVER
httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
