import React, { useState } from 'react';
import AppAdmin from './AppAdmin';
import AppPresidente from './AppPresidente';
import Login from './pages/login/Login';

function App() {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  if (!tipoUsuario) return <Login onLogin={setTipoUsuario} />;
  if (tipoUsuario === 'admin') return <AppAdmin />;
  if (tipoUsuario === 'presidente') return <AppPresidente />;
}

export default App;