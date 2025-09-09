'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { addBorrowing } from '@/lib/redux/slices/borrowingsSlice';
import { fetchBooks } from '@/lib/redux/slices/booksSlice';
import { fetchBorrowers } from '@/lib/redux/slices/borrowersSlice';

interface BorrowingFormProps {
  onClose: () => void;
}

export default function BorrowingForm({ onClose }: BorrowingFormProps) {
  const [formData, setFormData] = useState({
    book_id: '',
    borrower_id: '',
    due_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { items: books } = useAppSelector((state) => state.books);
  const { items: borrowers } = useAppSelector((state) => state.borrowers);
  const { error } = useAppSelector((state) => state.borrowings);

  useEffect(() => {
    // Fetch books and borrowers if not already loaded
    dispatch(fetchBooks());
    dispatch(fetchBorrowers());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await dispatch(addBorrowing({
        book_id: Number(formData.book_id),
        borrower_id: Number(formData.borrower_id),
        due_date: formData.due_date,
      })).unwrap();
      
      onClose(); // Close form on success
    } catch (error) {
      console.error('Failed to create borrowing:', error);
      // Error will be shown via Redux state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            New Borrowing
          </h3>
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Book *
              </label>
              <select
                required
                value={formData.book_id}
                onChange={(e) =>
                  setFormData({ ...formData, book_id: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select a book</option>
                {books.filter(book => book.quantity > 0).map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author} (Available: {book.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Borrower *
              </label>
              <select
                required
                value={formData.borrower_id}
                onChange={(e) =>
                  setFormData({ ...formData, borrower_id: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={isSubmitting}
              >
                <option value="">Select a borrower</option>
                {borrowers.map((borrower) => (
                  <option key={borrower.id} value={borrower.id}>
                    {borrower.name} - {borrower.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={formData.due_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Borrowing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
