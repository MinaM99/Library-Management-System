'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { fetchBorrowings, returnBorrowing, clearError } from '@/lib/redux/slices/borrowingsSlice';
import DataTable from '@/components/common/DataTable';
import BorrowingForm from './BorrowingForm';

export default function BorrowingsList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReturning, setIsReturning] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const { items: borrowings, status, error } = useAppSelector((state) => state.borrowings);

  useEffect(() => {
    dispatch(fetchBorrowings());
  }, [dispatch]);

  const handleReturn = async (borrowingId: number) => {
    if (window.confirm('Are you sure you want to mark this book as returned?')) {
      setIsReturning(borrowingId);
      try {
        await dispatch(returnBorrowing(borrowingId)).unwrap();
        dispatch(fetchBorrowings()); // Refresh the list
      } catch (error) {
        console.error('Failed to return book:', error);
      } finally {
        setIsReturning(null);
      }
    }
  };

  // Filter borrowings based on search term
  const filteredBorrowings = borrowings.filter(borrowing =>
    borrowing.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.borrower?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.borrower?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrowing.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'book.title',
      header: 'Book Title',
      render: (borrowing: any) => borrowing.book?.title || 'Unknown Title',
    },
    {
      key: 'book.author',
      header: 'Author',
      render: (borrowing: any) => borrowing.book?.author || 'Unknown Author',
    },
    {
      key: 'borrower.name',
      header: 'Borrower',
      render: (borrowing: any) => borrowing.borrower?.name || 'Unknown Borrower',
    },
    {
      key: 'borrower.email',
      header: 'Email',
      render: (borrowing: any) => borrowing.borrower?.email || 'No Email',
    },
    {
      key: 'borrowDate',
      header: 'Borrow Date',
      render: (borrowing: any) =>
        new Date(borrowing.borrowDate).toLocaleDateString(),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (borrowing: any) => {
        const dueDate = new Date(borrowing.dueDate);
        const isOverdue = !borrowing.returnDate && dueDate < new Date();
        return (
          <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
            {dueDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: 'returnDate',
      header: 'Return Date',
      render: (borrowing: any) => {
        return borrowing.returnDate 
          ? new Date(borrowing.returnDate).toLocaleDateString()
          : 'Not returned';
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (borrowing: any) => {
        const statusColors = {
          'borrowed': 'bg-yellow-100 text-yellow-800',
          'returned': 'bg-green-100 text-green-800', 
          'overdue': 'bg-red-100 text-red-800'
        };
        const colorClass = statusColors[borrowing.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {borrowing.status || 'Unknown'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (borrowing: any) => {
        // Debug log to see actual status values
        console.log('Borrowing status:', borrowing.status, 'for borrowing:', borrowing.id);
        
        return (
          <div className="flex space-x-2">
            {borrowing.status === 'BORROWED' && (
            <button
              onClick={() => handleReturn(borrowing.id)}
              disabled={isReturning === borrowing.id}
              className="w-32 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReturning === borrowing.id ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Return Book</span>
                </>
              )}
            </button>
          )}
          {borrowing.status === 'RETURNED' && (
            <span className="w-32 px-3 py-1 bg-gray-100 text-gray-500 rounded text-sm flex items-center justify-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Returned</span>
            </span>
          )}
          {borrowing.status === 'OVERDUE' && (
            <button
              onClick={() => handleReturn(borrowing.id)}
              disabled={isReturning === borrowing.id}
              className="w-32 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReturning === borrowing.id ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Return (Overdue)</span>
                </>
              )}
            </button>
          )}
        </div>
        );
      },
    },
  ];

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading borrowings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => dispatch(clearError())}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              All Borrowings ({borrowings.length})
            </h2>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search borrowings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>New Checkout</span>
              </button>
              <button
                onClick={() => dispatch(fetchBorrowings())}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
        
        <DataTable
          data={filteredBorrowings}
          columns={columns}
        />
        
        {status === 'succeeded' && borrowings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No borrowings found. Click "New Checkout" to add one.
          </div>
        )}
      </div>

      {isFormOpen && (
        <BorrowingForm
          onClose={() => {
            setIsFormOpen(false);
            dispatch(fetchBorrowings()); // Refresh the list when form closes
          }}
        />
      )}
    </div>
  );
}
