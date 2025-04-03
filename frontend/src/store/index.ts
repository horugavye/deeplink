import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import communityReducer from './slices/communitySlice';
import postReducer from './slices/postSlice';
import chatReducer from './slices/chatSlice';
import notificationReducer from './slices/notificationSlice';
import commentReducer from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    post: postReducer,
    chat: chatReducer,
    notifications: notificationReducer,
    comments: commentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 