'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { Book } from '@/types/book';
import { addBook, updateBook } from '@/lib/redux/slices/booksSlice';

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

export default function BookForm({ book, onClose }: BookFormProps) {
  const [formData, setFormData] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    ISBN: '',
    quantity: 1,
    shelf_location: '',
  });

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        quantity: book.quantity,
        shelf_location: book.shelf_location,
      });
    }
  }, [book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (book) {
        // Editing existing book
        const result = await dispatch(updateBook({ 
          id: book.id, 
          ...formData 
        }));
        if (updateBook.fulfilled.match(result)) {
          onClose();
        } else {
          console.error('Failed to update book:', result.error);
        }
      } else {
        // Adding new book
        const result = await dispatch(addBook(formData));
        if (addBook.fulfilled.match(result)) {
          onClose();
        } else {
          console.error('Failed to add book:', result.error);
        }
      }
    } catch (error) {
      console.error('Failed to save book:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {book ? 'Edit Book' : 'Add New Book'}
          </h3>
          
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                required
                value={formData.ISBN}
                onChange={(e) =>
                  setFormData({ ...formData, ISBN: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shelf Location
              </label>
              <input
                type="text"
                required
                value={formData.shelf_location}
                onChange={(e) =>
                  setFormData({ ...formData, shelf_location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                  status === 'loading'
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {status === 'loading' ? 'Saving...' : (book ? 'Save Changes' : 'Add Book')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
