import { api } from './api';
import { getToken } from './auth';

// ========== FUNÇÕES EXISTENTES ==========
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
export const notificarResposta = async (respostaId) => {
  getToken();
  const response = await api.post(`/respostas/${respostaId}/notificar/`);
  return response.data;
};

export const getCicloDetalhado = async (cicloId) => {
  getToken();
  const response = await api.get(`/ciclos/${cicloId}/`);
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
  const response = await api.post(`/formularios/${formularioId}/respostas`, dados);
  return response.data;
};

export const enviarRespostaCiclo = async (respostas) => {
  getToken();
  const response = await api.post('/respostas-ciclo/', respostas);
  return response.data;
};

// ========== FUNÇÃO PARA LISTAR FAMÍLIAS ==========
export const listarFamilias = async () => {
  getToken();
  const response = await api.get('/familias/');
  return response.data;
};

// ========== FUNÇÃO CORRIGIDA - CRIA CICLO COM FAMÍLIAS ==========
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
  const perguntasFormatadas = dados.perguntas?.map((p, idx) => {
    const perguntaData = {
      texto: p.texto,
      tipo: mapTipo(p.tipo),
      obrigatoria: true,
      ordem: idx
    };

    // Só adiciona opcoes se for selecao_unica ou selecao_multipla
    if (p.tipo === 'Resposta Única' || p.tipo === 'Múltipla Escolha') {
      perguntaData.opcoes = p.opcoes?.map((opcao, opIdx) => ({
        texto: opcao,
        ordem: opIdx
      })) || [];
    }

    return perguntaData;
  }) || [];

  // CALCULA O PRAZO PARA 1 MÊS A PARTIR DE HOJE
  const hoje = new Date();
  const prazo = new Date(hoje);
  prazo.setMonth(prazo.getMonth() + 1);
  
  const ano = prazo.getFullYear();
  const mes = String(prazo.getMonth() + 1).padStart(2, '0');
  const dia = String(prazo.getDate()).padStart(2, '0');
  const prazoFormatado = `${ano}-${mes}-${dia}`;

  console.log('📅 Prazo formatado:', prazoFormatado);

  // ✅ DADOS BASE
  const dadosParaEnviar = {
    titulo: dados.titulo,
    descricao: dados.descricao,
    prazo: prazoFormatado,
    perguntas: perguntasFormatadas
  };

  // ✅ ADICIONA familias_ids se existir
  if (dados.familias_ids && dados.familias_ids.length > 0) {
    dadosParaEnviar.familias_ids = dados.familias_ids;
    console.log('📋 Famílias associadas:', dados.familias_ids);
  }

  // ✅ ADICIONA status se existir
  if (dados.status) {
    dadosParaEnviar.status = dados.status;
    console.log('📌 Status:', dados.status);
  }

  console.log('📤 Dados enviados para API:', JSON.stringify(dadosParaEnviar, null, 2));

  try {
    const response = await api.post('/ciclos/', dadosParaEnviar);
    console.log('✅ Resposta da API:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro detalhado da API:', error.response?.data);
    throw error;
  }
};

// ========== FUNÇÃO PARA PUBLICAR CICLO ==========
export const publicarCiclo = async (cicloId) => {
  getToken();
  const response = await api.post(`/ciclos/${cicloId}/publish/`);
  return response.data;
};

// ========== FUNÇÃO PARA LISTAR PRESIDENTES (mantida para compatibilidade) ==========
export const listarPresidentes = async () => {
  getToken();
  const response = await api.get('/presidentes/');
  return response.data;
};

// ========== FUNÇÃO PARA ASSOCIAR RESPOSTAS AOS PRESIDENTES (mantida para compatibilidade) ==========
export const associarRespostasAosPresidentes = async (cicloId, presidentesIds) => {
  getToken();
  const promises = presidentesIds.map(presidenteId => 
    api.post('/respostas/', {
      ciclo: cicloId,
      presidente: presidenteId,
      status: 'pendente'
    })
  );
  return Promise.all(promises);
};

// ========== FUNÇÃO PARA CRIAR CICLO COM PRESIDENTES (mantida para compatibilidade) ==========
export const criarCicloComPresidentes = async (dados, presidentesIds) => {
  getToken();
  const ciclo = await criarCiclo(dados);
  await associarRespostasAosPresidentes(ciclo.id, presidentesIds);
  return ciclo;
};

// ========== FUNÇÃO PARA SALVAR RASCUNHO ==========
export const salvarRascunho = async (dados) => {
  getToken();
  const dadosComStatus = { ...dados, status: 'rascunho' };
  return criarCiclo(dadosComStatus);
};

// ========== FUNÇÃO PARA CRIAR CICLO COM FAMÍLIAS (NOVA) ==========
export const criarCicloComFamilias = async (dados, familiasIds) => {
  getToken();
  const dadosCompletos = {
    ...dados,
    familias_ids: familiasIds,
    status: 'publicado'
  };
  return criarCiclo(dadosCompletos);
};

export default {
  // Ciclos
  notificarResposta,
  listarCiclos,
  getCiclos,
  getCicloDetalhado,
  criarCiclo,
  criarCicloComFamilias,
  criarCicloComPresidentes,
  publicarCiclo,
  salvarRascunho,
  
  // Formulários
  getFormulario,
  
  // Respostas
  getFormulariosDoCiclo,
  submitResposta,
  enviarRespostaCiclo,
  
  // Presidentes e Famílias
  listarPresidentes,
  listarFamilias,
  associarRespostasAosPresidentes,
};