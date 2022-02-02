import { Socket } from "socket.io";
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
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  message: IMessage & { to: string }
) => {
  socket.to(message.to).emit("privateMessage", {
      ...message,
      from: socket.id
  });
  socket.emit("privateMessage", {
      ...message,
      from: message.to
  });
};
