import { SAVE_SESSION_DATA, SessionState, SessionActionTypes } from './session.types';

const initialState: SessionState = {
    session: {
        token: '',
        username: ''
    }
}

export function sessionReducer (state = initialState, action: SessionActionTypes): SessionState {
    switch (action.type) {
        case SAVE_SESSION_DATA: return {
            session: action.data
        }
        default: return state
    }
}