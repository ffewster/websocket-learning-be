import { Socket } from "socket.io";
import { IMessage } from "./controllers/chatMessage";

export interface IUser {
    userId: string;
    username?: string;
}

export interface ServerToClientEvents {
    chatMessage: (message: IMessage) => void;
    connectedUsers: (users: Array<IUser>) => void;
    privateMessage: (message: IMessage & { from: string }) => void;
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
}

export type Test = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>