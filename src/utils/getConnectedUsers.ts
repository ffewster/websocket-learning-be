import { Server, Socket } from "socket.io";
import { IMessage } from "src/controllers/chatMessage";
import {
  ClientToServerEvents,
  InterServerEvents,
  IUser,
  ServerToClientEvents,
  SocketData,
} from "../types";
import { messageStore } from ".";
import { sessionStore } from "./in-memory-session-store";

export const getConnectedUsers = (
  _io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
): Array<IUser> => {
  const { userID } = socket.data;
  const users = new Map<string, IUser>();
  if (userID) {
    const messagesPerUser = new Map<string, IMessage[]>();
    messageStore.findMessagesForUser(userID).forEach((message) => {
      const { to, from } = message;
      const otherUser = userID === from ? to : from; // user ID of other user
      messagesPerUser.has(otherUser)
        ? messagesPerUser.get(otherUser)?.push(message)
        : messagesPerUser.set(otherUser, [message]);
    });

    sessionStore.findAllSessions().forEach(session => {
      users.set(session.userID, {
        userId: session.userID,
        username: session.username,
        connected: !!session.connected,
        messages: messagesPerUser.get(session.userID) || [],
      });
    });
  }
  return Array.from(users.values());
};
