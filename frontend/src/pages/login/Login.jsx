// frontend/src/pages/login/Login.jsx
import React, { useState } from 'react';
import '../../styles/pages/login.css';
import {api} from '../../services/api'; // Importa seu axios configurado

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // ADICIONEI estado da senha
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ADICIONEI estado de erro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpa erro anterior
    
    try {
      // 🔥 CHAMA SUA API REAL usando axios
      const response = await api.post('/login/', {
        username: username,
        password: password
      });
      
      // Pega os dados da resposta
      const { token, tipo, nome } = response.data;
      
      // Salva o token no localStorage (seu interceptor já vai pegar automaticamente)
      localStorage.setItem('token', token);
      console.log(response.data);
      // Chama o callback do App passando o tipo e token
      onLogin(tipo, token);
      
    } catch (err) {
      // Trata erro da requisição
      const errorMessage = err.response?.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Laço Favela</h2>
        
        {/* Mostra erro se houver */}
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
              value={password} // USA O ESTADO DA SENHA
              onChange={e => setPassword(e.target.value)} // ATUALIZA SENHA
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