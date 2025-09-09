import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

interface Borrower {
  id: string;
  name: string;
  email: string;
  registered_date: string;
}

interface BorrowersState {
  items: Borrower[];
  currentBorrowerBorrowings: any[]; // Books currently borrowed by a specific borrower
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BorrowersState = {
  items: [],
  currentBorrowerBorrowings: [],
  status: 'idle',
  error: null,
};

export const fetchBorrowers = createAsyncThunk('borrowers/fetchBorrowers', async () => {
  const response = await axiosInstance.get('/borrowers');
  return response.data;
});

export const addBorrower = createAsyncThunk(
  'borrowers/addBorrower',
  async (borrower: Omit<Borrower, 'id' | 'registered_date'>) => {
    const response = await axiosInstance.post('/borrowers', borrower);
    
    // If backend returns the created borrower, use it
    if (response.data.borrower) {
      return response.data.borrower;
    }
    
    // If backend just returns success message with borrowerId, create the borrower object
    return {
      id: response.data.borrowerId,
      ...borrower,
      registered_date: new Date().toISOString(),
    };
  }
);

export const updateBorrower = createAsyncThunk(
  'borrowers/updateBorrower',
  async ({ id, ...borrower }: Borrower) => {
    const response = await axiosInstance.put(`/borrowers/${id}`, borrower);
    
    // Backend returns success message, so we return the updated borrower data
    return { id, ...borrower };
  }
);

export const deleteBorrower = createAsyncThunk(
  'borrowers/deleteBorrower',
  async (id: string) => {
    await axiosInstance.delete(`/borrowers/${id}`);
    return id;
  }
);

export const fetchBorrowerById = createAsyncThunk(
  'borrowers/fetchBorrowerById',
  async (id: string) => {
    const response = await axiosInstance.get(`/borrowers/${id}`);
    return response.data;
  }
);

export const fetchBorrowerBorrowings = createAsyncThunk(
  'borrowers/fetchBorrowerBorrowings',
  async (id: string) => {
    const response = await axiosInstance.get(`/borrowers/${id}/borrowings`);
    return response.data;
  }
);

const borrowersSlice = createSlice({
  name: 'borrowers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all borrowers
      .addCase(fetchBorrowers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBorrowers.fulfilled, (state, action: PayloadAction<Borrower[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBorrowers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch borrowers';
      })
      
      // Add borrower
      .addCase(addBorrower.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBorrower.fulfilled, (state, action: PayloadAction<Borrower>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addBorrower.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add borrower';
      })
      
      // Update borrower
      .addCase(updateBorrower.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateBorrower.fulfilled, (state, action: PayloadAction<Borrower>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(borrower => borrower.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBorrower.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update borrower';
      })
      
      // Delete borrower
      .addCase(deleteBorrower.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBorrower.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter(borrower => borrower.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBorrower.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete borrower';
      })
      
      // Fetch borrower by ID
      .addCase(fetchBorrowerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBorrowerById.fulfilled, (state, action: PayloadAction<Borrower>) => {
        state.status = 'succeeded';
        // Add or update the borrower in the items array
        const index = state.items.findIndex(borrower => borrower.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchBorrowerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch borrower';
      })
      
      // Fetch borrower borrowings
      .addCase(fetchBorrowerBorrowings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBorrowerBorrowings.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded';
        state.currentBorrowerBorrowings = action.payload;
      })
      .addCase(fetchBorrowerBorrowings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch borrower borrowings';
      });
  },
});

export default borrowersSlice.reducer;
