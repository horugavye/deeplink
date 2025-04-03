import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
    avatar?: string;
  };
  room: number;
  created_at: string;
  is_read: boolean;
}

interface ChatRoom {
  id: number;
  name: string;
  room_type: 'direct' | 'group';
  participants: {
    id: number;
    username: string;
    avatar?: string;
  }[];
  created_at: string;
  updated_at: string;
}

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: Message[];
  socket: Socket | null;
  loading: boolean;
  error: string | null;
  typingUsers: { [key: string]: boolean };
}

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  socket: null,
  loading: false,
  error: null,
  typingUsers: {},
};

// Async thunks
export const fetchChatRooms = createAsyncThunk('chat/fetchRooms', async () => {
  const response = await axios.get('/api/chat/rooms/');
  return response.data;
});

export const fetchChatRoom = createAsyncThunk(
  'chat/fetchRoom',
  async (roomId: number) => {
    const response = await axios.get(`/api/chat/rooms/${roomId}/`);
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId: number) => {
    const response = await axios.get(`/api/chat/rooms/${roomId}/messages/`);
    return response.data;
  }
);

export const createChatRoom = createAsyncThunk(
  'chat/createRoom',
  async (data: { name?: string; participants: number[]; room_type: 'direct' | 'group' }) => {
    const response = await axios.post('/api/chat/rooms/', data);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket>) => {
      state.socket = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setTypingStatus: (
      state,
      action: PayloadAction<{ username: string; isTyping: boolean }>
    ) => {
      const { username, isTyping } = action.payload;
      state.typingUsers[username] = isTyping;
    },
    clearCurrentRoom: (state) => {
      state.currentRoom = null;
      state.messages = [];
      state.typingUsers = {};
    },
    markMessagesAsRead: (state) => {
      state.messages = state.messages.map((message) => ({
        ...message,
        is_read: true,
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Chat Rooms
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chat rooms';
      })
      // Fetch Single Room
      .addCase(fetchChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRoom = action.payload;
      })
      .addCase(fetchChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch chat room';
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      // Create Chat Room
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
        state.currentRoom = action.payload;
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create chat room';
      });
  },
});

export const {
  setSocket,
  addMessage,
  setTypingStatus,
  clearCurrentRoom,
  markMessagesAsRead,
} = chatSlice.actions;
export default chatSlice.reducer; 