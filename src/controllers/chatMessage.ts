import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../types";

export interface IMessage {
  username: string;
  text: string;
  id: number;
  timestamp: number;
  to: string;
  from: string;
}

export default (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  message: IMessage
) => {
  io.emit("chatMessage", message);
};
