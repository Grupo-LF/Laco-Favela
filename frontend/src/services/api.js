// frontend/src/services/api.js
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Função auxiliar para pegar o token (evita repetição)
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Token ${token}` })
  };
};

// ==================== FAMÍLIAS ====================
export const listarFamilias = async () => {
  const res = await fetch(`${API_BASE}/familias/`);
  if (!res.ok) throw new Error('Erro ao listar famílias');
  return res.json();
};

export const criarFamilia = async (dados) => {
  const res = await fetch(`${API_BASE}/familias/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error('Erro ao criar família');
  return res.json();
};

// ==================== PRESIDENTES ====================
export const listarPresidentes = async () => {
  const res = await fetch(`${API_BASE}/presidentes/`, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Erro ao listar presidentes');
  return res.json();
};

export const cadastrarPresidente = async (dados) => {
  const res = await fetch(`${API_BASE}/presidentes/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(JSON.stringify(errorData));
  }
  return res.json();
};

export const atualizarCotaPresidente = async (id, novaCota) => {
  const res = await fetch(`${API_BASE}/presidentes/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ cota: novaCota })
  });
  if (!res.ok) {
    const erro = await res.json();
    throw new Error(JSON.stringify(erro));
  }
  return res.json();
};

// ==================== CICLOS (FORMULÁRIOS) ====================
export const listarCiclos = async () => {
  const res = await fetch(`${API_BASE}/ciclos/`);
  if (!res.ok) throw new Error('Erro ao listar ciclos');
  return res.json();
};

export const enviarRespostaCiclo = async (respostas) => {
  const res = await fetch(`${API_BASE}/respostas-ciclo/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(respostas),
  });
  if (!res.ok) throw new Error('Erro ao enviar respostas');
  return res.json();
};
// ===== NOVOS ENDPOINTS DE FORMULÁRIOS =====

/**
 * Lista todos os ciclos disponíveis.
 * @returns {Promise<Array>} Lista de ciclos.
 */
export const getCiclos = async () => {
  const response = await api.get('/ciclos');
  return response.data;
};

/**
 * Lista todos os formulários de um ciclo específico.
 * @param {string|number} cicloId - ID do ciclo.
 * @returns {Promise<Array>} Lista de formulários.
 */
export const getFormulariosDoCiclo = async (cicloId) => {
  const response = await api.get(`/ciclos/${cicloId}/formularios`);
  return response.data;
};

/**
 * Obtém os detalhes de um formulário específico.
 * @param {string|number} formularioId - ID do formulário.
 * @returns {Promise<Object>} Dados do formulário.
 */
export const getFormulario = async (formularioId) => {
  const response = await api.get(`/formularios/${formularioId}`);
  return response.data;
};

/**
 * Envia a resposta de um formulário.
 * @param {string|number} formularioId - ID do formulário.
 * @param {Object} dados - Dados da resposta.
 * @returns {Promise<Object>} Resposta do servidor.
 */
export const submitResposta = async (formularioId, dados) => {
  const response = await api.post(`/formularios/${formularioId}/respostas`, dados);
  return response.data;
};

// ==================== EXPORTS PADRÃO ====================
export default {

  listarFamilias,
  criarFamilia,
  listarPresidentes,
  cadastrarPresidente,
  atualizarCotaPresidente,
  listarCiclos,
  enviarRespostaCiclo,
  // NOVOS ENDPOINTS
  getCiclos,
  getFormulariosDoCiclo,
  getFormulario,
  submitResposta

};
//Novos endpoints para ciclos e respostas
