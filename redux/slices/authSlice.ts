import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

interface FormData {
  name?: string;
  email: string;
  password: string;
}

// -------------------- REGISTER --------------------
export const registerUser = createAsyncThunk<User, FormData>(
  "auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<User>(
        "http://localhost:5000/api/auth/register",
        formData
      );
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// -------------------- LOGIN --------------------
interface LoginResponse {
  name: string;
  role: "customer" | "admin" | "superadmin";
  token: string;
}

export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "http://localhost:5000",
  async (form, thunkAPI) => {
    try {
      const response = await axios.post<LoginResponse>(
        "/api/auth/login",
        form
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// -------------------- INITIAL STATE --------------------
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// -------------------- SLICE --------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Map LoginResponse to User
        state.user = {
          _id: "", // backend should return _id if available
          name: action.payload.name,
          email: "", // backend can return email if needed
          role: action.payload.role,
          token: action.payload.token,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
