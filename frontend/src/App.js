// App.js
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import AppMorador from './AppMorador';
import Login from './pages/login/Login';

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipo'));

  const handleLogin = (tipo, token, nome) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tipo', tipo);
    localStorage.setItem('nome', nome);
    setTipoUsuario(tipo);
  };

  return (
    <BrowserRouter>
      {!tipoUsuario && <Login onLogin={handleLogin} />}
      {tipoUsuario === 'morador' && <AppMorador />}
      {tipoUsuario === 'admin' && <AppAdmin />}
      {tipoUsuario === 'presidente' && <AppPresidente />}
    </BrowserRouter>
  );
}

export default App;