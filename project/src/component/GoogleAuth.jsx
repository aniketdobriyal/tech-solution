import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleAuth = ({ onLoginSuccess }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSuccess = async (response) => {
    setLoading(true);
    
    const googleToken = response.access_token; // Retrieve access_token here

    if (!googleToken) {
      setError('Google token is missing');
      setLoading(false);
      return;
    }

    try {
      // Fetch user information from Google's API using the access token
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${googleToken}` },
      });
      const userInfo = await userInfoResponse.json();

      // Save the token and user info in local storage
      localStorage.setItem('token', googleToken);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);

      // Call onLoginSuccess if provided
      if (onLoginSuccess) {
        onLoginSuccess(userInfo);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleSuccess,
    flow: 'implicit',
    scope: 'openid profile email',
    onError: (error) => {
      console.error('Google Sign-In Failed:', error);
      setError('Google Sign-In Failed');
    },
  });

  return (
    <div>
      {user ? (
        <div>
          <button onClick={googleLogin} className="my-custom-google-button">
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <button onClick={googleLogin} className="my-custom-google-button">
            Sign in with Google
          </button>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default GoogleAuth;
