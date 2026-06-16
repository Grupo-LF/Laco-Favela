import { api, syncOffline, getOfflineStatus, clearOldOfflineRequests } from './axiosOffline';

// Re-exportar tudo
export { api, syncOffline, getOfflineStatus, clearOldOfflineRequests };
export const API_BASE = api.defaults.baseURL;

// Função auxiliar para headers (mantida compatibilidade)
export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Token ${token}` }),
  };
};

export default api;