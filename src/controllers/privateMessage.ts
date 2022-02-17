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
  const { to } = message;
  const { userID } = socket.data;
  console.log({ to, userID });
  if (userID) {
    socket
      .to(to)
      .to(userID)
      .emit("privateMessage", {
        ...message,
        from: userID,
        to,
      });
  }
};
