import React, { useState, useEffect } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';
import api from '../../services/api';

const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL_FORM);
  const [cota, setCota] = useState({ id: '', valor: '' });
  const [ordenacao, setOrdenacao] = useState({ tipo: 'ranking', ordem: 'desc' });
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
    
    // Converter num_membros para número inteiro
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

  const atualizarCota = async (id, valor) => {
    try {
      setCarregando(true);
      
      const response = await api.patch(`/presidentes/${id}/`, {
        cota: parseInt(valor)
      });
      
      if (response.status === 200) {
        alert('Cota atualizada com sucesso!');
        carregarPresidentes();
        return true;
      }
    } catch (error) {
      console.error('Erro ao atualizar cota:', error);
      alert('Erro ao atualizar cota. Tente novamente.');
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarCota = async () => {
    if (!cota.id || !cota.valor) {
      alert("Selecione um presidente e digite a nova cota.");
      return;
    }
    const sucesso = await atualizarCota(cota.id, cota.valor);
    if (sucesso) {
      setCota({ id: '', valor: '' });
    }
  };

  const handleOrdenar = (tipo) => {
    setOrdenacao(prev => ({
      tipo,
      ordem: prev.tipo === tipo && prev.ordem === 'desc' ? 'asc' : 'desc'
    }));
  };

  const presidentesOrdenados = () => {
    const ordenados = [...presidentes];
    
    return ordenados.sort((a, b) => {
      let valorA, valorB;
      
      switch(ordenacao.tipo) {
        case 'ranking':
          valorA = a.posicao_ranking || 999;
          valorB = b.posicao_ranking || 999;
          break;
        case 'cotas':
          valorA = a.cota || 0;
          valorB = b.cota || 0;
          break;
        default:
          valorA = a.score || 0;
          valorB = b.score || 0;
      }
      
      return ordenacao.ordem === 'desc' ? valorB - valorA : valorA - valorB;
    });
  };

  const getStatusColor = (status) => {
    return status === 'Ativo' || status === 'ativo' 
      ? { color: '#4CAF50', fontWeight: 'bold' } 
      : { color: '#f44336', fontWeight: 'bold' };
  };

  const getPenalizacaoColor = (penalizacao) => {
    if (penalizacao === 0) return { color: '#4CAF50' };
    if (penalizacao <= 3) return { color: '#FF9800' };
    return { color: '#f44336' };
  };

  if (loading) return <p>Carregando presidentes...</p>;

  return (
    <div className="presi">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Gestão de Presidentes</h2>
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
        
        {/* Botões de Ordenação */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0 }}>Ordenar por:</h3>
            
            <button 
              className="badge"
              onClick={() => handleOrdenar('ranking')}
              style={{ 
                backgroundColor: ordenacao.tipo === 'ranking' ? '#333' : '#DFDFDF',
                color: ordenacao.tipo === 'ranking' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none'
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
                border: 'none'
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
                border: 'none'
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
                border: 'none'
              }}
            >
              Cotas {ordenacao.tipo === 'cotas' && (ordenacao.ordem === 'desc' ? '↓' : '↑')}
            </button>
            
            <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#888' }}>
              {ordenacao.ordem === 'desc' ? 'Maior primeiro' : 'Menor primeiro'}
            </div>
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
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Nenhum presidente cadastrado ainda.</td>
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
                    <td style={{ textAlign: 'center', ...getStatusColor(p.status) }}>{p.status === 'ativo' ? 'Ativo' : p.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Editar Cota */}
        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h4>Editar Cota do Presidente</h4>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>Defina a meta de famílias para cada presidente</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <select 
              value={cota.id} 
              onChange={(e) => setCota({ ...cota, id: e.target.value })}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
            >
              <option value="">Selecione um presidente...</option>
              {presidentes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <input 
              type="number" 
              value={cota.valor} 
              onChange={(e) => setCota({ ...cota, valor: e.target.value })}
              placeholder="Ex: 50" 
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }} 
            />
            
            <button className="btn btn-primary" onClick={handleSalvarCota} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }} disabled={carregando}>
              {carregando ? 'Salvando...' : 'Salvar cota'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;