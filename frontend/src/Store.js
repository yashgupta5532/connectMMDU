import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './Reducers/UserReducer.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    // ... other reducers
  },
});

export default store;
