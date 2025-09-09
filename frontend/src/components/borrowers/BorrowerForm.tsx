'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { Borrower } from '@/types/borrower';
import { addBorrower, updateBorrower } from '@/lib/redux/slices/borrowersSlice';

interface BorrowerFormProps {
  borrower?: Borrower | null;
  onClose: () => void;
}

export default function BorrowerForm({ borrower, onClose }: BorrowerFormProps) {
  const [formData, setFormData] = useState<Omit<Borrower, 'id' | 'registered_date'>>({
    name: '',
    email: '',
  });

  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.borrowers);

  useEffect(() => {
    if (borrower) {
      setFormData({
        name: borrower.name,
        email: borrower.email,
      });
    }
  }, [borrower]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (borrower) {
        // Editing existing borrower
        const result = await dispatch(updateBorrower({ 
          id: borrower.id, 
          ...formData,
          registered_date: borrower.registered_date // Keep original registration date
        }));
        if (updateBorrower.fulfilled.match(result)) {
          onClose();
        } else {
          console.error('Failed to update borrower:', result.error);
        }
      } else {
        // Adding new borrower
        const result = await dispatch(addBorrower(formData));
        if (addBorrower.fulfilled.match(result)) {
          onClose();
        } else {
          console.error('Failed to add borrower:', result.error);
        }
      }
    } catch (error) {
      console.error('Failed to save borrower:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            {borrower ? 'Edit Borrower' : 'Add New Borrower'}
          </h3>
          
          {error && (
            <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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
                {status === 'loading' ? 'Saving...' : (borrower ? 'Save Changes' : 'Add Borrower')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
