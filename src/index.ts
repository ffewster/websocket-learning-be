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
import { persistentIdMiddleware } from "./middleware";

// HELPERS
import { getConnectedUsers, sessionStore } from "./utils";

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
io.use(persistentIdMiddleware);

/**
 * On websocket connection
 */
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  const { userID, sessionID, username } = socket.data;
  if (userID) {
    socket.join(userID);
  }

  socket.emit("session", {
    sessionID: socket.data.sessionID,
    userID: socket.data.userID,
  });

  io.emit("connectedUsers", getConnectedUsers(io));

  socket.on("chatMessage", (message) => {
    chatMessageController(io, message);
  });

  socket.on("privateMessage", (message) => {
    privateMessageController(socket, message);
  });

  console.log({ data: socket.data });

  socket.on("disconnect", async () => {
    console.log("Client disconnected");
    if (userID && sessionID && username) {
      const matchingSockets = await io.in(userID).allSockets();
      const isDisconnected = !matchingSockets.size;
      console.log({ userID });
      if (isDisconnected) {
        // Notify other users
        socket.broadcast.emit("disconnectedUser", userID);
        // update the connection status of the session
        sessionStore.saveSession(sessionID, {
          userID,
          username,
          connected: false,
        });
      }
    }
  });
});

// RUN SERVER
httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
