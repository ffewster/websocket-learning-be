import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";

// Websocket Controllers
import chatMessageController, { IMessage } from "./controllers/chatMessage";

const { PORT = 3001 } = process.env;

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.0.17:3000"],
    methods: ["GET", "POST"],
    credentials: false,
  },
});

app.get("/", (_req: Request, res: Response) => {
  res.send({ response: "I am alive" }).status(200);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("chat message", (message: IMessage) =>
    chatMessageController(io, socket, message)
  );

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
