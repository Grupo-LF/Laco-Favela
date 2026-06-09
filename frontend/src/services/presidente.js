import { api } from './api';

export const listarPresidentes = async () => {
  const response = await api.get('/presidentes/');
  return response.data;
};

export const cadastrarPresidente = async (dados) => {
  const response = await api.post('/presidentes/', dados);
  return response.data;
};

export const atualizarCotaPresidente = async (id, cota) => {
  const response = await api.patch(`/presidentes/${id}/`, { cota });
  return response.data;
};

export const obterPresidente = async (id) => {
  const response = await api.get(`/presidentes/${id}/`);
  return response.data;
};

export const deletarPresidente = async (id) => {
  const response = await api.delete(`/presidentes/${id}/`);
  return response.data;
};

export default {
  listarPresidentes,
  cadastrarPresidente,
  atualizarCotaPresidente,
  obterPresidente,
  deletarPresidente,
};