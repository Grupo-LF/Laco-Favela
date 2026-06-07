import { api } from './api';
import { getToken } from './auth';

// ========== FUNÇÃO AUXILIAR ==========
const authRequest = async (method, url, data = null) => {
  getToken();
  const response = await api({ method, url, data });
  return response.data;
};

// ========== FUNÇÕES DE CICLOS (FORMULÁRIOS) ==========
export const listarCiclos = async () => {
  getToken();
  const response = await api.get('/ciclos/');
  return response.data;
};

export const getCiclos = async () => {
  getToken();
  const response = await api.get('/ciclos');
  return response.data;
};

export const getCicloDetalhado = async (cicloId) => {
  getToken();
  const response = await api.get(`/ciclos/${cicloId}/`);
  console.log('Resposta da API para ciclo detalhado:', response.data);
  return response.data;
};

// ========== FUNÇÕES DE RESPOSTAS ==========
export const getFormulariosDoCiclo = async (cicloId) => {
  getToken();
  const response = await api.get(`/respostas/?ciclo=${cicloId}`);
  console.log('Resposta da API para respostas:', response.data);
  return { respostas: response.data };
  
};

export const submitResposta = async (formularioId, dados) => {
  getToken();
  const response = await api.post(`/formularios/${formularioId}/respostas`, dados);
  return response.data;
};

export const enviarRespostaCiclo = async (respostas) => {
  getToken();
  const response = await api.post('/respostas/', respostas);
  return response.data;
};

// ========== FUNÇÕES PARA ASSOCIAR PRESIDENTES ==========
// Associar presidentes a um ciclo EXISTENTE
export const associarPresidentesAoCiclo = async (cicloId, presidentesIds) => {
  getToken();
  const promises = presidentesIds.map(presidenteId => 
    api.post('/respostas/', {
      ciclo: cicloId,
      presidente: presidenteId,
      familia: null,
      status: 'pendente',
      observacao: ''
    })
  );
  const results = await Promise.all(promises);
  return results.map(r => r.data);
};

// ========== FUNÇÃO PARA CRIAR FORMULÁRIO ==========
const mapTipo = (tipo) => {
  const tipos = {
    'Resposta Aberta': 'texto',
    'Resposta Única': 'selecao_unica',
    'Múltipla Escolha': 'selecao_multipla'
  };
  return tipos[tipo] || 'texto';
};

const formatarPrazo = () => {
  const hoje = new Date();
  const prazo = new Date(hoje);
  prazo.setMonth(prazo.getMonth() + 1);
  
  const ano = prazo.getFullYear();
  const mes = String(prazo.getMonth() + 1).padStart(2, '0');
  const dia = String(prazo.getDate()).padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
};

const formatarPerguntas = (perguntas) => {
  return perguntas.map((p, idx) => {
    const perguntaData = {
      texto: p.texto,
      tipo: mapTipo(p.tipo),
      obrigatoria: true,
      ordem: idx
    };

    if (p.tipo === 'Resposta Única' || p.tipo === 'Múltipla Escolha') {
      perguntaData.opcoes = p.opcoes.map((opcao, opIdx) => ({
        texto: opcao,
        ordem: opIdx
      }));
    }

    return perguntaData;
  });
};

export const criarCiclo = async (dados) => {
  getToken();
  
  const dadosParaEnviar = {
    titulo: dados.titulo,
    descricao: dados.descricao,
    prazo: formatarPrazo(),
    perguntas: formatarPerguntas(dados.perguntas)
  };

  // ========== ADICIONA OS PRESIDENTES SE TIVER ==========
  if (dados.presidentes_ids && dados.presidentes_ids.length > 0) {
    dadosParaEnviar.presidentes_ids = dados.presidentes_ids;
  }

  console.log('Dados enviados para API:', JSON.stringify(dadosParaEnviar, null, 2));

  try {
    const response = await api.post('/ciclos/', dadosParaEnviar);
    console.log('Resposta da API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro detalhado da API:', error.response?.data);
    throw error;
  }
};

export const publicarCiclo = async (cicloId) => {
  getToken();
  const response = await api.post(`/ciclos/${cicloId}/publish/`);
  return response.data;
};

// ========== FUNÇÕES DE PRESIDENTES ==========
export const listarPresidentes = async () => {
  getToken();
  const response = await api.get('/presidentes/');
  return response.data;
};

// Lista presidentes que NÃO estão associados a um ciclo
export const listarPresidentesNaoAssociados = async (cicloId) => {
  getToken();
  const [todosPresidentes, respostas] = await Promise.all([
    api.get('/presidentes/'),
    api.get(`/respostas/?ciclo=${cicloId}`)
  ]);
  
  const idsAssociados = respostas.data.map(r => r.presidente);
  return todosPresidentes.data.filter(p => !idsAssociados.includes(p.id));
};

// ========== FUNÇÕES LEGADAS (MANTIDAS PARA COMPATIBILIDADE) ==========
export const associarRespostasAosPresidentes = async (cicloId, presidentesIds) => {
  return associarPresidentesAoCiclo(cicloId, presidentesIds);
};

export const salvarRascunho = async (dados) => {
  return criarCiclo({ ...dados, status: 'rascunho' });
};

export const getFormulario = async (formularioId) => {
  getToken();
  const response = await api.get(`/formularios/${formularioId}`);
  return response.data;
};

export const criarCicloComPresidentes = async (dados) => {
  return criarCiclo(dados);
};

// ========== EXPORTS ==========
export default {
  // Ciclos
  listarCiclos,
  getCiclos,
  getCicloDetalhado,
  criarCiclo,
  criarCicloComPresidentes,
  publicarCiclo,
  salvarRascunho,
  
  // Respostas
  getFormulariosDoCiclo,
  submitResposta,
  enviarRespostaCiclo,
  getFormulario,
  
  // Presidentes
  listarPresidentes,
  listarPresidentesNaoAssociados,
  associarPresidentesAoCiclo,
  associarRespostasAosPresidentes,
};