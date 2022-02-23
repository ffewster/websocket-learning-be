import express from "express";
import http from "http";
import { Server } from "socket.io";
import { chatMessageController, privateMessageController } from "./controllers";
import { persistentIdMiddleware } from "./middleware";
import { getConnectedUsers, sessionStore } from "./utils";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types";

const { PORT = 3001 } = process.env;

const app = express();

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

io.use(persistentIdMiddleware);

io.on("connection", (socket) => {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  const { userID, sessionID, username } = socket.data;

  if (userID) {
    socket.join(userID);
  }

  const session = {
    sessionID: socket.data.sessionID,
    userID: socket.data.userID,
  };
  socket.emit("session", session);

  io.emit("connectedUsers", getConnectedUsers(io, socket));

  socket.on("chatMessage", (message) => {
    chatMessageController(io, message);
  });

  socket.on("privateMessage", (message) => {
    privateMessageController(socket, message);
  });

  console.log({ data: socket.data });

  socket.on("disconnect", async () => {
    if (userID && sessionID && username) {
      const matchingSockets = await io.in(userID).allSockets();
      const isDisconnected = !matchingSockets.size;
      console.log({ userID });
      if (isDisconnected) {
        socket.broadcast.emit("disconnectedUser", userID);
        sessionStore.saveSession(sessionID, {
          userID,
          username,
          connected: false,
        });
      }
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
