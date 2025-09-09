'use client';

import Layout from '@/components/layout/Layout';
import BorrowersList from '@/components/borrowers/BorrowersList';

export default function BorrowersPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Borrowers Management</h1>
        <BorrowersList />
      </div>
    </Layout>
  );
}
