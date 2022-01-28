import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const { PORT = 3000 } = process.env;

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: false,
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send({ response: "I am alive" }).status(200);
});

let interval: any;

const getApiAndEmit = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

io.on("connection", (socket) => {
  console.log("New client connected");

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1000);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Express server is listening on localhost:${PORT}`);
});
