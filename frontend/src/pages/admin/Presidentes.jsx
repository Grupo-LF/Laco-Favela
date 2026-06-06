import React, { useState, useEffect } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';
import api from '../../services/api';

// Dados mockados para teste enquanto a API não está pronta
const MOCK_PRESIDENTES = [
  {
    id: 1,
    nome: "João Silva",
    organizacao: "Associação Comunitária",
    cnpj: "12.345.678/0001-90",
    endereco: "Rua A, 123",
    telefone: "(11) 98765-4321",
    redes_sociais: "@joaosilva",
    comunidade: "Comunidade Solar",
    situacao_trabalho: "empregado",
    renda_familiar: "2-3_salarios",
    num_membros: 45,
    cota: 5,
    meta_cotas: 50,
    setor: "Setor A",
    visitas: 23,
    eventos: 12,
    penalizacao: 0,
    score_final: 85,
    pontuacao_engajamento: 85
  },
  {
    id: 2,
    nome: "Maria Oliveira",
    organizacao: "ONG Esperança",
    cnpj: "98.765.432/0001-21",
    endereco: "Rua B, 456",
    telefone: "(11) 91234-5678",
    redes_sociais: "@mariaoliveira",
    comunidade: "Comunidade Nova Era",
    situacao_trabalho: "autonomo",
    renda_familiar: "3-5_salarios",
    num_membros: 28,
    cota: 30,
    meta_cotas: 50,
    setor: "Setor B",
    visitas: 15,
    eventos: 8,
    penalizacao: 2,
    score_final: 62,
    pontuacao_engajamento: 62
  },
  {
    id: 3,
    nome: "Carlos Santos",
    organizacao: "Instituto Futuro",
    cnpj: "45.678.901/0001-32",
    endereco: "Rua C, 789",
    telefone: "(11) 99876-5432",
    redes_sociais: "@carlossantos",
    comunidade: "Comunidade Verde",
    situacao_trabalho: "desempregado",
    renda_familiar: "1-2_salarios",
    num_membros: 52,
    cota: 12,
    meta_cotas: 80,
    setor: "Setor C",
    visitas: 9,
    eventos: 5,
    penalizacao: 5,
    score_final: 45,
    pontuacao_engajamento: 45
  },
  {
    id: 4,
    nome: "Ana Pereira",
    organizacao: "Movimento Social",
    cnpj: "67.890.123/0001-43",
    endereco: "Rua D, 101",
    telefone: "(11) 96543-2109",
    redes_sociais: "@anapereira",
    comunidade: "Comunidade Unida",
    situacao_trabalho: "empregado",
    renda_familiar: "3-5_salarios",
    num_membros: 67,
    cota: 48,
    meta_cotas: 50,
    setor: "Setor A",
    visitas: 31,
    eventos: 18,
    penalizacao: 0,
    score_final: 92,
    pontuacao_engajamento: 92
  },
  {
    id: 5,
    nome: "Roberto Lima",
    organizacao: "Centro Comunitário",
    cnpj: "23.456.789/0001-54",
    endereco: "Rua E, 202",
    telefone: "(11) 98765-1234",
    redes_sociais: "@robertolima",
    comunidade: "Comunidade Paz",
    situacao_trabalho: "autonomo",
    renda_familiar: "2-3_salarios",
    num_membros: 33,
    cota: 18,
    meta_cotas: 60,
    setor: "Setor B",
    visitas: 7,
    eventos: 4,
    penalizacao: 3,
    score_final: 38,
    pontuacao_engajamento: 38
  }
];

