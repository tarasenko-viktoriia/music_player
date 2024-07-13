import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../Redux/playerSlice';
import {thunk} from 'redux-thunk';

const store = configureStore({
    reducer: {
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;