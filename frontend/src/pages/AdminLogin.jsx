import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, fetchAdminSession } from '../lib/contentApi';
import './admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

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

  return (
    <div className="admin-auth-page min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="admin-auth-card w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6">
          Access the internal content management panel.
        </p>

        <form onSubmit={handleSubmit} className="admin-auth-form space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="admin-auth-submit w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400 text-white rounded-lg py-2.5 font-semibold transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
