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
  const users: Array<IUser> = [];
  for (const [_id, socket] of io.of("/").sockets) {
    const { userID, username } = socket.data;
    if(userID && username) {
      users.push({
        userId: userID,
        username: username,
      });
    }
  }
  return users;
};