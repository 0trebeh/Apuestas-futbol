import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer, { RootState } from './reducer.root';

const persistConfing = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer<RootState, any>(persistConfing, rootReducer);

const store = createStore(
    persistedReducer
)

let persistor = persistStore(store);

export {
    store,
    persistor
}