// frontend/src/pages/login/Login.jsx
import React, { useState } from 'react';
import '../../styles/pages/login.css';
import {api} from '../../services/api'; // Importa seu axios configurado

function Login({ onLogin, handleLoginTest }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // ADICIONEI estado da senha
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // ADICIONEI estado de erro
  const [testMode, setTestMode] = useState(false); // MODO TESTE
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // MODO TESTE ATIVO
    if (testMode) {
      setLoading(true);
      setError('');
      
      // Verifica se o usuário digitou "presidente"
      if (username.toLowerCase() === 'presidente') {
        handleLoginTest('presidente');
        return;
      }
      
      // Verifica se o usuário digitou "admin"
      if (username.toLowerCase() === 'admin') {
        handleLoginTest('admin');
        return;
      }
      if (username.toLowerCase() === 'morador') {
        handleLoginTest('morador');
        return;
      }
      
      // Se não for presidente nem admin, mostra erro
      setError('Acesso negado. Apenas "presidente" ou "admin" ou "morador" têm permissão no modo teste.');
      setLoading(false);
      return;
    }
    
    // MODO NORMAL (original)
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
        {/* BOTÃO TOGGLE - MODO TESTE */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          marginBottom: '20px',
          gap: '8px',
          easeInOut: '0.3s'
             }}>
          <span style={{ fontWeight: 'bold', color: testMode ? '#f97316' : '#fcd523' }}>
            Modo Teste
          </span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
            <input 
              type="checkbox" 
              checked={testMode}
              onChange={(e) => {
                setTestMode(e.target.checked);
                setError('');
              }}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: testMode ? '#f97316' : '#ccc',
              transition: '0.3s',
              borderRadius: '34px'
            }}>
              <span style={{
                position: 'absolute',
                content: "",
                height: '18px',
                width: '18px',
                left: '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '0.3s',
                borderRadius: '50%',
                transform: testMode ? 'translateX(26px)' : 'translateX(0)'
              }}></span>
            </span>
          </label>
        </div>
 
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
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required={!testMode} // Senha não é obrigatória no modo teste
            />
          </div>
                  
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : testMode ? 'Testar' : 'Entrar'}
          </button>
        </form>
        
        {/* Mensagem indicando como usar o modo teste */}
        {testMode && (
          <p style={{ fontSize: '12px', color: '#f97316', textAlign: 'center', marginTop: '15px' }}>
            💡 Modo teste: digite "presidente" ou "admin" ou "morador" no campo USUÁRIO
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;