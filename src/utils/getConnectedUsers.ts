import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  IUser,
  ServerToClientEvents,
  SocketData,
} from "../types";

export const getConnectedUsers = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
): Array<IUser> => {
  const users = new Map<string, IUser>();
  for (const [_id, socket] of io.of("/").sockets) {
    const { userID, username } = socket.data;
    if (userID && username) {
      users.set(userID, { userId: userID, username });
    }
  }
  return Array.from(users.values());
};
