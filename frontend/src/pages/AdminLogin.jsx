import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGoogleLogin, adminLogin, fetchAdminSession } from '../lib/contentApi';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import './admin.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const isDark = theme === 'dark';

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        await fetchAdminSession();
        if (isMounted) {
          navigate('/admin', { replace: true });
        }
      } catch (_error) {
        // No existing session. Keep user on login page.
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!googleClientId || isCheckingSession) {
      return undefined;
    }

    let isMounted = true;

    const renderGoogleButton = () => {
      if (!isMounted || !googleButtonRef.current || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          if (!isMounted || !response?.credential) {
            return;
          }

          setError('');
          setIsGoogleLoading(true);

          try {
            await adminGoogleLogin(response.credential);
            navigate('/admin', { replace: true });
          } catch (googleError) {
            if (isMounted) {
              setError(googleError.message || 'Google sign-in failed.');
            }
          } finally {
            if (isMounted) {
              setIsGoogleLoading(false);
            }
          }
        },
      });

      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: isDark ? 'filled_black' : 'outline',
        size: 'large',
        shape: 'pill',
        width: 320,
        text: 'continue_with',
      });
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        isMounted = false;
      };
    }

    const existingScript = document.querySelector('script[data-google-signin-script="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', renderGoogleButton);
      return () => {
        isMounted = false;
        existingScript.removeEventListener('load', renderGoogleButton);
      };
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleSigninScript = 'true';
    script.addEventListener('load', renderGoogleButton);
    script.addEventListener('error', () => {
      if (isMounted) {
        setError('Failed to load Google sign-in.');
      }
    });
    document.head.appendChild(script);

    return () => {
      isMounted = false;
      script.removeEventListener('load', renderGoogleButton);
    };
  }, [googleClientId, isCheckingSession, isDark, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError('');

    try {
      await adminLogin(username.trim(), password);
      navigate('/admin', { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Failed to login.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-300"
        style={{
          background: isDark 
            ? 'linear-gradient(to bottom right, #111827, #1f2937)' 
            : 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)'
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p style={{ color: isDark ? '#9ca3af' : '#4b5563' }} className="text-sm">
            Checking session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 transition-colors duration-300"
      style={{
        background: isDark 
          ? 'linear-gradient(to bottom right, #111827, #1f2937, #111827)' 
          : 'linear-gradient(to bottom right, #f8fafc, #eff6ff, #e0e7ff)'
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.2)' }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl"
          style={{ background: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.2)' }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-xl backdrop-blur-sm transition-all shadow-sm"
        style={{
          backgroundColor: isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          color: isDark ? '#9ca3af' : '#4b5563'
        }}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur-xl transform -rotate-1"
          style={{ opacity: isDark ? 0.3 : 0.2 }}
        />
        
        <div 
          className="relative rounded-3xl shadow-2xl p-8 md:p-10 backdrop-blur-sm"
          style={{
            backgroundColor: isDark ? '#1f2937' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
          }}
        >
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg mb-4"
              style={{ backgroundColor: '#2563eb' }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: isDark ? '#ffffff' : '#111827' }}
            >
              Admin Panel
            </h1>
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }} className="text-sm">
              Sign in to access the content management system
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Username
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  style={{ color: '#9ca3af' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb',
                    border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                    color: isDark ? '#ffffff' : '#111827'
                  }}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium"
                style={{ color: isDark ? '#d1d5db' : '#374151' }}
              >
                Password
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  style={{ color: '#9ca3af' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{
                    backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : '#f9fafb',
                    border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                    color: isDark ? '#ffffff' : '#111827'
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center transition-colors"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div 
                className="flex items-center gap-2 p-3 rounded-xl text-sm animate-shake"
                style={{
                  backgroundColor: isDark ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
                  border: `1px solid ${isDark ? 'rgba(153, 27, 27, 0.5)' : '#fecaca'}`,
                  color: isDark ? '#fca5a5' : '#dc2626'
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#2563eb',
                boxShadow: isDark
                  ? '0 4px 14px rgba(37, 99, 235, 0.35)'
                  : '0 4px 14px rgba(37, 99, 235, 0.28)'
              }}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            {googleClientId && (
              <>
                <div className="relative py-1">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div
                      className="w-full"
                      style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
                    />
                  </div>
                  <div className="relative flex justify-center">
                    <span
                      className="px-3 text-xs uppercase tracking-wider"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        color: isDark ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      OR
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div ref={googleButtonRef} className="w-full flex justify-center" />
                  </div>
                  {!googleReady && (
                    <p className="text-xs text-center" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      Loading Google sign-in...
                    </p>
                  )}
                  {isGoogleLoading && (
                    <p className="text-xs text-center" style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
                      Verifying Google account...
                    </p>
                  )}
                </div>
              </>
            )}
          </form>

          {/* Footer */}
          <div 
            className="mt-8 pt-6 text-center"
            style={{ borderTop: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}
          >
            <p style={{ color: isDark ? '#6b7280' : '#9ca3af' }} className="text-xs">
              Protected area. Unauthorized access is prohibited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  return (
    <ThemeProvider>
      <LoginForm />
    </ThemeProvider>
  );
};

export default AdminLogin;
