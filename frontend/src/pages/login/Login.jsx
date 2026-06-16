import React, { useState } from 'react';
import '../../styles/pages/login.css';
import {api} from '../../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login/', {
        username: username,
        password: password
      });

      const { token, tipo, nome } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('nome', nome);
      onLogin(tipo, token, nome);

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Laço Favela</h2>

        {error && (
          <p className="text-center" style={{ fontSize: '13px', color: '#e74c3c', marginBottom: '1rem' }}>
            ❌ {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Usuário: </label>
            <input
              type="text"
              className="input-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="login-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Senha: </label>
            <input
              type="password"
              className="input-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
