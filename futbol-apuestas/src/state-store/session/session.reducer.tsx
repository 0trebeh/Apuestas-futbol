import {
  SAVE_SESSION_DATA,
  CLEAR_SESSION_DATA,
  SessionActionTypes,
  Session,
} from './session.types';

const initialState: Session = {
  token: '',
  username: '',
  isSessionActive: false,
  balance: 0,
};

export function sessionReducer(
  state = initialState,
  action: SessionActionTypes
): Session {
  switch (action.type) {
    case SAVE_SESSION_DATA:
      return {
        balance: action.data.balance,
        isSessionActive: action.data.isSessionActive,
        token: action.data.token,
        username: action.data.username,
      };
    case CLEAR_SESSION_DATA:
      return {
        balance: initialState.balance,
        isSessionActive: false,
        token: initialState.token,
        username: initialState.username,
      };
    case 'SET_USER_BALANCE':
      return {
        ...state,
        balance: action.balance,
      };
    default:
      return state;
  }
}
