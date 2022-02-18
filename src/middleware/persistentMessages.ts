import { Scoekt } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "src/types";

const messagesPerUser = new Map();
