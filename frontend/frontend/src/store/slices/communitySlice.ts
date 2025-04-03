import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Community {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  isJoined: boolean;
}

interface CommunitiesState {
  communities: Community[];
  currentCommunity: Community | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunitiesState = {
  communities: [],
  currentCommunity: null,
  loading: false,
  error: null,
};

export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/communities');
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch communities');
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  'communities/fetchCommunityById',
  async (communityId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/communities/${communityId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch community');
    }
  }
);

export const createCommunity = createAsyncThunk(
  'communities/createCommunity',
  async (
    { name, description }: { name: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/communities', {
        name,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create community');
    }
  }
);

export const joinCommunity = createAsyncThunk(
  'communities/joinCommunity',
  async (communityId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to join community');
    }
  }
);

export const leaveCommunity = createAsyncThunk(
  'communities/leaveCommunity',
  async (communityId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/communities/${communityId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to leave community');
    }
  }
);

const communitySlice = createSlice({
  name: 'communities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Communities
      .addCase(fetchCommunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.loading = false;
        state.communities = action.payload;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Community by ID
      .addCase(fetchCommunityById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Community
      .addCase(createCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.communities.unshift(action.payload);
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Join Community
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const community = state.communities.find((c) => c.id === action.payload.id);
        if (community) {
          community.membersCount = action.payload.membersCount;
          community.isJoined = true;
        }
        if (state.currentCommunity && state.currentCommunity.id === action.payload.id) {
          state.currentCommunity.membersCount = action.payload.membersCount;
          state.currentCommunity.isJoined = true;
        }
      })
      // Leave Community
      .addCase(leaveCommunity.fulfilled, (state, action) => {
        const community = state.communities.find((c) => c.id === action.payload.id);
        if (community) {
          community.membersCount = action.payload.membersCount;
          community.isJoined = false;
        }
        if (state.currentCommunity && state.currentCommunity.id === action.payload.id) {
          state.currentCommunity.membersCount = action.payload.membersCount;
          state.currentCommunity.isJoined = false;
        }
      });
  },
});

export const { clearError } = communitySlice.actions;
export default communitySlice.reducer; 