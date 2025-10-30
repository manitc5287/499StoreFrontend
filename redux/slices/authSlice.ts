import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, ENDPOINTS } from "../../utils/APIENDPOINTS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as userLogin } from "./userSlice";

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "superadmin";
  token: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin" | "superadmin";
  token: string;
}

interface AuthCredentials {
  email: string;
  password: string;
  name?: string;
}

// Async Thunks
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { dispatch }) => {
    const userData = await AsyncStorage.getItem("user");
    const parsed = userData ? JSON.parse(userData) : null;
    if (parsed) {
      // keep user slice in sync so UI knows user is logged in
      dispatch(userLogin(parsed));
    }
    return parsed;
  }
);

export const register = createAsyncThunk<AuthResponse, AuthCredentials>(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${ENDPOINTS.AUTH}/register`,
        credentials
      );
      await AsyncStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk<AuthResponse, AuthCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${ENDPOINTS.AUTH}/login`,
        credentials
      );
      
      const data = response.data;
      if (!data._id || !data.token) {
        return rejectWithValue("Invalid response from server");
      }

      await AsyncStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else if (error.message === "Network Error") {
        return rejectWithValue("Network error. Please check your connection");
      } else {
        return rejectWithValue("Login failed. Please try again");
      }
    }
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      AsyncStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initialize
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
