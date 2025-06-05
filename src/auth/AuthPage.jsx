import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';


function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://127.0.0.1:8000/api/login/' : 'http://127.0.0.1:8000/api/register/';
    try {
      const response = await axios.post(url, { username, password });
      const token = response.data.access_token;
      localStorage.setItem('token', token);
      setMessage('Регистрация успешна!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Ошибка: Пользователь не найден');
    }
  };

  return (
    <div className='form-container-wrapper'>
        <div className='form-container'>
        <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <p>
        {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
      {message && <p>{message}</p>}
        </div>
    </div>
  );
}

export default AuthPage;
