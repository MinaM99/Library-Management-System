'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { Book } from '@/types/book';
import { addBook, updateBook } from '@/lib/redux/slices/booksSlice';
import { useBookFormValidation } from '@/hooks/useBookFormValidation';
import { BookFormData } from '@/utils/bookValidation';

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
}

export default function BookForm({ book, onClose }: BookFormProps) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.books);

  // Initialize form data
  const initialData: BookFormData = {
    title: book?.title || '',
    author: book?.author || '',
    ISBN: book?.ISBN || '',
    quantity: book?.quantity || 1,
    shelf_location: book?.shelf_location || '',
  };

  // Use validation hook
  const {
    formData,
    validationErrors,
    touched,
    hasErrors,
    updateField,
    touchField,
    validateForm,
    setFormData,
  } = useBookFormValidation(initialData);

  // Update form data when book prop changes
  useEffect(() => {
    if (book) {
      const updatedData: BookFormData = {
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        quantity: book.quantity,
        shelf_location: book.shelf_location,
      };
      setFormData(updatedData);
    }
  }, [book, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
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
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={() => touchField('title')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  validationErrors.title
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
              />
              {touched.title && validationErrors.title && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => updateField('author', e.target.value)}
                onBlur={() => touchField('author')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  validationErrors.author
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
              />
              {touched.author && validationErrors.author && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.author}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ISBN
              </label>
              <input
                type="text"
                required
                value={formData.ISBN}
                onChange={(e) => updateField('ISBN', e.target.value)}
                onBlur={() => touchField('ISBN')}
                placeholder="e.g., 978-0-123456-78-9 or 0123456789"
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  validationErrors.ISBN
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
              />
              {touched.ISBN && validationErrors.ISBN && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.ISBN}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                required
                min="0"
                max="10000"
                value={formData.quantity}
                onChange={(e) => updateField('quantity', parseInt(e.target.value) || 0)}
                onBlur={() => touchField('quantity')}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  validationErrors.quantity
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
              />
              {touched.quantity && validationErrors.quantity && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shelf Location
              </label>
              <input
                type="text"
                required
                value={formData.shelf_location}
                onChange={(e) => updateField('shelf_location', e.target.value)}
                onBlur={() => touchField('shelf_location')}
                placeholder="e.g., A1-B2, Fiction-001"
                maxLength={50}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 sm:text-sm ${
                  validationErrors.shelf_location
                    ? 'border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-indigo-500'
                }`}
              />
              {touched.shelf_location && validationErrors.shelf_location && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.shelf_location}</p>
              )}
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
                disabled={status === 'loading' || hasErrors}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md ${
                  status === 'loading' || hasErrors
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
