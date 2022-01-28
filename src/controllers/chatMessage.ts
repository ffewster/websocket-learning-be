import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export interface IMessage {
  username: string;
  text: string;
  id: number;
  timestamp: number;
}

export default (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  _socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  message: IMessage
) => {
  console.log({ "Inbound Message": message });
  io.emit("chat message", message);
};
