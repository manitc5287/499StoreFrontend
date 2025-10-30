import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/APIENDPOINTS';

export interface Store {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
}

export interface StoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

export const fetchStoreAddresses = createAsyncThunk<Store[], string>(
  'store/fetchAll',
  async (token, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stores');
    }
  }
);

export const addStoreAddress = createAsyncThunk<Store, { data: Omit<Store, '_id'>; token: string }>(
  'store/add',
  async ({ data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/stores`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add store');
    }
  }
);

export const updateStoreAddress = createAsyncThunk<Store, { id: string; data: Omit<Store, '_id'>; token: string }>(
  'store/update',
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/stores/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update store');
    }
  }
);

export const deleteStoreAddress = createAsyncThunk<string, { id: string; token: string }>(
  'store/delete',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/api/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete store');
    }
  }
);

const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStoreAddresses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStoreAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addStoreAddress.fulfilled, (state, action) => {
        state.stores.push(action.payload);
      })
      .addCase(updateStoreAddress.fulfilled, (state, action) => {
        state.stores = state.stores.map(store =>
          store._id === action.payload._id ? action.payload : store
        );
      })
      .addCase(deleteStoreAddress.fulfilled, (state, action) => {
        state.stores = state.stores.filter(store => store._id !== action.payload);
      });
  },
});

export default storeSlice.reducer;
