import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

interface Book {
  id: number;
  title: string;
  author: string;
  ISBN: string;
  quantity: number;
  shelf_location: string;
}

interface Borrower {
  id: number;
  name: string;
  email: string;
  registered_date: string;
}

interface Borrowing {
  id: number;
  bookId: number;
  borrowerId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  book: Book;
  borrower: Borrower;
}

interface BorrowingsState {
  items: Borrowing[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BorrowingsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBorrowings = createAsyncThunk(
  'borrowings/fetchBorrowings', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/borrowings');
      
      // Transform backend response to frontend format
      const transformedBorrowings = response.data.map((borrowing: any) => ({
        id: borrowing.id,
        bookId: borrowing.book_id,
        borrowerId: borrowing.borrower_id,
        borrowDate: borrowing.borrow_date,
        dueDate: borrowing.due_date,
        returnDate: borrowing.return_date,
        status: borrowing.status,
        book: {
          id: borrowing.book_id,
          title: borrowing.book_title || 'Unknown Title',
          author: borrowing.book_author || 'Unknown Author',
          ISBN: '', // Not provided by backend
          quantity: 0, // Not provided by backend
          shelf_location: '' // Not provided by backend
        },
        borrower: {
          id: borrowing.borrower_id,
          name: borrowing.borrower_name || 'Unknown Borrower',
          email: borrowing.borrower_email || '',
          registered_date: '' // Not provided by backend
        }
      }));
      
      return transformedBorrowings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch borrowings');
    }
  }
);

export const addBorrowing = createAsyncThunk(
  'borrowings/addBorrowing',
  async (borrowingData: { book_id: number; borrower_id: number; due_date: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/borrowings/checkout', borrowingData);
      
      // Transform the response to match frontend format
      const borrowing = response.data;
      return {
        id: borrowing.id,
        bookId: borrowing.book_id,
        borrowerId: borrowing.borrower_id,
        borrowDate: borrowing.borrow_date,
        dueDate: borrowing.due_date,
        returnDate: borrowing.return_date,
        status: borrowing.status,
        book: {
          id: borrowing.book_id,
          title: borrowing.book_title || 'Unknown Title',
          author: borrowing.book_author || 'Unknown Author',
          ISBN: '',
          quantity: 0,
          shelf_location: ''
        },
        borrower: {
          id: borrowing.borrower_id,
          name: borrowing.borrower_name || 'Unknown Borrower',
          email: borrowing.borrower_email || '',
          registered_date: ''
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add borrowing');
    }
  }
);

export const returnBorrowing = createAsyncThunk(
  'borrowings/returnBorrowing',
  async (borrowingId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/borrowings/${borrowingId}/return`);
      
      // Transform the response to match frontend format
      const borrowing = response.data;
      return {
        id: borrowing.id,
        bookId: borrowing.book_id,
        borrowerId: borrowing.borrower_id,
        borrowDate: borrowing.borrow_date,
        dueDate: borrowing.due_date,
        returnDate: borrowing.return_date,
        status: borrowing.status,
        book: {
          id: borrowing.book_id,
          title: borrowing.book_title || 'Unknown Title',
          author: borrowing.book_author || 'Unknown Author',
          ISBN: '',
          quantity: 0,
          shelf_location: ''
        },
        borrower: {
          id: borrowing.borrower_id,
          name: borrowing.borrower_name || 'Unknown Borrower',
          email: borrowing.borrower_email || '',
          registered_date: ''
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to return book');
    }
  }
);

const borrowingsSlice = createSlice({
  name: 'borrowings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch borrowings
      .addCase(fetchBorrowings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBorrowings.fulfilled, (state, action: PayloadAction<Borrowing[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBorrowings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch borrowings';
      })
      // Add borrowing
      .addCase(addBorrowing.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBorrowing.fulfilled, (state, action: PayloadAction<Borrowing>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addBorrowing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to add borrowing';
      })
      // Return borrowing
      .addCase(returnBorrowing.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(returnBorrowing.fulfilled, (state, action: PayloadAction<Borrowing>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(returnBorrowing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to return book';
      });
  },
});

export const { clearError } = borrowingsSlice.actions;
export default borrowingsSlice.reducer;
