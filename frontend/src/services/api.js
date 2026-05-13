import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Famílias
export const listarFamilias = () => api.get('/familias/');
export const criarFamilia = (dados) => api.post('/familias/', dados);

// Ciclos
export const listarCiclos = () => api.get('/ciclos/');
export const enviarRespostaCiclo = (respostas) => api.post('/respostas-ciclo/', respostas);

// Presidentes
export const cadastrarPresidente = (dados) => api.post('/presidentes/', dados);

export default api;