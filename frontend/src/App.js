// App.js
import React, { useState } from 'react';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import AppMorador from './AppMorador';
import Login from './pages/login/Login';

function App(onLogin) {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipo'));

  const handleLogin = (tipo, token,nome) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    localStorage.setItem('nome', nome); // Supondo que o nome seja retornado como token, ajuste conforme necessário
    setTipoUsuario(tipo);
  };  
  const handleLoginTest = (tipo) => {
    localStorage.setItem('tipo', tipo);
    console.log('Tipo de usuário salvo no localStorage (modo teste):', tipo);
    setTipoUsuario(tipo);
  }
  // Se não tem tipo, mostra login
  if (!tipoUsuario) return <Login onLogin={handleLogin} handleLoginTest={handleLoginTest} />;

  // Se tem tipo, mostra app correspondente
  if (tipoUsuario === 'morador') return <AppMorador />;
  if (tipoUsuario === 'admin') return <AppAdmin />;
  if (tipoUsuario === 'presidente') return <AppPresidente />;
}

export default App;