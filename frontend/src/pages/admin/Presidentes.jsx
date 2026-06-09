import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { ReactComponent as AddIcon } from '../../assets/addBtn.svg';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';
import api from '../../services/api';

// ========== CONSTANTES ==========
const OPCOES_ORDENACAO = [
  { tipo: 'ranking', label: 'Score', campo: (p) => p.score_final || p.pontuacao_engajamento || 0 },
  { tipo: 'visitas', label: 'Visitas', campo: (p) => p.visitas || 0 },
  { tipo: 'participacao', label: 'Eventos', campo: (p) => p.eventos || 0 },
  { tipo: 'cotas', label: 'Cotas', campo: (p) => p.cota || 0 }
];

const OPCOES_STATUS = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'ativo', label: 'Ativo', condicao: (score) => score >= 70 },
  { valor: 'alerta', label: 'Alerta', condicao: (score) => score >= 50 && score < 70 },
  { valor: 'critico', label: 'Com penalização', condicao: (score) => score < 50 }
];

// ========== FUNÇÕES UTILITÁRIAS ==========

const getRankColor = (rank) => {
    if (rank <= 3) {
      return ['var(--color-primary)','#fff'];  // Cor para ranks 1, 2 e 3
    }
    return ['var(--color-accent)','#000'];   // Cor para ranks maiores que 3
  };
const calcularStatusPorScore = (score) => {
  if (score >= 70) return 'ativo';
  if (score >= 50) return 'alerta';
  return 'critico';
};

const getStatusBadgeStyle = (score) => {
  if (score >= 70) return { backgroundColor: 'var(--color-primary)', color: 'white' };
  if (score >= 50) return { backgroundColor: '#FF9800', color: '#000' };
  return { backgroundColor: '#f44336', color: 'white' };
};

const getStatusTexto = (status) => {
  const map = { ativo: 'Ativo', alerta: 'Alerta', critico: 'Crítico' };
  return map[status] || status;
};


// ========== COMPONENTES ==========
const BotaoFiltro = ({ ativo, onClick, children, cor = 'var(--color-primary)' }) => (
  <button
    className="badge"
    onClick={onClick}
    style={{
      backgroundColor: ativo ? cor : '#DFDFDF',
      color: ativo ? '#fff' : '#333',
      cursor: 'pointer',
      border: 'none',
      minWidth: '85px',
      padding: '6px 16px',
      transition: 'all 0.3s ease'
    }}
  >
    {children}
  </button>
);

const InputField = ({ label, name, value, onChange, required, type = 'text', placeholder, error }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{label}:</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
    />
    {error && <small style={{ color: 'red' }}>{error}</small>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required, error }) => (
  <div>
    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>{label}:</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
    >
      <option value="">Selecione...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <small style={{ color: 'red' }}>{error}</small>}
  </div>
);

const BarraProgresso = ({ atual, meta }) => {
  const percentual = Math.min(((atual || 0) / (meta || 100)) * 100, 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ minWidth: '45px', fontSize: '12px', fontWeight: '500', color: '#333' }}>
        {atual || 0}/{meta || 100}
      </div>
      <div style={{ flex: 1, height: '8px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percentual}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

const CirculoRank = ({ rank }) => (
  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: getRankColor(rank)[0], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: getRankColor(rank)[1]}}>
    {rank}
  </div>
);



