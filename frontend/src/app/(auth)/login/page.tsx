'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { login, clearError } from '@/lib/redux/slices/authSlice';

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-5 rounded-lg flex items-center space-x-4">
      <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-gray-700">Authenticating...</span>
    </div>
  </div>
);

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated && status === 'succeeded') {
      router.replace('/');
    }
  }, [isAuthenticated, status, router]);

  // Set local error when auth error occurs, but don't auto-clear
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
    // Only clear localError if error is cleared externally
    if (!error && localError) {
      setLocalError(null);
    }
  }, [error, localError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing new values
    if (localError) {
      setLocalError(null);
      dispatch(clearError());
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;

    // Clear any existing errors before new attempt
    if (error) {
      dispatch(clearError());
    }

    // Dispatch login action
    dispatch(login({
      email: formData.email,
      password: formData.password
    }));
  };

  const dismissError = () => {
    setLocalError(null);
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {status === 'loading' && <LoadingOverlay />}
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md px-8 py-12 bg-white rounded-2xl shadow-lg relative z-10">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            <span className="block">Library</span>
            <span className="block text-blue-600">Management System</span>
          </h1>
          <p className="text-gray-500 text-sm">Welcome back, please sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-gray-800 text-sm placeholder-gray-400 ${
                  error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 text-gray-800 text-sm placeholder-gray-400 ${
                  error 
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                }`}
              />
            </div>
          </div>

          <div 
            className={`transition-all duration-500 ease-in-out ${
              localError ? 'opacity-100 translate-y-0 max-h-32' : 'opacity-0 -translate-y-4 max-h-0'
            } overflow-hidden mb-4`}
          >
            {localError && (
              <div className="w-full p-4 rounded-lg bg-red-200 border border-red-500 border-l-8 border-l-red-700 flex items-start space-x-3 shadow-lg animate-pulse">
                <svg className="h-6 w-6 text-red-700 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-900 font-bold text-base">{localError}</p>
                  <p className="text-red-700 text-xs mt-1 font-semibold">Please check your credentials and try again.</p>
                </div>
                <button
                  type="button"
                  onClick={dismissError}
                  className="text-red-600 hover:text-red-900 focus:outline-none focus:text-red-900 transition-colors duration-200"
                  aria-label="Dismiss error"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all duration-200 
              ${status === 'loading' 
                ? 'bg-blue-500 cursor-not-allowed' 
                : 'hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {status === 'loading' ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14"/>
                </svg>
                <span>Sign in</span>
              </div>
            )}
          </button>

          <div className="relative mt-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative">
              <span className="px-4 text-sm text-gray-500 bg-white">
                <span className="text-gray-700">Library</span>{' '}
                <span className="text-blue-600">Management System</span>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
