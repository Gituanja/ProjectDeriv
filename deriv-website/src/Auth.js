import React, { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

const Auth = () => {
  const authService = useContext(AuthContext);  // Use AuthContext to access authService

  const handleLogin = () => {
    authService.authorize();
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div>
      {authService.isAuthenticated() ? (
        <>
          <p>Logged in as: {authService.getUser()?.name || 'User'}</p> {/* Fallback if no user name */}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Deriv</button>
      )}
    </div>
  );
};

export default Auth;
