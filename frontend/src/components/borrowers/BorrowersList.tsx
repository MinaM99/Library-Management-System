'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { fetchBorrowers, deleteBorrower } from '@/lib/redux/slices/borrowersSlice';
import DataTable from '@/components/common/DataTable';
import BorrowerForm from './BorrowerForm';
import { Borrower } from '@/types/borrower';

export default function BorrowersList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const { items: borrowers, status, error } = useAppSelector((state) => state.borrowers);

  useEffect(() => {
    dispatch(fetchBorrowers());
  }, [dispatch]);

  const handleEdit = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setIsFormOpen(true);
  };

  const handleDelete = async (borrower: Borrower) => {
    if (window.confirm(`Are you sure you want to delete borrower "${borrower.name}"?`)) {
      try {
        await dispatch(deleteBorrower(borrower.id));
      } catch (error) {
        console.error('Failed to delete borrower:', error);
      }
    }
  };

  // Client-side search filtering
  const filteredBorrowers = borrowers.filter(borrower =>
    borrower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrower.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'registered_date',
      header: 'Registered Date',
      render: (borrower: Borrower) =>
        new Date(borrower.registered_date).toLocaleDateString(),
    },
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
            <h3 className="text-sm font-medium text-red-800">Error loading borrowers</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => dispatch(fetchBorrowers())}
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
        <h2 className="text-xl font-semibold">Borrowers</h2>
        
        {/* Search Form */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search borrowers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Clear
              </button>
            )}
          </div>
          
          <button
            onClick={() => {
              setSelectedBorrower(null);
              setIsFormOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap"
          >
            Add Borrower
          </button>
        </div>
      </div>

      <DataTable
        data={filteredBorrowers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <BorrowerForm
          borrower={selectedBorrower}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedBorrower(null);
          }}
        />
      )}
    </div>
  );
}
