import { Server } from "socket.io";
import crypto from 'crypto';
import {
  ClientToServerEvents,
  InterServerEvents,
  IUser,
  ServerToClientEvents,
  SocketData,
} from "./types";

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

export const randomId = () => crypto.randomBytes(8).toString("hex");

export class InMemorySessionStore {
  sessions: Map<any, any>;

  constructor() {
    this.sessions = new Map();
  }

  findSession(id: any) {
    return this.sessions.get(id);
  }

  saveSession(id: any, session: any) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}