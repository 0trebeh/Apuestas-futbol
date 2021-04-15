export const SAVE_SESSION_DATA = 'SAVE_SESSION_DATA';
export const CLEAR_SESSION_DATA = 'CLEAR_SESSION_DATA';
export const SET_USER_BALANCE = 'SET_USER_BALANCE';

export interface Session {
  username: string;
  token: string;
  isSessionActive: boolean;
  balance: number;
}

interface SaveSessionAction {
  type: typeof SAVE_SESSION_DATA;
  data: Session;
}

interface ClearSessionAction {
  type: typeof CLEAR_SESSION_DATA;
}

interface SetBalanceAction {
  type: typeof SET_USER_BALANCE;
  balance: number;
}

export type SessionActionTypes =
  | SaveSessionAction
  | ClearSessionAction
  | SetBalanceAction;