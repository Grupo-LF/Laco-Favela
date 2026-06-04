import { api } from './api';

export const listarCiclos = async () => {
  const response = await api.get('/ciclos/');
  return response.data;
};

export const getCiclos = async () => {
  const response = await api.get('/ciclos');
  return response.data;
};

export const getFormulariosDoCiclo = async (cicloId) => {
  const response = await api.get(`/ciclos/${cicloId}/formularios`);
  return response.data;
};

export const getFormulario = async (formularioId) => {
  const response = await api.get(`/formularios/${formularioId}`);
  return response.data;
};

export const submitResposta = async (formularioId, dados) => {
  const response = await api.post(`/formularios/${formularioId}/respostas`, dados);
  return response.data;
};

export const enviarRespostaCiclo = async (respostas) => {
  const response = await api.post('/respostas-ciclo/', respostas);
  return response.data;
};

export default {
  listarCiclos,
  getCiclos,
  getFormulariosDoCiclo,
  getFormulario,
  submitResposta,
  enviarRespostaCiclo,
};