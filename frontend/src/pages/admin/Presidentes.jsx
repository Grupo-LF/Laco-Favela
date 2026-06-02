import React, { useState } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { usePresidentes } from '../../hooks/usePresidentes';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';
import api from '../../services/api';

const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL_FORM);
  const [cota, setCota] = useState({ id: '', valor: '' });
  const [ordenacao, setOrdenacao] = useState({ tipo: 'ranking', ordem: 'desc' });

  // Usando a API real
  const { presidentes, loading, carregando, erros, cadastrar, atualizarCota } = usePresidentes();

  if (loading) return <p>Carregando...</p>;

  // Função para ordenar os presidentes
  const presidentesOrdenados = () => {
    const ordenados = [...presidentes];
    
    return ordenados.sort((a, b) => {
      let valorA, valorB;
      
      switch(ordenacao.tipo) {
        case 'ranking':
          valorA = b.ranking || 0;
          valorB = a.ranking || 0;
          break;
        case 'visitas':
          valorA = a.visitas || 0;
          valorB = b.visitas || 0;
          break;
        case 'participacao':
          valorA = a.eventos || 0;
          valorB = b.eventos || 0;
          break;
        case 'cotas':
          valorA = a.cota || 0;
          valorB = b.cota || 0;
          break;
        default:
          valorA = a.id;
          valorB = b.id;
      }
      
      if (ordenacao.ordem === 'desc') {
        return valorB - valorA;
      } else {
        return valorA - valorB;
      }
    });
  };

  // Função para alterar ordenação
  const handleOrdenar = (tipo) => {
    setOrdenacao(prev => ({
      tipo,
      ordem: prev.tipo === tipo && prev.ordem === 'desc' ? 'asc' : 'desc'
    }));
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
  };

  const envioForm = async (event) => {
    event.preventDefault();
    const sucesso = await cadastrar(form, () => setForm(ESTADO_INICIAL_FORM));
    if (sucesso) {
      setMostrarForm(false);
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

  const presidentesRender = presidentesOrdenados();

  // Função para definir a cor do status
  const getStatusColor = (status) => {
    return status === 'Ativo' ? { color: '#4CAF50', fontWeight: 'bold' } : { color: '#f44336', fontWeight: 'bold' };
  };

  // Função para definir a cor da penalização
  const getPenalizacaoColor = (penalizacao) => {
    if (penalizacao === 0) return { color: '#4CAF50' };
    if (penalizacao <= 3) return { color: '#FF9800' };
    return { color: '#f44336' };
  };

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
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Comunidade:</label>
                <input type="text" name="comunidade" value={form.comunidade} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cota Inicial:</label>
                <input type="number" name="cota" value={form.cota} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
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
              {presidentesRender.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Nenhum presidente cadastrado ainda.</td>
                </tr>
              ) : (
                presidentesRender.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.3s', textAlign: 'center' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', textAlign: 'center' }}>#{p.ranking}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}><strong>{p.nome}</strong></td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.comunidade}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#2196F3', textAlign: 'center' }}>{p.cota}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.visitas}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center' }}>{p.eventos}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', ...getPenalizacaoColor(p.penalizacao) }}>{p.penalizacao}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', textAlign: 'center' }}>{p.score}</td>
                    <td style={{ textAlign: 'center', ...getStatusColor(p.status) }}>{p.status}</td>
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
            
            <button className="btn btn-primary" onClick={handleSalvarCota} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Salvar cota
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default Presidentes;