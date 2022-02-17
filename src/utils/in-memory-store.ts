import crypto from 'crypto';

export const randomId = () => crypto.randomBytes(8).toString("hex");

class InMemorySessionStore {
  sessions: Map<any, any>;

  constructor() {
    this.sessions = new Map();
  }

  debug(): void {
    console.log(this.sessions);
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

export const sessionStore = new InMemorySessionStore()