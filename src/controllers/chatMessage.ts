import { Server, Socket } from "socket.io";
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
}

export default (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  _socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  message: IMessage
) => {
  io.emit("chatMessage", message);
};
