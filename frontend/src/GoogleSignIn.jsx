import React, { useEffect, useState } from 'react';

export default function GoogleSignIn({ onAuth }) {
  const [userTokens, setUserTokens] = useState(null);

  useEffect(() => {
    function handleMessage(e) {
      if (e.data?.type === 'google_oauth' && e.data.tokens) {
        setUserTokens(e.data.tokens);
        if (onAuth) onAuth(e.data.tokens);
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onAuth]);

  const startAuth = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/google/auth_url');
      const { auth_url } = await res.json();
      window.open(auth_url, 'google_oauth', 'width=600,height=700');
    } catch (err) {
      console.error('Auth start failed', err);
    }
  };

  const signOut = () => {
    setUserTokens(null);
    if (onAuth) onAuth(null);
    localStorage.removeItem('google_tokens');
  };

  useEffect(() => {
    if (userTokens) localStorage.setItem('google_tokens', JSON.stringify(userTokens));
  }, [userTokens]);

  return (
    <div className="google-signin">
      {userTokens ? (
        <div className="signed-in">
          <span>Google connected</span>
          <button onClick={signOut} className="small-btn">Sign out</button>
        </div>
      ) : (
        <button onClick={startAuth} className="google-btn">Sign in with Google</button>
      )}
    </div>
  );
}
