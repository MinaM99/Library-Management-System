'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { fetchBooks, deleteBook, searchBooks } from '@/lib/redux/slices/booksSlice';
import DataTable from '@/components/common/DataTable';
import BookForm from './BookForm';
import { Book } from '@/types/book';

export default function BooksList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const { items: books, status, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (book: Book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await dispatch(deleteBook(book.id));
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        await dispatch(searchBooks(searchQuery));
      } catch (error) {
        console.error('Failed to search books:', error);
      }
    } else {
      // If search query is empty, fetch all books
      dispatch(fetchBooks());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    dispatch(fetchBooks());
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'author', header: 'Author' },
    { key: 'ISBN', header: 'ISBN' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'shelf_location', header: 'Shelf Location' },
  ];

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading books</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => dispatch(fetchBooks())}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Books</h2>
        
        {/* Search Form */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Search
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Clear
              </button>
            )}
          </form>
          
          <button
            onClick={() => {
              setSelectedBook(null);
              setIsFormOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap"
          >
            Add Book
          </button>
        </div>
      </div>

      <DataTable
        data={books}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <BookForm
          book={selectedBook}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedBook(null);
          }}
        />
      )}
    </div>
  );
}