const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    ...ESTADO_INICIAL_FORM,
    meta_cotas: ''
  });
  const [edicao, setEdicao] = useState({ id: '', cota: '', meta_cotas: '', setor: '' });
  const [ordenacao, setOrdenacao] = useState({ tipo: 'ranking', ordem: 'desc' });
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [presidentes, setPresidentes] = useState([]);
  const [presidentesComRank, setPresidentesComRank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});
  const [usarMock, setUsarMock] = useState(true);

  // Função para pegar iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '?';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0][0].toUpperCase();
    const primeiraLetra = partes[0][0];
    const ultimaLetra = partes[partes.length - 1][0];
    return (primeiraLetra + ultimaLetra).toUpperCase();
  };

  // Carregar presidentes ao montar
  useEffect(() => {
    carregarPresidentes();
  }, []);

  const carregarPresidentes = async () => {
    try {
      setLoading(true);
      
      if (usarMock) {
        setTimeout(() => {
          const ordenadosPorScore = [...MOCK_PRESIDENTES].sort((a, b) => {
            const scoreA = a.score_final || a.pontuacao_engajamento || 0;
            const scoreB = b.score_final || b.pontuacao_engajamento || 0;
            return scoreB - scoreA;
          });
          
          const comRank = ordenadosPorScore.map((item, idx) => ({
            ...item,
            rank_fixo: idx + 1
          }));
          
          setPresidentesComRank(comRank);
          setPresidentes(MOCK_PRESIDENTES);
          setLoading(false);
        }, 500);
      } else {
        const response = await api.get('/presidentes/ranking/');
        const ordenadosPorScore = [...response.data].sort((a, b) => {
          const scoreA = a.score_final || a.pontuacao_engajamento || 0;
          const scoreB = b.score_final || b.pontuacao_engajamento || 0;
          return scoreB - scoreA;
        });
        
        const comRank = ordenadosPorScore.map((item, idx) => ({
          ...item,
          rank_fixo: idx + 1
        }));
        
        setPresidentesComRank(comRank);
        setPresidentes(response.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar presidentes:', error);
      setLoading(false);
    }
  };

  const calcularStatusPorScore = (score) => {
    if (score >= 70) return 'ativo';
    if (score >= 50) return 'alerta';
    return 'critico';
  };

  const getStatusTexto = (status) => {
    if (status === 'ativo') return 'Ativo';
    if (status === 'alerta') return 'Alerta';
    if (status === 'critico') return 'Crítico';
    return status;
  };

  const getStatusBadgeStyle = (score) => {
    if (score >= 70) {
      return { backgroundColor: '#878887', color: 'white' };
    }
    if (score >= 50) {
      return { backgroundColor: '#60605e', color: 'white' };
    }
    return { backgroundColor: '#4d4c4c', color: 'white' };
  };

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;

    if (name === 'telefone') {
      value = mascaraTelefone(value);
    }
    if (name === 'cnpj') {
      value = mascaraCNPJ(value);
    }
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const envioForm = async (event) => {
    event.preventDefault();

    const dadosParaEnviar = {
      ...form,
      num_membros: form.num_membros ? parseInt(form.num_membros) : 1,
      cota: form.cota ? parseInt(form.cota) : 0,
      meta_cotas: form.meta_cotas ? parseInt(form.meta_cotas) : 100
    };

    try {
      setCarregando(true);
      setErros({});

      if (usarMock) {
        const novoPresidente = {
          id: MOCK_PRESIDENTES.length + 1,
          ...dadosParaEnviar,
          visitas: 0,
          eventos: 0,
          penalizacao: 0,
          score_final: 0,
          pontuacao_engajamento: 0
        };
        
        MOCK_PRESIDENTES.push(novoPresidente);
        alert('Presidente cadastrado com sucesso!');
        carregarPresidentes();
        setForm({ ...ESTADO_INICIAL_FORM, meta_cotas: '' });
        setMostrarForm(false);
      } else {
        const response = await api.post('/presidentes/', dadosParaEnviar);
        if (response.status === 201 || response.status === 200) {
          alert('Presidente cadastrado com sucesso!');
          carregarPresidentes();
          setForm({ ...ESTADO_INICIAL_FORM, meta_cotas: '' });
          setMostrarForm(false);
        }
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar presidente. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!edicao.id) {
      alert("Selecione um presidente.");
      return;
    }

    const dadosParaAtualizar = {};
    if (edicao.cota !== '') dadosParaAtualizar.cota = parseInt(edicao.cota);
    if (edicao.meta_cotas !== '') dadosParaAtualizar.meta_cotas = parseInt(edicao.meta_cotas);
    if (edicao.setor !== '') dadosParaAtualizar.setor = edicao.setor;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      alert("Preencha pelo menos um campo (Cota, Meta ou Setor).");
      return;
    }

    try {
      setCarregando(true);
      
      if (usarMock) {
        const index = MOCK_PRESIDENTES.findIndex(p => p.id === edicao.id);
        if (index !== -1) {
          MOCK_PRESIDENTES[index] = {
            ...MOCK_PRESIDENTES[index],
            ...dadosParaAtualizar
          };
          alert('Dados atualizados com sucesso!');
          carregarPresidentes();
          setEdicao({ id: '', cota: '', meta_cotas: '', setor: '' });
        }
      } else {
        const response = await api.patch(`/presidentes/${edicao.id}/`, dadosParaAtualizar);
        if (response.status === 200) {
          alert('Dados atualizados com sucesso!');
          carregarPresidentes();
          setEdicao({ id: '', cota: '', meta_cotas: '', setor: '' });
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleOrdenar = (tipo) => {
    setOrdenacao(prev => ({
      tipo,
      ordem: prev.tipo === tipo && prev.ordem === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleFiltrarStatus = (status) => {
    setFiltroStatus(status);
  };

  // Filtra os presidentes pelo status calculado (usando presidentesComRank)
  const presidentesFiltrados = () => {
    if (filtroStatus === 'todos') {
      return presidentesComRank;
    }
    return presidentesComRank.filter(p => {
      const score = p.score_final || p.pontuacao_engajamento || 0;
      const statusCalculado = calcularStatusPorScore(score);
      return statusCalculado === filtroStatus;
    });
  };

  const presidentesOrdenados = () => {
    const filtrados = presidentesFiltrados();
    const ordenados = [...filtrados];

    return ordenados.sort((a, b) => {
      let valorA, valorB;

      switch (ordenacao.tipo) {
        case 'ranking':
          valorA = a.score_final || a.pontuacao_engajamento || 0;
          valorB = b.score_final || b.pontuacao_engajamento || 0;
          break;
        case 'cotas':
          valorA = a.cota || 0;
          valorB = b.cota || 0;
          break;
        case 'visitas':
          valorA = a.visitas || 0;
          valorB = b.visitas || 0;
          break;
        case 'participacao':
          valorA = a.eventos || 0;
          valorB = b.eventos || 0;
          break;
        default:
          valorA = a.score_final || a.pontuacao_engajamento || 0;
          valorB = b.score_final || b.pontuacao_engajamento || 0;
      }

      return ordenacao.ordem === 'desc' ? valorB - valorA : valorA - valorB;
    });
  };

  const getPenalizacaoColor = (penalizacao) => {
    if (penalizacao === 0) return { color: '#777977' };
    if (penalizacao <= 3) return { color: '#6e6e6e' };
    return { color: '#515151' };
  };

  if (loading) return <p>Carregando presidentes...</p>;

  return (
    <div className="presi">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Presidentes</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista</button>
          <button
            className="btn btn-primary"
            onClick={() => setMostrarForm(!mostrarForm)}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {mostrarForm ? 'Fechar Formulário' : 'Novo Presidente'}
          </button>
        </div>
      </div>

      <div className="view-section active" style={{ padding: '2rem' }}>
        {mostrarForm && (
          <form onSubmit={envioForm} className="card" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Cadastrar Novo Presidente</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome:</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.nome && <small style={{ color: 'red' }}>{erros.nome}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Organização:</label>
                <input type="text" name="organizacao" value={form.organizacao} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.organizacao && <small style={{ color: 'red' }}>{erros.organizacao}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CNPJ:</label>
                <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Endereço:</label>
                <input type="text" name="endereco" value={form.endereco} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.endereco && <small style={{ color: 'red' }}>{erros.endereco}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Telefone:</label>
                <input type="text" name="telefone" value={form.telefone} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.telefone && <small style={{ color: 'red' }}>{erros.telefone}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Redes Sociais:</label>
                <input type="text" name="redes_sociais" value={form.redes_sociais} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.redes_sociais && <small style={{ color: 'red' }}>{erros.redes_sociais}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Comunidade:</label>
                <input type="text" name="comunidade" value={form.comunidade} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.comunidade && <small style={{ color: 'red' }}>{erros.comunidade}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Situação de Trabalho:</label>
                <select name="situacao_trabalho" value={form.situacao_trabalho} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_TRABALHO.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                {erros.situacao_trabalho && <small style={{ color: 'red' }}>{erros.situacao_trabalho}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Renda Familiar:</label>
                <select name="renda_familiar" value={form.renda_familiar} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_RENDA.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                {erros.renda_familiar && <small style={{ color: 'red' }}>{erros.renda_familiar}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Número de Membros:</label>
                <select name="num_membros" value={form.num_membros} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_MEMBROS.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
                {erros.num_membros && <small style={{ color: 'red' }}>{erros.num_membros}</small>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cota Atual:</label>
                <input type="number" name="cota" value={form.cota} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Meta de Cotas:</label>
                <input type="number" name="meta_cotas" value={form.meta_cotas} onChange={handleChange} placeholder="Ex: 100" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="termo_aceito" checked={form.termo_aceito} onChange={handleChange} />
                  <span>Li e aceito os termos</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={carregando} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {carregando ? 'Salvando...' : 'Salvar Presidente'}
            </button>
          </form>
        )}

        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0 }}>Ordenar:</h4>
            <button className="badge" onClick={() => handleOrdenar('ranking')} style={{ backgroundColor: ordenacao.tipo === 'ranking' ? '#333' : '#DFDFDF', color: ordenacao.tipo === 'ranking' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '100px', padding: '6px 16px' }}>
              Score {ordenacao.tipo === 'ranking' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>
            <button className="badge" onClick={() => handleOrdenar('visitas')} style={{ backgroundColor: ordenacao.tipo === 'visitas' ? '#333' : '#DFDFDF', color: ordenacao.tipo === 'visitas' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '100px', padding: '6px 16px' }}>
              Visitas {ordenacao.tipo === 'visitas' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>
            <button className="badge" onClick={() => handleOrdenar('participacao')} style={{ backgroundColor: ordenacao.tipo === 'participacao' ? '#333' : '#DFDFDF', color: ordenacao.tipo === 'participacao' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '100px', padding: '6px 16px' }}>
              Eventos {ordenacao.tipo === 'participacao' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>
            <button className="badge" onClick={() => handleOrdenar('cotas')} style={{ backgroundColor: ordenacao.tipo === 'cotas' ? '#333' : '#DFDFDF', color: ordenacao.tipo === 'cotas' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '100px', padding: '6px 16px' }}>
              Cotas {ordenacao.tipo === 'cotas' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>

            <div style={{ width: '1px', backgroundColor: '#ccc', alignSelf: 'stretch' }}></div>

            <h4 style={{ margin: 0 }}>Status:</h4>
            <button className="badge" onClick={() => handleFiltrarStatus('todos')} style={{ backgroundColor: filtroStatus === 'todos' ? '#333' : '#DFDFDF', color: filtroStatus === 'todos' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '80px', padding: '6px 16px' }}>
              Todos
            </button>
            <button className="badge" onClick={() => handleFiltrarStatus('ativo')} style={{ backgroundColor: filtroStatus === 'ativo' ? '#333' : '#DFDFDF', color: filtroStatus === 'ativo' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '80px', padding: '6px 16px' }}>
              Ativo
            </button>
            <button className="badge" onClick={() => handleFiltrarStatus('alerta')} style={{ backgroundColor: filtroStatus === 'alerta' ? '#333' : '#DFDFDF', color: filtroStatus === 'alerta' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '80px', padding: '6px 16px' }}>
              Alerta
            </button>
            <button className="badge" onClick={() => handleFiltrarStatus('critico')} style={{ backgroundColor: filtroStatus === 'critico' ? '#333' : '#DFDFDF', color: filtroStatus === 'critico' ? '#fff' : '#333', cursor: 'pointer', border: 'none', minWidth: '80px', padding: '6px 16px' }}>
              Crítico
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            minWidth: '900px',
            borderSpacing: 0
          }}>
            <thead>
              <tr style={{ 
                borderBottom: '2px solid #ddd',
                backgroundColor: '#f5f5f5'
              }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>RANK</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', fontSize: '13px', color: '#555' }}>PRESIDENTE</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>SETOR</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>COTAS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>VISITAS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>EVENTOS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>PENALIZAÇÃO</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>SCORE</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>STATUS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px', color: '#555' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {presidentesOrdenados().length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    {filtroStatus === 'todos'
                      ? 'Nenhum presidente cadastrado ainda.'
                      : `Nenhum presidente com status ${filtroStatus} encontrado.`}
                   </td>
                </tr>
              ) : (
                presidentesOrdenados().map((p, index) => {
                  const score = p.score_final || p.pontuacao_engajamento || 0;
                  const statusTexto = getStatusTexto(calcularStatusPorScore(score));
                  const badgeStyle = getStatusBadgeStyle(score);

                  return (
                    <tr key={p.id} style={{ 
                      borderBottom: index === presidentesOrdenados().length - 1 ? 'none' : '1px solid #eee',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                      transition: 'background-color 0.3s'
                    }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#908d8d',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            color: '#fff'
                          }}
                        >
                          {p.rank_fixo}
                        </div>
                       </td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#908d8d',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '13px',
                              color: '#fff',
                              flexShrink: 0
                            }}
                          >
                            {getIniciais(p.nome)}
                          </div>
                          <strong style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{p.nome}</strong>
                        </div>
                       </td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px' }}>{p.setor || p.comunidade}</td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'center', minWidth: '150px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            minWidth: '45px', 
                            fontSize: '12px', 
                            fontWeight: '500',
                            color: '#333'
                          }}>
                            {p.cota || 0}/{p.meta_cotas || 100}
                          </div>
                          <div style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: '#e0e0e0',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${Math.min(((p.cota || 0) / (p.meta_cotas || 100)) * 100, 100)}%`,
                              height: '100%',
                              backgroundColor: '#333333',
                              borderRadius: '3px',
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                        </div>
                       </td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.visitas || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.eventos || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px', ...getPenalizacaoColor(p.penalizacao) }}>{p.penalizacao || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: '#2196F3' }}>{score}</td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span className="badge" style={{ ...badgeStyle, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                          {statusTexto}
                        </span>
                       </td>
                      
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setEdicao({
                              id: p.id,
                              cota: p.cota,
                              meta_cotas: p.meta_cotas || '',
                              setor: p.setor || ''
                            });
                          }}
                          style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#AAAAAA', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '12px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#888888'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#AAAAAA'}
                        >
                          Editar
                        </button>
                       </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: '30px 20px', backgroundColor: '#D3D3D3', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', marginBottom: '1rem' }}>Editar Cota</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>Atualize a cota atual, a meta de famílias e o setor do presidente</p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '2' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Presidente</label>
              <select
                value={edicao.id}
                onChange={(e) => {
                  const presidenteSelecionado = presidentes.find(p => p.id === parseInt(e.target.value));
                  setEdicao({ 
                    ...edicao, 
                    id: e.target.value,
                    cota: presidenteSelecionado?.cota || '',
                    meta_cotas: presidenteSelecionado?.meta_cotas || '',
                    setor: presidenteSelecionado?.setor || ''
                  });
                }}
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              >
                <option value="">Selecione um presidente...</option>
                {presidentes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Cota Atual</label>
              <input
                type="number"
                value={edicao.cota}
                onChange={(e) => setEdicao({ ...edicao, cota: e.target.value })}
                placeholder="Ex: 50"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Meta de Cotas</label>
              <input
                type="number"
                value={edicao.meta_cotas}
                onChange={(e) => setEdicao({ ...edicao, meta_cotas: e.target.value })}
                placeholder="Ex: 100"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Setor</label>
              <input
                type="text"
                value={edicao.setor}
                onChange={(e) => setEdicao({ ...edicao, setor: e.target.value })}
                placeholder="Ex: Setor A"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>
          </div>

          <div className="btns" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleSalvarEdicao} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#696969', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button className="btn btn-primary" onClick={() => setEdicao({ id: '', cota: '', meta_cotas: '', setor: '' })} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#AAA2A2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;