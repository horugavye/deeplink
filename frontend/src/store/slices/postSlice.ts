import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Post } from '../../types/post';

interface PostState {
  posts: Post[];
  communityPosts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  posts: [],
  communityPosts: [],
  currentPost: null,
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async () => {
    const response = await axios.get('/api/posts');
    return response.data;
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id: string) => {
    const response = await axios.get(`/api/posts/${id}`);
    return response.data;
  }
);

export const fetchCommunityPosts = createAsyncThunk(
  'posts/fetchCommunityPosts',
  async (communityId: string) => {
    const response = await axios.get(`/api/communities/${communityId}/posts`);
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: { title: string; content: string; communityId: string }) => {
    const response = await axios.post('/api/posts', postData);
    return response.data;
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: string) => {
    const response = await axios.post(`/api/posts/${postId}/like`);
    return response.data;
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearCommunityPosts: (state) => {
      state.communityPosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.communityPosts = action.payload;
      })
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch community posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
        }
        const communityPost = state.communityPosts.find((p) => p.id === action.payload.id);
        if (communityPost) {
          communityPost.likes = action.payload.likes;
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost.likes = action.payload.likes;
        }
      });
  },
});

export const { clearCurrentPost, clearCommunityPosts } = postSlice.actions;
export default postSlice.reducer; 