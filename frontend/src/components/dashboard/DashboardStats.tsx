'use client';

import { useAppSelector, useAppDispatch } from '@/lib/redux/store';
import {
  BookOpenIcon,
  UsersIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState, useMemo } from 'react';
import { fetchBooks } from '@/lib/redux/slices/booksSlice';
import { fetchBorrowers } from '@/lib/redux/slices/borrowersSlice';
import { fetchBorrowings } from '@/lib/redux/slices/borrowingsSlice';
import { RootState } from '@/lib/redux/store';

const stats = [
  { name: 'Total Books', icon: BookOpenIcon },
  { name: 'Total Borrowers', icon: UsersIcon },
  { name: 'Active Borrowings', icon: ClockIcon },
  { name: 'Overdue Books', icon: ExclamationCircleIcon },
];

export default function DashboardStats() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state: RootState) => state.books.items);
  const borrowers = useAppSelector((state: RootState) => state.borrowers.items);
  const borrowings = useAppSelector((state: RootState) => state.borrowings.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchBooks());
    dispatch(fetchBorrowers());
    dispatch(fetchBorrowings());
  }, [dispatch]);

  const values = useMemo(() => {
    if (!isClient) {
      // Return default values during SSR
      return [0, 0, 0, 0];
    }

    const activeBorrowings = borrowings.filter((b: { returnDate?: string }) => !b.returnDate);
    const overdueBorrowings = activeBorrowings.filter(
      (b: { dueDate: string }) => new Date(b.dueDate) < new Date()
    );

    return [
      books.length,
      borrowers.length,
      activeBorrowings.length,
      overdueBorrowings.length,
    ];
  }, [books, borrowers, borrowings, isClient]);

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {values[index]}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
