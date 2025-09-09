'use client';

import Layout from '@/components/layout/Layout';
import StatsCard from '@/components/dashboard/StatsCard';
import BorrowingChart from '@/components/dashboard/BorrowingChart';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
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
import { Borrowing } from '@/types/borrowing';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const books = useAppSelector((state) => state.books.items);
  const borrowers = useAppSelector((state) => state.borrowers.items);
  const borrowings = useAppSelector((state) => state.borrowings.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(fetchBooks());
    dispatch(fetchBorrowers());
    dispatch(fetchBorrowings());
  }, [dispatch]);

  const stats = useMemo(() => {
    if (!isClient) {
      // Return default values during SSR
      return [
        { title: 'Total Books', value: 0, icon: BookOpenIcon },
        { title: 'Total Borrowers', value: 0, icon: UsersIcon },
        { title: 'Active Borrowings', value: 0, icon: ClockIcon },
        { title: 'Overdue Books', value: 0, icon: ExclamationCircleIcon },
      ];
    }

    const activeBorrowings = borrowings.filter((b: any) => !b.returnDate);
    const overdueBorrowings = activeBorrowings.filter(
      (b: any) => new Date(b.dueDate) < new Date()
    );

    return [
      { title: 'Total Books', value: books.length, icon: BookOpenIcon },
      { title: 'Total Borrowers', value: borrowers.length, icon: UsersIcon },
      {
        title: 'Active Borrowings',
        value: activeBorrowings.length,
        icon: ClockIcon,
      },
      {
        title: 'Overdue Books',
        value: overdueBorrowings.length,
        icon: ExclamationCircleIcon,
      },
    ];
  }, [books, borrowers, borrowings, isClient]);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className="mt-8">
          <BorrowingChart />
        </div>
      </div>
    </Layout>
  );
}
