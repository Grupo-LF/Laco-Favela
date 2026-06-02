import { api, getHeaders } from './api';

export const listarFamilias = async (params = {}) => {
  const response = await api.get('/familias/', { params });
  return response.data;
};

export const obterFamilia = async (id) => {
  const response = await api.get(`/familias/${id}/`);
  return response.data;
};

export const criarFamilia = async (dados) => {
  const response = await api.post('/familias/', dados);
  return response.data;
};

export const atualizarStatusFamilia = async (id, status) => {
  const response = await api.patch(`/familias/${id}/set-status/`, { status });
  return response.data;
};

export const listarRespostasPorFamilia = async (familiaId) => {
  const response = await api.get(`/respostas/?familia=${familiaId}`);
  return response.data;
};

export default {
  listarFamilias,
  obterFamilia,
  criarFamilia,
  atualizarStatusFamilia,
  listarRespostasPorFamilia,
};