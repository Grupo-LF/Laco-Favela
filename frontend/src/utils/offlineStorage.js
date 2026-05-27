const STORAGE_KEY_PREFIX = 'formulario_';

export const salvarRespostaOffline = (formularioId, dados) => {
  try {
    const key = STORAGE_KEY_PREFIX + formularioId;
    localStorage.setItem(key, JSON.stringify(dados));
    return true;
  } catch (e) {
    console.error('Erro ao salvar offline:', e);
    return false;
  }
};

export const obterRespostaOffline = (formularioId) => {
  try {
    const key = STORAGE_KEY_PREFIX + formularioId;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Erro ao ler offline:', e);
    return null;
  }
};

export const removerRespostaOffline = (formularioId) => {
  try {
    const key = STORAGE_KEY_PREFIX + formularioId;
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Erro ao remover offline:', e);
    return false;
  }
};

export const listarRespostasOffline = () => {
  const respostas = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      const formularioId = key.replace(STORAGE_KEY_PREFIX, '');
      const dados = JSON.parse(localStorage.getItem(key));
      respostas.push({ formularioId, dados });
    }
  }
  return respostas;
};