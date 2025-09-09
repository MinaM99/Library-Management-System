'use client';

import Layout from '@/components/layout/Layout';
import BorrowingsList from '@/components/borrowings/BorrowingsList';

export default function BorrowingsPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Borrowing Management</h1>
        <BorrowingsList />
      </div>
    </Layout>
  );
}
