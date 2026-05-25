import React, { useState } from 'react';
import '../../styles/pages/login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    
    try {
      // Usando o fetch nativo ao invés do api.post do Axios
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Usuário ou senha incorretos.');
      }

      const data = await response.json();
      
      // O fetch não tem o '.data' automático do Axios, então acessamos o 'data' diretamente
      onLogin(data.tipo, data.token); 

    } catch (err) {
      setErro('Usuário ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Laço Favela</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Usuário</label>
            <input
              type="text"
              className="input-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              className="input-full"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {erro && <p className="login-error">{erro}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;