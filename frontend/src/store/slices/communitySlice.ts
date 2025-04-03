import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Community } from '../../types/community';

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommunityState = {
  communities: [],
  currentCommunity: null,
  loading: false,
  error: null,
};

export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async () => {
    const response = await axios.get('/api/communities');
    return response.data;
  }
);

export const fetchCommunity = createAsyncThunk(
  'communities/fetchCommunity',
  async (id: string) => {
    const response = await axios.get(`/api/communities/${id}`);
    return response.data;
  }
);

export const createCommunity = createAsyncThunk(
  'communities/createCommunity',
  async (communityData: { name: string; description: string; tags: string[] }) => {
    const response = await axios.post('/api/communities', communityData);
    return response.data;
  }
);

export const joinCommunity = createAsyncThunk(
  'communities/joinCommunity',
  async (communityId: string) => {
    const response = await axios.post(`/api/communities/${communityId}/join`);
    return response.data;
  }
);

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearCurrentCommunity: (state) => {
      state.currentCommunity = null;
    },
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.error.message || 'Failed to fetch communities';
      })
      .addCase(fetchCommunity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommunity.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCommunity = action.payload;
      })
      .addCase(fetchCommunity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch community';
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.communities.push(action.payload);
      })
      .addCase(joinCommunity.fulfilled, (state, action) => {
        const community = state.communities.find((c) => c.id === action.payload.id);
        if (community) {
          community.members = action.payload.members;
        }
        if (state.currentCommunity?.id === action.payload.id) {
          state.currentCommunity.members = action.payload.members;
        }
      });
  },
});

export const { clearCurrentCommunity } = communitySlice.actions;
export default communitySlice.reducer; 