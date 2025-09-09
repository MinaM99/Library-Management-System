'use client';

import Layout from '@/components/layout/Layout';
import BooksList from '@/components/books/BooksList';

export default function BooksPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Books Management</h1>
        <BooksList />
      </div>
    </Layout>
  );
}
