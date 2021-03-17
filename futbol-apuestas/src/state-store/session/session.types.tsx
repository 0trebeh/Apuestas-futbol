export const SAVE_SESSION_DATA = 'SAVE_SESSION_DATA';

export interface Session {
    username: string,
    token: string,
    isSessionActive: boolean
}

export interface SessionState {
    session: Session
}

interface SaveSessionAction {
    type: typeof SAVE_SESSION_DATA;
    data: Session
}

export type SessionActionTypes = SaveSessionAction