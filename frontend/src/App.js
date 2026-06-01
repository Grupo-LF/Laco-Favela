// App.js
import React, { useState } from 'react';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import Login from './pages/login/Login';

function App(onLogin) {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipo'));

  const handleLogin = (tipo, token) => {
    localStorage.setItem('token', token);
    console.log('Token salvo no localStorage:', token);
    localStorage.setItem('tipo', tipo);
    console.log('Tipo de usuário salvo no localStorage:', tipo);
    setTipoUsuario(tipo);
  };  

  // Se não tem tipo, mostra login
  if (!tipoUsuario) return <Login onLogin={handleLogin} />;

  // Se tem tipo, mostra app correspondente
  if (tipoUsuario === 'admin') return <AppAdmin />;
  if (tipoUsuario === 'presidente') return <AppPresidente />;
}

export default App;