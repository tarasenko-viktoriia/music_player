import { configureStore } from '@reduxjs/toolkit';
import playerReducer from '../Redux/playerSlice';

const store = configureStore({
    reducer: {
        player: playerReducer,
    },
});

export default store;
