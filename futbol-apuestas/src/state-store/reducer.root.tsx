import { combineReducers } from 'redux';
import { sessionReducer } from './session/session.reducer';

const rootReducer = combineReducers({
    session: sessionReducer
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;