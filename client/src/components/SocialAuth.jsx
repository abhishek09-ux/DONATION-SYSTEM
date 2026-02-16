import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiGithub } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SocialAuth = ({ mode = 'login' }) => {
  const [loading, setLoading] = useState({
    google: false,
    github: false,
    facebook: false
  });
  const [oauthConfig, setOauthConfig] = useState(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch OAuth configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/auth/oauth/config');
        setOauthConfig(response.data.data);
      } catch (error) {
        console.error('Failed to fetch OAuth config:', error);
      }
    };
    fetchConfig();
  }, []);

  // Load Google Identity Services script
  useEffect(() => {
    if (!oauthConfig?.google?.enabled || googleLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      // Initialize Google Sign-In
      window.google?.accounts?.id?.initialize({
        client_id: oauthConfig.google.clientId,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [oauthConfig]);

  // Handle successful login redirect
  const handleSuccessRedirect = (user) => {
    const from = location.state?.from?.pathname;
    if (from) {
      navigate(from);
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
  };

  // Google OAuth callback
  const handleGoogleCallback = async (response) => {
    setLoading(prev => ({ ...prev, google: true }));
    
    try {
      const result = await api.post('/auth/google', {
        credential: response.credential,
        clientId: oauthConfig?.google?.clientId
      });

      const { user, token } = result.data.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      toast.success(`Welcome${mode === 'login' ? ' back' : ''}, ${user.name}!`);
      handleSuccessRedirect(user);
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  // Trigger Google Sign-In
  const handleGoogleLogin = () => {
    if (!googleLoaded || !window.google) {
      toast.error('Google Sign-In is loading. Please try again.');
      return;
    }
    
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        // Fallback: Use button render
        const container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
        
        window.google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: 'outline',
          size: 'large'
        });
        
        // Click the hidden button
        const button = container.querySelector('div[role="button"]');
        if (button) button.click();
        
        setTimeout(() => container.remove(), 1000);
      }
    });
  };

  // GitHub OAuth
  const handleGitHubLogin = () => {
    if (!oauthConfig?.github?.enabled) {
      toast.error('GitHub login is not configured');
      return;
    }

    setLoading(prev => ({ ...prev, github: true }));
    
    const clientId = oauthConfig.github.clientId;
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    
    // Store redirect info for callback
    sessionStorage.setItem('oauth_redirect', location.state?.from?.pathname || '');
    
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  };

  // Facebook OAuth
  const handleFacebookLogin = async () => {
    if (!oauthConfig?.facebook?.enabled) {
      toast.error('Facebook login is not configured');
      return;
    }

    setLoading(prev => ({ ...prev, facebook: true }));

    try {
      // Load Facebook SDK if not loaded
      if (!window.FB) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/sdk.js';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            window.FB.init({
              appId: oauthConfig.facebook.appId,
              cookie: true,
              xfbml: true,
              version: 'v18.0'
            });
            resolve();
          };
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Trigger Facebook login
      window.FB.login(async (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          
          try {
            const result = await api.post('/auth/facebook', {
              accessToken,
              userID
            });

            const { user, token } = result.data.data;
            
            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            
            toast.success(`Welcome${mode === 'login' ? ' back' : ''}, ${user.name}!`);
            handleSuccessRedirect(user);
          } catch (error) {
            console.error('Facebook auth error:', error);
            toast.error(error.response?.data?.message || 'Facebook login failed');
          }
        } else {
          toast.error('Facebook login was cancelled');
        }
        setLoading(prev => ({ ...prev, facebook: false }));
      }, { scope: 'email,public_profile' });
    } catch (error) {
      console.error('Facebook SDK error:', error);
      toast.error('Failed to load Facebook login');
      setLoading(prev => ({ ...prev, facebook: false }));
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Login */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading.google || !oauthConfig?.google?.enabled}
        className="w-full py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.google ? (
          <div className="spinner w-5 h-5" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* GitHub Login */}
      <button
        type="button"
        onClick={handleGitHubLogin}
        disabled={loading.github || !oauthConfig?.github?.enabled}
        className="w-full py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.github ? (
          <div className="spinner w-5 h-5" />
        ) : (
          <FiGithub className="w-5 h-5" />
        )}
        <span>Continue with GitHub</span>
      </button>

      {/* Facebook Login */}
      <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={loading.facebook || !oauthConfig?.facebook?.enabled}
        className="w-full py-3 px-4 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading.facebook ? (
          <div className="spinner w-5 h-5" />
        ) : (
          <FaFacebook className="w-5 h-5 text-[#1877F2]" />
        )}
        <span>Continue with Facebook</span>
      </button>

      {/* Configuration Notice */}
      {oauthConfig && !oauthConfig.google?.enabled && !oauthConfig.github?.enabled && !oauthConfig.facebook?.enabled && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Social login is not configured. Contact administrator.
        </p>
      )}
    </div>
  );
};

export default SocialAuth;
