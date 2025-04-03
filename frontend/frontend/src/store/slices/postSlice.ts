import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (
    { title, content, communityId }: { title: string; content: string; communityId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/posts', {
        title,
        content,
        communityId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to like post');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to unlike post');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
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
        state.error = action.payload as string;
      })
      // Fetch Post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
          post.isLiked = true;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost.likes = action.payload.likes;
          state.currentPost.isLiked = true;
        }
      })
      // Unlike Post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.posts.find((p) => p.id === action.payload.id);
        if (post) {
          post.likes = action.payload.likes;
          post.isLiked = false;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost.likes = action.payload.likes;
          state.currentPost.isLiked = false;
        }
      });
  },
});

export const { clearError } = postSlice.actions;
export default postSlice.reducer; 