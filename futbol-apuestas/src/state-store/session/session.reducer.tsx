import {
    SAVE_SESSION_DATA,
    CLEAR_SESSION_DATA,
    SessionState,
    SessionActionTypes
} from './session.types';

const initialState: SessionState = {
    session: {
        token: '',
        username: '',
        isSessionActive: false
    }
}

export function sessionReducer(state = initialState, action: SessionActionTypes): SessionState {
    switch (action.type) {
        case SAVE_SESSION_DATA: return {
            session: action.data
        }
        case CLEAR_SESSION_DATA: return {
            session: initialState.session
        }
        default: return state
    }
}