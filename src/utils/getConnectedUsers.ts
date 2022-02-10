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
  for (const [id, socket] of io.of("/").sockets) {
    users.push({
      userId: id,
      username: socket.data.username,
    });
  }
  return users;
};