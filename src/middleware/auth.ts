import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface Auth {
  [key: string]: unknown;
  username: string;
}

export interface ExtendedSocket
  extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  username?: string;
}

export const authMiddleware = (
  socket: ExtendedSocket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const auth = socket?.handshake.auth as Auth;
  const username = auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
};
