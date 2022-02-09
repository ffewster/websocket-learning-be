import { Socket } from "socket.io";
import { IMessage } from "./controllers/chatMessage";

export interface IUser {
    userId: string;
    username?: string;
}

interface ISessionDetails {
    sessionID?: string;
    userID?: string;
    username?: string;
}

export interface ServerToClientEvents {
    chatMessage: (message: IMessage) => void;
    connectedUsers: (users: Array<IUser>) => void;
    disconnectedUser: (user: IUser) => void;
    privateMessage: (message: IMessage & { from: string }) => void;
    session: (sessionDetails: ISessionDetails) => void
}

export interface ClientToServerEvents {
    chatMessage: (message: IMessage) => void;
    privateMessage: (message: IMessage & { to: string }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    username?: string
    sessionID?: string
    userID?: string;
}

export type Test = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>