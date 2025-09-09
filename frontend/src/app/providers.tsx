'use client';

import { Provider } from 'react-redux';
import { store } from '../lib/redux/store';
import AuthMiddleware from '@/components/auth/AuthMiddleware';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthMiddleware>{children}</AuthMiddleware>
    </Provider>
  );
}
