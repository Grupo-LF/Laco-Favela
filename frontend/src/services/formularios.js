import { api } from './api';
import { getToken } from './auth';

// ========== FUNÇÕES EXISTENTES ==========
export const listarCiclos = async () => {
  getToken();
  getToken();
  const response = await api.get('/ciclos/');
  return response.data;
};

export const getCiclos = async () => {
  getToken();
  getToken();
  const response = await api.get('/ciclos');
  return response.data;
};

export const getFormulariosDoCiclo = async (cicloId) => {
  getToken();
  const response = await api.get(`/respostas/?ciclo=${cicloId}`);
  return { respostas: response.data };
};

export const getFormulario = async (formularioId) => {
  getToken();
  const response = await api.get(`/formularios/${formularioId}`);
  return response.data;
};

export const submitResposta = async (formularioId, dados) => {
  getToken();
  getToken();
  const response = await api.post(`/formularios/${formularioId}/respostas`, dados);
  return response.data;
};

export const enviarRespostaCiclo = async (respostas) => {
  getToken();
  const response = await api.post('/respostas-ciclo/', respostas);
  return response.data;
};

// ========== FUNÇÕES PARA CRIAR FORMULÁRIO ==========
export const criarCiclo = async (dados) => {
  getToken();
  
  // Converte os tipos do frontend para os tipos do backend
  const mapTipo = (tipo) => {
    const tipos = {
      'Resposta Aberta': 'texto',
      'Resposta Única': 'selecao_unica',
      'Múltipla Escolha': 'selecao_multipla'
    };
    return tipos[tipo] || 'texto';
  };

  // PREPARA OS DADOS
  const perguntasFormatadas = dados.perguntas.map((p, idx) => {
    const perguntaData = {
      texto: p.texto,
      tipo: mapTipo(p.tipo),
      obrigatoria: true,
      ordem: idx
    };

    // Só adiciona opcoes se for selecao_unica ou selecao_multipla
    if (p.tipo === 'Resposta Única' || p.tipo === 'Múltipla Escolha') {
      perguntaData.opcoes = p.opcoes.map((opcao, opIdx) => ({
        texto: opcao,
        ordem: opIdx
      }));
    }

    return perguntaData;
  });

  // CALCULA O PRAZO PARA 1 MÊS A PARTIR DE HOJE
  // FORMATO: YYYY-MM-DD (sem horas)
  const hoje = new Date();
  const prazo = new Date(hoje);
  prazo.setMonth(prazo.getMonth() + 1);
  
  // Formata a data como YYYY-MM-DD
  const ano = prazo.getFullYear();
  const mes = String(prazo.getMonth() + 1).padStart(2, '0');
  const dia = String(prazo.getDate()).padStart(2, '0');
  const prazoFormatado = `${ano}-${mes}-${dia}`;

  console.log('Prazo formatado:', prazoFormatado);

  const dadosParaEnviar = {
    titulo: dados.titulo,
    descricao: dados.descricao,
    prazo: prazoFormatado,  // Formato: YYYY-MM-DD
    perguntas: perguntasFormatadas
  };

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

export const listarPresidentes = async () => {
  getToken();
  const response = await api.get('/presidentes/');
  return response.data;
};

export const associarRespostasAosPresidentes = async (cicloId, presidentesIds) => {
  getToken();
  const promises = presidentesIds.map(presidenteId => 
    api.post('/respostas/', {
      ciclo: cicloId,
      presidente: presidenteId,
      status: 'nao_iniciado'
    })
  );
  return Promise.all(promises);
};

export const salvarRascunho = async (dados) => {
  return criarCiclo({ ...dados, status: 'rascunho' });
};

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
  criarCiclo,
  salvarRascunho,
  publicarCiclo,
  listarPresidentes,
  associarRespostasAosPresidentes,
};