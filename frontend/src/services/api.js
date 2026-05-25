// frontend/src/services/api.js
const API_BASE = 'http://localhost:8000/api';

// Exemplo para o app "familias"
export const listarFamilias = async () => {
  const res = await fetch(`${API_BASE}/familias/`);
  return res.json();
};

<<<<<<< HEAD

export const listarPresidentes = async () => {
=======
<<<<<<< HEAD
api.interceptors.request.use((config) => {
>>>>>>> 7d8d8cc3 (add gerenciamento de cotas e lista de presidentes)
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/`, { // Aponta para a rota de ListCreate
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  if (!res.ok) throw new Error('Erro ao listar presidentes');
  return res.json();
};

export const cadastrarPresidente = async (dados) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/`, { // POST na mesma rota base
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData)); 
  }
  return res.json();
};

export const atualizarCotaPresidente = async (id, novaCota) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/${id}/`, { // Aponta para AtualizarCotaView
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({ cota: novaCota })
  });
  if (!res.ok) {
    const erro = await res.json();
    throw new Error(JSON.stringify(erro));
  }
  return res.json();
};

export const criarFamilia = async (dados) => {
  const res = await fetch(`${API_BASE}/familias/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return res.json();
};

// Exemplo para o app "formularios" (Ciclo de coleta)
export const listarCiclos = async () => {
  const res = await fetch(`${API_BASE}/ciclos/`);
  return res.json();
};

export const enviarRespostaCiclo = async (respostas) => {
  const res = await fetch(`${API_BASE}/respostas-ciclo/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(respostas),
  });
  return res.json();
};

<<<<<<< HEAD
=======
export default api;
=======

export const listarPresidentes = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/`, { // Aponta para a rota de ListCreate
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  if (!res.ok) throw new Error('Erro ao listar presidentes');
  return res.json();
};

export const cadastrarPresidente = async (dados) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/`, { // POST na mesma rota base
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData)); 
  }
  return res.json();
};

export const atualizarCotaPresidente = async (id, novaCota) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/presidentes/${id}/`, { // Aponta para AtualizarCotaView
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify({ cota: novaCota })
  });
  if (!res.ok) {
    const erro = await res.json();
    throw new Error(JSON.stringify(erro));
  }
  return res.json();
};

export const criarFamilia = async (dados) => {
  const res = await fetch(`${API_BASE}/familias/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return res.json();
};

// Exemplo para o app "formularios" (Ciclo de coleta)
export const listarCiclos = async () => {
  const res = await fetch(`${API_BASE}/ciclos/`);
  return res.json();
};

export const enviarRespostaCiclo = async (respostas) => {
  const res = await fetch(`${API_BASE}/respostas-ciclo/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(respostas),
  });
  return res.json();
};

>>>>>>> 157fe02d (add gerenciamento de cotas e lista de presidentes)
>>>>>>> 7d8d8cc3 (add gerenciamento de cotas e lista de presidentes)
