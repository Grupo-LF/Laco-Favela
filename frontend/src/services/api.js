// frontend/src/services/api.js
const API_BASE = 'http://localhost:8000/api';

// Exemplo para o app "familias"
export const listarFamilias = async () => {
  const res = await fetch(`${API_BASE}/familias/`);
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