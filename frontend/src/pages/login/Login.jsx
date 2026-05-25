import React, { useState } from 'react';
import '../../styles/pages/login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 🔓 ENTRA COM QUALQUER COISA
    setTimeout(() => {
      const tipoUsuario = username === 'admin' ? 'admin' : 'presidente';
      onLogin(tipoUsuario, 'token-temporario');
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Laço Favela</h2>
        <p className="text-center" style={{ fontSize: '13px', color: '#f39c12', marginBottom: '1rem' }}>
          ⚠️ MODO TESTE - Login automático
        </p>
        <form onSubmit={handleSubmit}  >
          <div className="login-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label >Usuário: </label>
            <input
            
              type="text"
              className="input-full"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite qualquer nome"
              required
            />
          </div>
          <div className="login-field" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label>Senha: </label>
            <input
              type="password"
              className="input-full"
              placeholder="Qualquer senha (modo teste)"
              value=""
              onChange={() => {}}
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar (Modo Teste)'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;