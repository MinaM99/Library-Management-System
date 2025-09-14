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
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      // No need to store token in localStorage - it's now in HTTP-only cookie
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

export const logout = createAsyncThunk('auth/logout', async () => {
  // Call logout endpoint to clear HTTP-only cookie
  await axiosInstance.post('/auth/logout');
  return null;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Not authenticated - this is normal, not an error
      return rejectWithValue('Not authenticated');
    }
    return rejectWithValue('Error checking authentication status');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Remove hydrateAuth - no longer needed with HTTP-only cookies
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
        state.isAuthenticated = true;
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
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      .addCase(checkAuth.pending, (state) => {
        if (state.status === 'idle') {
          state.status = 'loading';
        }
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
        state.isAuthenticated = false;
        state.error = null; // Don't show error for failed auth check
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
