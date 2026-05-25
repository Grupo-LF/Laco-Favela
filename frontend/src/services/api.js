// frontend/src/services/api.js
const API_BASE = 'http://localhost:8000/api';

// Exemplo para o app "familias"
export const listarFamilias = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, value);
    }
  });
  const query = queryParams.toString();
  const url = query ? `${API_BASE}/familias/?${query}` : `${API_BASE}/familias/`;
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData));
  }
  return res.json();
};

export const obterFamilia = async (id) => {
  const res = await fetch(`${API_BASE}/familias/${id}/`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData));
  }
  return res.json();
};

export const atualizarStatusFamilia = async (id, statusValue) => {
  const res = await fetch(`${API_BASE}/familias/${id}/set-status/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: statusValue }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData));
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

export const listarRespostasPorFamilia = async (familiaId) => {
  const res = await fetch(`${API_BASE}/respostas/?familia=${familiaId}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(JSON.stringify(errorData));
  }
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

export const cadastrarPresidente = async (respostas) => {
  const token = localStorage.getItem('token');
  // Para fins de testes locais, enquanto o login ainda não existe e o admin não é um superuser,
  // adicione um token de superuser manualmente na linha a seguir e a descomente:
  // const token = "insira_token_aqui"
  const res = await fetch(`${API_BASE}/presidentes/`, {
    method: 'POST',
    headers: {
      'Content-Type': `application/json`,
      'Authorization': `Token ${token}`
     },
    body: JSON.stringify(respostas),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData)); 
  }

  return res.json();
};