import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // Store the token in localStorage
      if (response.data.token) {
        localStorage.setItem('__clerk_db_jwt', response.data.token);
      }
      return response.data;
    } catch (error: any) {
      // Handle different types of errors
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid email or password');
      } else if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('An error occurred while trying to log in');
      }
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  // Remove token from localStorage
  localStorage.removeItem('__clerk_db_jwt');
  // Clear any stored user data or tokens
  localStorage.clear();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    hydrateAuth: (state) => {
      // Only run on client side
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('__clerk_db_jwt');
        if (token) {
          state.token = token;
          state.status = 'succeeded';
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = 'Login failed. Please check your credentials and try again.';
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'idle';
      });
  },
});

export const { clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
