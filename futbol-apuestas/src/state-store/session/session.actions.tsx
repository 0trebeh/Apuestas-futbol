import { SAVE_SESSION_DATA, Session, SessionActionTypes } from './session.types';

export function saveData (sessionData: Session): SessionActionTypes {
    return {
        type: SAVE_SESSION_DATA,
        data: sessionData
    }
}