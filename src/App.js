import React from 'react';
import AuthPage from './auth/AuthPage.jsx';
import HomePage from './homepage/HomePage.jsx';


function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token ? <HomePage /> : <AuthPage />}
    </div>
  );
}
export default App;
