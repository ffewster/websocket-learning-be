import { IMessage } from "src/controllers/chatMessage";

class InMemoryMessageStore {
  messages: IMessage[];

  constructor() {
    this.messages = [];
  }

  debug() {
    console.log(this.messages);
  }

  saveMessage(message: IMessage): void {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string): IMessage[] {
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

export const messageStore = new InMemoryMessageStore();
