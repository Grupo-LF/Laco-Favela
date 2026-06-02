import { api } from './api';

export const login = async (username, password) => {
  const response = await api.post('/login/', { username, password });
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export default { login, logout, getToken, isAuthenticated };