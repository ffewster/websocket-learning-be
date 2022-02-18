import { Socket } from "socket.io";
import { messageStore } from "../utils";
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
  if (userID) {
    const completeMessage = { 
      ...message,
      from: userID,
      to,
    }
    socket.to(to).to(userID).emit("privateMessage", completeMessage);
    messageStore.saveMessage(completeMessage);
  }
  messageStore.debug();
};
