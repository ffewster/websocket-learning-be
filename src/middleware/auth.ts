import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from "src/types";

interface Auth {
  [key: string]: unknown;
  username: string;
}

export const authMiddleware = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
  next: (err?: ExtendedError | undefined) => void
) => {
  const auth = socket?.handshake.auth as Auth;
  const username = auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.data.username = username
  next();
};
