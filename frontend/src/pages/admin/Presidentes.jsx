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
  { valor: 'critico', label: 'Crítico', condicao: (score) => score < 50 }
];

// ========== FUNÇÕES UTILITÁRIAS ==========
const getIniciais = (nome) => {
  if (!nome) return '?';
  const partes = nome.trim().split(' ');
  if (partes.length === 1) return partes[0][0].toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
};

const calcularStatusPorScore = (score) => {
  if (score >= 70) return 'ativo';
  if (score >= 50) return 'alerta';
  return 'critico';
};

const getStatusBadgeStyle = (score) => {
  if (score >= 70) return { backgroundColor: '#4CAF50', color: 'white' };
  if (score >= 50) return { backgroundColor: '#FF9800', color: 'white' };
  return { backgroundColor: '#f44336', color: 'white' };
};

const getStatusTexto = (status) => {
  const map = { ativo: 'Ativo', alerta: 'Alerta', critico: 'Crítico' };
  return map[status] || status;
};

const getPenalizacaoColor = (penalizacao) => {
  if (penalizacao === 0) return { color: '#4CAF50' };
  if (penalizacao <= 3) return { color: '#FF9800' };
  return { color: '#f44336' };
};

// ========== COMPONENTES ==========
const BotaoFiltro = ({ ativo, onClick, children, cor = '#333' }) => (
  <button
    className="badge"
    onClick={onClick}
    style={{
      backgroundColor: ativo ? cor : '#DFDFDF',
      color: ativo ? '#fff' : '#333',
      cursor: 'pointer',
      border: 'none',
      minWidth: '100px',
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
      <div style={{ flex: 1, height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percentual}%`, height: '100%', backgroundColor: '#333333', borderRadius: '3px', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
};

const CirculoRank = ({ rank }) => (
  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#908d8d', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#fff' }}>
    {rank}
  </div>
);

const AvatarIniciais = ({ nome }) => (
  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#908d8d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', color: '#fff', flexShrink: 0 }}>
    {getIniciais(nome)}
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
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista</button>
          <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '0.5rem 1rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {mostrarForm ? 'Fechar Formulário' : 'Novo Presidente'}
          </button>
        </div>
      </div>

      <div className="view-section active" style={{ padding: '2rem' }}>
        {/* Formulário de Cadastro */}
        {mostrarForm && (
          <form onSubmit={envioForm} className="card" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Cadastrar Novo Presidente</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <InputField label="Nome" name="nome" value={form.nome} onChange={handleChange} required error={erros.nome} />
              <InputField label="Organização" name="organizacao" value={form.organizacao} onChange={handleChange} required error={erros.organizacao} />
              <InputField label="CNPJ" name="cnpj" value={form.cnpj} onChange={handleChange} />
              <InputField label="Endereço" name="endereco" value={form.endereco} onChange={handleChange} required error={erros.endereco} />
              <InputField label="Telefone" name="telefone" value={form.telefone} onChange={handleChange} required error={erros.telefone} />
              <InputField label="Redes Sociais" name="redes_sociais" value={form.redes_sociais} onChange={handleChange} required error={erros.redes_sociais} />
              <InputField label="Comunidade" name="comunidade" value={form.comunidade} onChange={handleChange} required error={erros.comunidade} />
              
              <SelectField label="Situação de Trabalho" name="situacao_trabalho" value={form.situacao_trabalho} onChange={handleChange} options={OPCOES_TRABALHO} required error={erros.situacao_trabalho} />
              <SelectField label="Renda Familiar" name="renda_familiar" value={form.renda_familiar} onChange={handleChange} options={OPCOES_RENDA} required error={erros.renda_familiar} />
              <SelectField label="Número de Membros" name="num_membros" value={form.num_membros} onChange={handleChange} options={OPCOES_MEMBROS} required error={erros.num_membros} />
              
              <InputField label="Cota Atual" name="cota" value={form.cota} onChange={handleChange} type="number" />
              <InputField label="Meta de Cotas" name="meta_cotas" value={form.meta_cotas} onChange={handleChange} type="number" placeholder="Ex: 100" />
              
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

        {/* Filtros */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem', overflowX: 'auto' }}>
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
              <BotaoFiltro key={opt.valor} ativo={filtroStatus === opt.valor} onClick={() => setFiltroStatus(opt.valor)} cor="#333">
                {opt.label}
              </BotaoFiltro>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px', borderSpacing: 0 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#f5f5f5' }}>
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
                    <tr key={p.id} style={{ borderBottom: isLast ? 'none' : '1px solid #eee', backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}><CirculoRank rank={p.rank_fixo} /></td>
                      <td style={{ padding: '12px 8px', textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <AvatarIniciais nome={p.nome} />
                          <strong style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>{p.nome}</strong>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '13px' }}>{p.setor || p.comunidade}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', minWidth: '150px' }}><BarraProgresso atual={p.cota} meta={p.meta_cotas} /></td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.visitas || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px' }}>{p.eventos || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '500', fontSize: '13px', ...getPenalizacaoColor(p.penalizacao) }}>{p.penalizacao || 0}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', color: '#2196F3' }}>{score}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <span className="badge" style={{ ...badgeStyle, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '500' }}>
                          {getStatusTexto(status)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <button onClick={() => setEdicao({ id: p.id, cota: p.cota, meta_cotas: p.meta_cotas || '', setor: p.setor || '' })} style={{ padding: '4px 12px', backgroundColor: '#AAAAAA', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
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
        <div className="card" style={{ padding: '30px 20px', backgroundColor: '#D3D3D3', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', marginBottom: '1rem' }}>Editar Cota</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>Atualize a cota atual, a meta de famílias e o setor do presidente</p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '2' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Presidente</label>
              <select value={edicao.id} onChange={(e) => {
                const p = presidentes.find(p => p.id === parseInt(e.target.value));
                setEdicao({ ...edicao, id: e.target.value, cota: p?.cota || '', meta_cotas: p?.meta_cotas || '', setor: p?.setor || '' });
              }} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}>
                <option value="">Selecione um presidente...</option>
                {presidentes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>

            <InputField label="Cota Atual" name="cota" value={edicao.cota} onChange={(e) => setEdicao({ ...edicao, cota: e.target.value })} type="number" />
            <InputField label="Meta de Cotas" name="meta_cotas" value={edicao.meta_cotas} onChange={(e) => setEdicao({ ...edicao, meta_cotas: e.target.value })} type="number" placeholder="Ex: 100" />
            <InputField label="Setor" name="setor" value={edicao.setor} onChange={(e) => setEdicao({ ...edicao, setor: e.target.value })} placeholder="Ex: Setor A" />
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