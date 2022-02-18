import crypto from 'crypto';

export const randomId = () => crypto.randomBytes(8).toString("hex");

interface MemorySession {
  userID: string;
  username: string;
  connected: boolean;
}

class InMemorySessionStore {
  sessions: Map<string, MemorySession>;

  constructor() {
    this.sessions = new Map();
  }

  debug(): void {
    console.log(this.sessions);
  }

  findSession(id: string) {
    return this.sessions.get(id);
  }

  saveSession(id: string, session: MemorySession) {
    this.sessions.set(id, session);
  }

  findAllSessions(): MemorySession[] {
    return [...this.sessions.values()];
  }
}

export const sessionStore = new InMemorySessionStore()