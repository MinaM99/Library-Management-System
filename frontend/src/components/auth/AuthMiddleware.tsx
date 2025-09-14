'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/store';
import { checkAuth } from '@/lib/redux/slices/authSlice';

export default function AuthMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only check auth once on initial load
    if (!hasCheckedAuth && status === 'idle') {
      dispatch(checkAuth());
      setHasCheckedAuth(true);
    }
  }, [dispatch, status, hasCheckedAuth]);

  useEffect(() => {
    // Only handle navigation after we've attempted auth check
    if (!hasCheckedAuth) return;

    // Handle navigation based on auth status  
    if (status === 'succeeded' && isAuthenticated) {
      // User is authenticated, redirect away from login
      if (pathname === '/login') {
        router.replace('/');
      }
    } else if ((status === 'idle' || status === 'failed') && !isAuthenticated) {
      // Auth check completed and user is not authenticated
      if (!pathname.startsWith('/login')) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, pathname, router, status, hasCheckedAuth]);

  // Show loading state during initial auth check
  if (!hasCheckedAuth || status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
