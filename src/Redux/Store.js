import { configureStore } from '@reduxjs/toolkit';
import playerReducer, { audioMiddleware }  from '../Redux/playerSlice';
import {thunk} from 'redux-thunk';

const store = configureStore({
    reducer: {
      player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(audioMiddleware),
  });

export default store;