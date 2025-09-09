'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/redux/store';
import { hydrateAuth } from '@/lib/redux/slices/authSlice';

export default function AuthMiddleware({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate auth state from localStorage on client mount
    dispatch(hydrateAuth());
    setIsHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    // Only handle navigation after hydration is complete
    if (!isHydrated) return;

    // Handle navigation based on auth status
    if (status === 'idle') {
      // Only redirect if there's no token and not already on login page
      if (!token && !pathname.startsWith('/login')) {
        router.replace('/login');
      }
    } else if (status === 'succeeded') {
      // Only redirect if authenticated and on login page
      if (token && pathname === '/login') {
        router.replace('/');
      }
    }
    // Don't redirect on 'failed' status - let user stay on login page to retry
  }, [token, pathname, router, status, isHydrated]);

  // Show loading state during hydration or when explicitly loading
  if (!isHydrated || status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
