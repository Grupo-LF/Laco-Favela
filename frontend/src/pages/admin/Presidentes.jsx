import React, { useState, useEffect } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';
import api from '../../services/api';

const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL_FORM);
  const [edicao, setEdicao] = useState({ id: '', cota: '', setor: '' });
  const [ordenacao, setOrdenacao] = useState({ tipo: 'ranking', ordem: 'desc' });
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  // Carregar presidentes ao montar
  useEffect(() => {
    carregarPresidentes();
  }, []);

  const carregarPresidentes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/presidentes/');
      setPresidentes(response.data);
    } catch (error) {
      console.error('Erro ao carregar presidentes:', error);
    } finally {
      setLoading(false);
    }
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

    // Limpar erro do campo ao digitar
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  };

  const envioForm = async (event) => {
    event.preventDefault();

    const dadosParaEnviar = {
      ...form,
      num_membros: form.num_membros ? parseInt(form.num_membros) : 1,
      cota: form.cota ? parseInt(form.cota) : 0
    };

    try {
      setCarregando(true);
      setErros({});

      const response = await api.post('/presidentes/', dadosParaEnviar);

      if (response.status === 201 || response.status === 200) {
        alert('Presidente cadastrado com sucesso!');
        carregarPresidentes();
        setForm(ESTADO_INICIAL_FORM);
        setMostrarForm(false);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);

      if (error.response?.data) {
        setErros(error.response.data);
        const mensagens = Object.entries(error.response.data)
          .map(([campo, msg]) => `${campo}: ${msg}`)
          .join('\n');
        alert(`Erro ao cadastrar:\n${mensagens}`);
      } else {
        alert('Erro ao cadastrar presidente. Tente novamente.');
      }
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
    if (edicao.setor !== '') dadosParaAtualizar.setor = edicao.setor;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      alert("Preencha pelo menos um campo (Cota ou Setor).");
      return;
    }

    try {
      setCarregando(true);
      const response = await api.patch(`/presidentes/${edicao.id}/`, dadosParaAtualizar);

      if (response.status === 200) {
        alert('Dados atualizados com sucesso!');
        carregarPresidentes();
        setEdicao({ id: '', cota: '', setor: '' });
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

  const presidentesFiltrados = () => {
    if (filtroStatus === 'todos') {
      return presidentes;
    }
    return presidentes.filter(p => {
      const statusLower = (p.status || '').toLowerCase();
      if (filtroStatus === 'ativo') {
        return statusLower === 'ativo';
      }
      if (filtroStatus === 'critico') {
        return statusLower === 'critico' || statusLower === 'crítico';
      }
      return true;
    });
  };

  const presidentesOrdenados = () => {
    const filtrados = presidentesFiltrados();
    const ordenados = [...filtrados];

    return ordenados.sort((a, b) => {
      let valorA, valorB;

      switch (ordenacao.tipo) {
        case 'ranking':
          valorA = a.posicao_ranking || 999;
          valorB = b.posicao_ranking || 999;
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
          valorA = a.eventos_realizados || a.eventos || 0;
          valorB = b.eventos_realizados || b.eventos || 0;
          break;
        default:
          valorA = a.score || 0;
          valorB = b.score || 0;
      }

      return ordenacao.ordem === 'desc' ? valorB - valorA : valorA - valorB;
    });
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'ativo') {
      return { color: '#4CAF50', fontWeight: 'bold' };
    }
    if (statusLower === 'critico' || statusLower === 'crítico') {
      return { color: '#f44336', fontWeight: 'bold' };
    }
    return { color: '#888', fontWeight: 'bold' };
  };

  const getPenalizacaoColor = (penalizacao) => {
    if (penalizacao === 0) return { color: '#4CAF50' };
    if (penalizacao <= 3) return { color: '#FF9800' };
    return { color: '#f44336' };
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cota Inicial:</label>
                <input type="number" name="cota" value={form.cota} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
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
        {/* Botões de Ordenação e Filtros */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>

            <h4 style={{ margin: 0 }}>Ordenar:</h4>

            <button
              className="badge"
              onClick={() => handleOrdenar('ranking')}
              style={{
                backgroundColor: ordenacao.tipo === 'ranking' ? '#333' : '#DFDFDF',
                color: ordenacao.tipo === 'ranking' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '100px',
                padding: '6px 16px'
              }}
            >
              Ranking {ordenacao.tipo === 'ranking' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>

            <button
              className="badge"
              onClick={() => handleOrdenar('visitas')}
              style={{
                backgroundColor: ordenacao.tipo === 'visitas' ? '#333' : '#DFDFDF',
                color: ordenacao.tipo === 'visitas' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '100px',
                padding: '6px 16px'
              }}
            >
              Visitas {ordenacao.tipo === 'visitas' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>

            <button
              className="badge"
              onClick={() => handleOrdenar('participacao')}
              style={{
                backgroundColor: ordenacao.tipo === 'participacao' ? '#333' : '#DFDFDF',
                color: ordenacao.tipo === 'participacao' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '100px',
                padding: '6px 16px'
              }}
            >
              Eventos {ordenacao.tipo === 'participacao' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>

            <button
              className="badge"
              onClick={() => handleOrdenar('cotas')}
              style={{
                backgroundColor: ordenacao.tipo === 'cotas' ? '#333' : '#DFDFDF',
                color: ordenacao.tipo === 'cotas' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '100px',
                padding: '6px 16px'
              }}
            >
              Cotas {ordenacao.tipo === 'cotas' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>

            {/* Haste vertical */}
            <div style={{
              width: '1px',
              backgroundColor: '#ccc',
              alignSelf: 'stretch'
            }}></div>

            <h4 style={{ margin: 0 }}>Status:</h4>

            <button
              className="badge"
              onClick={() => handleFiltrarStatus('todos')}
              style={{
                backgroundColor: filtroStatus === 'todos' ? '#333' : '#DFDFDF',
                color: filtroStatus === 'todos' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '80px',
                padding: '6px 16px'
              }}
            >
              Todos
            </button>

            <button
              className="badge"
              onClick={() => handleFiltrarStatus('ativo')}
              style={{
                backgroundColor: filtroStatus === 'ativo' ? '#333' : '#DFDFDF',
                color: filtroStatus === 'ativo' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '80px',
                padding: '6px 16px'
              }}
            >
              Ativo
            </button>

            <button
              className="badge"
              onClick={() => handleFiltrarStatus('critico')}
              style={{
                backgroundColor: filtroStatus === 'critico' ? '#333' : '#DFDFDF',
                color: filtroStatus === 'critico' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                minWidth: '80px',
                padding: '6px 16px'
              }}
            >
              Com penalidades
            </button>

          </div>
        </div>
        {/* Tabela de Presidentes */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>RANKING</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>PRESIDENTE</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>SETOR</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>COTAS</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>VISITAS</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>EVENTOS</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>PENALIZAÇÃO</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>SCORE</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {presidentesOrdenados().length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                    {filtroStatus === 'todos'
                      ? 'Nenhum presidente cadastrado ainda.'
                      : `Nenhum presidente com status ${filtroStatus} encontrado.`}
                  </td>
                </tr>
              ) : (
                presidentesOrdenados().map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.3s', textAlign: 'center' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', textAlign: 'center' }}>#{p.ranking || p.posicao_ranking || '-'}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}><strong>{p.nome}</strong></td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.setor || p.comunidade}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#2196F3', textAlign: 'center' }}>{p.cota}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.visitas || 0}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.eventos_realizados || p.eventos || 0}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', ...getPenalizacaoColor(p.penalizacao) }}>{p.penalizacao || 0}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', textAlign: 'center' }}>{p.score || 0}</td>
                    <td style={{ textAlign: 'center', ...getStatusColor(p.status) }}>
                      {p.status === 'ativo' ? 'Ativo' : p.status === 'critico' ? 'Crítico' : p.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Formulário único: Editar Cota e Setor */}
        <div className="card" style={{ padding: '30px 20px', backgroundColor: '#D3D3D3', borderRadius: '8px' }}>
          <h4 style={{ fontSize: '18px', marginBottom: '1rem' }}>Editar Cota e Setor do Presidente</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1.5rem' }}>Atualize a meta de famílias e o setor do presidente</p>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>

            {/* Presidente */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '2' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Presidente</label>
              <select
                value={edicao.id}
                onChange={(e) => setEdicao({ ...edicao, id: e.target.value })}
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' ,outline:'none'}}
              >
                <option value="">Selecione um presidente...</option>
                {presidentes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* Cota */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Nova Cota</label>
              <input
                type="number"
                value={edicao.cota}
                onChange={(e) => setEdicao({ ...edicao, cota: e.target.value })}
                placeholder="Ex: 50"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

            {/* Setor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '1' }}>
              <label style={{ fontWeight: '900', fontSize: '14px' }}>Novo Setor</label>
              <input
                type="text"
                value={edicao.setor}
                onChange={(e) => setEdicao({ ...edicao, setor: e.target.value })}
                placeholder="Ex: Setor A"
                style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
              />
            </div>

          </div>
          <div className="btns" style={{ display: 'flex',gap: '1rem', marginTop: '0.1rem' }}>

          {/* Botão */}
          <button
            className="btn btn-primary"
            onClick={handleSalvarEdicao}
            style={{
              padding: '1.2rem',
              height: '0',
              backgroundColor: '#696969',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '1.5rem'
            }}
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Salvar Cota'}
          </button><button
            className="btn btn-primary"
            onClick={() => setEdicao({ id: '', cota: '', setor: '' })}
            style={{
              padding: ' 1.2rem',
              height: '0',
              backgroundColor: '#AAA2A2',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '1.5rem'
            }}
            disabled={carregando}
          >
            Cancelar
          </button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Presidentes;