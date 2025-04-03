import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Comment } from '../../types/post';

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }: { postId: string; content: string }) => {
    const response = await axios.post(`/api/posts/${postId}/comments`, { content });
    return response.data;
  }
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (commentId: string) => {
    const response = await axios.post(`/api/comments/${commentId}/like`);
    return response.data;
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const comment = state.comments.find((c) => c.id === action.payload.id);
        if (comment) {
          comment.likes = action.payload.likes;
        }
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer; 