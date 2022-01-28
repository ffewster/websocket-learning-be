import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// Websocket Controllers
import chatMessageController, { IMessage } from "./controllers/chatMessage";

const { PORT = 3000 } = process.env;

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
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
