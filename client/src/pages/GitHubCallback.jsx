import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      
      if (errorParam) {
        setStatus('error');
        setError(searchParams.get('error_description') || 'GitHub login was cancelled');
        return;
      }

      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        const response = await api.post('/auth/github', { code });
        const { user, token } = response.data.data;
        
        // Store auth data
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        
        toast.success(`Welcome, ${user.name}!`);
        
        // Redirect to stored path or default
        const redirectPath = sessionStorage.getItem('oauth_redirect');
        sessionStorage.removeItem('oauth_redirect');
        
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          switch (user.role) {
            case 'admin':
              navigate('/admin');
              break;
            case 'charity':
              navigate('/charity');
              break;
            default:
              navigate('/donor');
          }
        }
      } catch (err) {
        console.error('GitHub callback error:', err);
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to complete GitHub login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setToken]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
        <div className="text-center">
          <Logo className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Login Failed</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <Logo className="h-16 w-16 mx-auto mb-4 animate-pulse" />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Completing GitHub Login...
        </h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    </div>
  );
};

export default GitHubCallback;
