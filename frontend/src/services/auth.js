import { api } from './api';

export const login = async (username, password) => {
  const response = await api.post('/login/', { username, password });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('nome', response.data.nome);
    console.log('nome salvo no localStorage:', response.data.nome);

  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('nome');
};

export const getToken = () => localStorage.getItem('token');

export const getNome = () => localStorage.getItem('nome');

export const isAuthenticated = () => !!getToken();

export default { login, logout, getToken, getNome, isAuthenticated };