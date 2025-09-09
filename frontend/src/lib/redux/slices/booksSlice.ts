import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

interface Book {
  id: string;
  title: string;
  author: string;
  ISBN: string;
  quantity: number;
  shelf_location: string;
}

interface BooksState {
  items: Book[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BooksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBooks = createAsyncThunk('books/fetchBooks', async () => {
  const response = await axiosInstance.get('/books');
  return response.data;
});

export const addBook = createAsyncThunk(
  'books/addBook',
  async (book: Omit<Book, 'id'>) => {
    const response = await axiosInstance.post('/books', book);
    
    // If backend returns the created book, use it
    if (response.data.book) {
      return response.data.book;
    }
    
    // If backend just returns success message with bookId, create the book object
    return {
      id: response.data.bookId,
      ...book,
    };
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, ...book }: Book) => {
    const response = await axiosInstance.put(`/books/${id}`, book);
    
    // Backend returns success message, so we return the updated book data
    return { id, ...book };
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string) => {
    await axiosInstance.delete(`/books/${id}`);
    return id;
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id: string) => {
    const response = await axiosInstance.get(`/books/${id}`);
    return response.data;
  }
);

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (query: string) => {
    const response = await axiosInstance.get(`/books/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch books';
      })
      
      // Add book
      .addCase(addBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to add book';
      })
      
      // Update book
      .addCase(updateBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action: PayloadAction<Book>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update book';
      })
      
      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter(book => book.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to delete book';
      })
      
      // Fetch book by ID
      .addCase(fetchBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action: PayloadAction<Book>) => {
        state.status = 'succeeded';
        // Add or update the book in the items array
        const index = state.items.findIndex(book => book.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch book';
      })
      
      // Search books
      .addCase(searchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        // For search, we might want to keep original items and have search results separate
        // For now, we'll replace the items with search results
        state.items = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to search books';
      });
  },
});

export default booksSlice.reducer;
