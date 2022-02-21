import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import {
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData,
} from "src/types";
import { randomId, sessionStore } from "../utils";

export const persistentIdMiddleware = (
    socket: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
    next: (err?: ExtendedError | undefined) => void
) => {
    const sessionID = socket.handshake.auth.sessionID;
    if (sessionID) {
    // find existing session
        const session = sessionStore.findSession(sessionID);
        if (session) {
            socket.data.sessionID = sessionID;
            socket.data.userID = session.userID;
            socket.data.username = session.username;
            sessionStore.saveSession(sessionID, {
                ...session,
                connected: true,
            });
            return next();
        }
    }
    const username = socket.handshake.auth.username;
    if (!username) {
        return next(new Error("invalid username"));
    }
    // create new session
    socket.data.sessionID = randomId();
    socket.data.userID = randomId();
    socket.data.username = username;
    const { userID, sessionID: newSessionID } = socket.data;
    sessionStore.saveSession(newSessionID, {
        connected: true,
        userID,
        username,
    });
    sessionStore.debug();
    next();
};
