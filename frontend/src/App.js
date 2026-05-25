import React, { useState } from 'react';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import Login from './pages/login/Login';

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipo'));

  const handleLogin = (tipo, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    setTipoUsuario(tipo);
  };

  if (!tipoUsuario) return <Login onLogin={handleLogin} />;
  if (tipoUsuario === 'admin') return <AppAdmin />;
  if (tipoUsuario === 'presidente') return <AppPresidente />;
}

export default App;