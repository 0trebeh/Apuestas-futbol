export const SAVE_SESSION_DATA = 'SAVE_SESSION_DATA';
export const CLEAR_SESSION_DATA = 'CLEAR_SESSION_DATA';

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

interface ClearSessionAction {
    type: typeof CLEAR_SESSION_DATA,
}

export type SessionActionTypes = SaveSessionAction | ClearSessionAction;