// ========== COMPONENTE PRINCIPAL ==========
const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({ ...ESTADO_INICIAL_FORM, meta_cotas: '' });
  const [edicao, setEdicao] = useState({ id: '', cota: '', meta_cotas: '', setor: '' });
  const [ordenacao, setOrdenacao] = useState({ tipo: 'ranking', ordem: 'desc' });
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [presidentes, setPresidentes] = useState([]);
  const [presidentesComRank, setPresidentesComRank] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Carregar presidentes
  const carregarPresidentes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/presidentes/ranking/');
      const dados = response.data;
      
      const ordenadosPorScore = [...dados].sort((a, b) => {
        const scoreA = a.score_final || a.pontuacao_engajamento || 0;
        const scoreB = b.score_final || b.pontuacao_engajamento || 0;
        return scoreB - scoreA;
      });
      
      const comRank = ordenadosPorScore.map((item, idx) => ({ ...item, rank_fixo: idx + 1 }));
      
      setPresidentesComRank(comRank);
      setPresidentes(dados);
    } catch (error) {
      console.error('Erro ao carregar presidentes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPresidentes();
  }, [carregarPresidentes]);

  // Handlers do formulário
  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;

    if (name === 'telefone') value = mascaraTelefone(value);
    if (name === 'cnpj') value = mascaraCNPJ(value);
    
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
  };
  


  const envioForm = async (event) => {
    event.preventDefault();
    
    const dadosParaEnviar = {
      ...form,
      num_membros: parseInt(form.num_membros) || 1,
      cota: parseInt(form.cota) || 0,
      meta_cotas: parseInt(form.meta_cotas) || 100
    };

    try {
      setCarregando(true);
      setErros({});
      
      const response = await api.post('/presidentes/', dadosParaEnviar);
      if (response.status === 201 || response.status === 200) {
        alert('Presidente cadastrado com sucesso!');
        carregarPresidentes();
        setForm({ ...ESTADO_INICIAL_FORM, meta_cotas: '' });
        setMostrarForm(false);
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
      const response = await api.patch(`/presidentes/${edicao.id}/`, dadosParaAtualizar);
      if (response.status === 200) {
        alert('Dados atualizados com sucesso!');
        carregarPresidentes();
        setEdicao({ id: '', cota: '', meta_cotas: '', setor: '' });
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleOrdenar = (tipo) => {
    setOrdenacao(prev => ({ tipo, ordem: prev.tipo === tipo && prev.ordem === 'desc' ? 'asc' : 'desc' }));
  };

  // Filtro e ordenação
  const presidentesFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return presidentesComRank;
    
    return presidentesComRank.filter(p => {
      const score = p.score_final || p.pontuacao_engajamento || 0;
      const status = calcularStatusPorScore(score);
      return status === filtroStatus;
    });
  }, [presidentesComRank, filtroStatus]);

  const presidentesOrdenados = useMemo(() => {
    const ordenados = [...presidentesFiltrados];
    const opcao = OPCOES_ORDENACAO.find(opt => opt.tipo === ordenacao.tipo);
    
    if (!opcao) return ordenados;
    
    return ordenados.sort((a, b) => {
      const valorA = opcao.campo(a);
      const valorB = opcao.campo(b);
      return ordenacao.ordem === 'desc' ? valorB - valorA : valorA - valorB;
    });
  }, [presidentesFiltrados, ordenacao]);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando presidentes...</div>;

  return (
    <div className="presi">
      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0 ,color:'var(--color-primary)'}}>Presidentes</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista <ExportIcon></ExportIcon></button>
          <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            {mostrarForm ? 'Fechar Formulário' : 'Novo Presidente'}<AddIcon/>
          </button>
        </div>
      </div>

      <div className="view-section active" style={{ padding: '2rem' }}>
       
        {/* Filtros */}
        <div className="card" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h4 style={{ margin: 0 }}>Ordenar:</h4>
            {OPCOES_ORDENACAO.map(opt => (
              <BotaoFiltro key={opt.tipo} ativo={ordenacao.tipo === opt.tipo} onClick={() => handleOrdenar(opt.tipo)}>
                {opt.label} {ordenacao.tipo === opt.tipo && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
              </BotaoFiltro>
            ))}

            <div style={{ width: '1px', backgroundColor: '#ccc', alignSelf: 'stretch' }} />

            <h4 style={{ margin: 0 }}>Status:</h4>
            {OPCOES_STATUS.map(opt => (
              <BotaoFiltro key={opt.valor} ativo={filtroStatus === opt.valor} onClick={() => setFiltroStatus(opt.valor)} cor="var(--color-primary)">
                {opt.label}
              </BotaoFiltro>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="card" style={{ padding: '1.5rem' , boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>RANK</th>
                <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', fontSize: '13px'}}>PRESIDENTE</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>SETOR</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>COTAS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>VISITAS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>EVENTOS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>PENALIZAÇÃO</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>SCORE</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>STATUS</th>
                <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '600', fontSize: '13px' }}>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {presidentesOrdenados.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    {filtroStatus === 'todos' ? 'Nenhum presidente cadastrado ainda.' : `Nenhum presidente com status ${filtroStatus} encontrado.`}
                  </td>
                </tr>
              ) : (
                presidentesOrdenados.map((p, index) => {
                  const score = p.score_final || p.pontuacao_engajamento || 0;
                  const status = calcularStatusPorScore(score);
                  const badgeStyle = getStatusBadgeStyle(score);
                  const isLast = index === presidentesOrdenados.length - 1;
                  
                  return (
                    <tr key={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid #eee', backgroundColor: '#fff'  }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}><CirculoRank rank={p.rank_fixo} /></td>
                      <td style={{ padding: '12px 8px', textAlign: 'left' }}>
                      <h3 style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{p.nome}</h3>                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px' }}>{p.setor || p.comunidade}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'center', minWidth: '80px', }}><BarraProgresso atual={p.cota} meta={p.meta_cotas} /></td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.visitas || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.eventos || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px',  }}>{p.penalizacao || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{score}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span className="badge" style={{ ...badgeStyle, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                          {getStatusTexto(status)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button onClick={() => setEdicao({ id: p.id, cota: p.cota, meta_cotas: p.meta_cotas || '', setor: p.setor || '' })} style={{ padding: '4px 12px', backgroundColor: '#AAAAAA', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
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

        {/* Edição */}
        <div className="card" style={{ padding: '30px 20px', backgroundColor: '#D3D3D3', borderRadius: '8px'}}>
          <h4 style={{ fontSize: '18px', marginBottom: '1rem' }}>Editar Cota</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>Atualize a cota atual, a meta de famílias e o setor do presidente</p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1.5' }}>
              <label style={{ fontWeight: '500' }}>Presidente</label>
              <select value={edicao.id} onChange={(e) => {
                const p = presidentes.find(p => p.id === parseInt(e.target.value));
                setEdicao({ ...edicao, id: e.target.value, cota: p?.cota || '', meta_cotas: p?.meta_cotas || '', setor: p?.setor || '' });
              }} style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}>
                <option value="">Selecione um presidente...</option>
                {presidentes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <InputField label="Meta de Cotas" name="meta_cotas" value={edicao.meta_cotas} onChange={(e) => setEdicao({ ...edicao, meta_cotas: e.target.value })} type="number" placeholder="Digite o quantitativo" />
            <InputField label="Setor" name="setor" value={edicao.setor} onChange={(e) => setEdicao({ ...edicao, setor: e.target.value })} placeholder="Ex: Setor A" />
          </div>

          <div className="btns" style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleSalvarEdicao} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button className="btn btn-primary" onClick={() => setEdicao({ id: '', cota: '', meta_cotas: '', setor: '' })} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#696969', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;