import {combineReducers, configureStore} from '@reduxjs/toolkit'
import AuthReducer from './AuthSlice'
import storage from 'redux-persist/lib/storage';
import {persistReducer} from "redux-persist";

const reducers = combineReducers({
    auth: AuthReducer,
});

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;