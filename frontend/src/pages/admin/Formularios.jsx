import React, { useState, useEffect } from 'react';
import { ReactComponent as GrayIcon } from '../../assets/Square_gray.svg';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { getCiclos, getCicloDetalhado } from '../../services/formularios';
import { listarPresidentes } from '../../services/presidente';

const Formularios = ({ onNavigate }) => {
  const [showVerTodos, setShowVerTodos] = useState(false);
  const [formularioAtual, setFormularioAtual] = useState(null);
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presidentesDoCiclo, setPresidentesDoCiclo] = useState([]);
  const [todosPresidentes, setTodosPresidentes] = useState([]);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [estatisticasCiclos, setEstatisticasCiclos] = useState({}); // Armazena estatísticas por ciclo

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    carregarCiclos();
    carregarPresidentes();
  }, []);

  const carregarPresidentes = async () => {
    try {
      const data = await listarPresidentes();
      setTodosPresidentes(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err);
      setError('Erro ao carregar lista de presidentes');
    }
  };

  const carregarCiclos = async () => {
    try {
      setLoading(true);
      const data = await getCiclos();
      setCiclos(data);
      
      // Carrega estatísticas para cada ciclo
      await carregarEstatisticasDosCiclos(data);
      
      if (data.length > 0) {
        await selecionarCiclo(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar ciclos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar estatísticas de cada ciclo
  const carregarEstatisticasDosCiclos = async (ciclosList) => {
    const novasEstatisticas = {};
    
    for (const ciclo of ciclosList) {
      try {
        const cicloDetalhado = await getCicloDetalhado(ciclo.id);
        const presidentes = cicloDetalhado.presidentes_associados || [];
        
        const completas = presidentes.filter(p => 
          p.status === 'concluido' || p.status === 'completo' || p.status === 'enviado'
        ).length;
        
        novasEstatisticas[ciclo.id] = {
          total: presidentes.length,
          completas: completas,
          pendentes: presidentes.length - completas
        };
      } catch (error) {
        console.error(`Erro ao carregar estatísticas do ciclo ${ciclo.id}:`, error);
        novasEstatisticas[ciclo.id] = { total: 0, completas: 0, pendentes: 0 };
      }
    }
    
    setEstatisticasCiclos(novasEstatisticas);
  };

  const selecionarCiclo = async (ciclo) => {
    try {
      const cicloDetalhado = await getCicloDetalhado(ciclo.id);
      setFormularioAtual(cicloDetalhado);
      console.log('Ciclo detalhado:', cicloDetalhado);
      setPresidentesDoCiclo(cicloDetalhado.presidentes_associados || []);
    } catch (error) {
      console.error('Erro ao carregar detalhes do ciclo:', error);
      setFormularioAtual(ciclo);
      setPresidentesDoCiclo([]);
    }
  };

  const handleSelecionarCiclo = async (ciclo, index) => {
    await selecionarCiclo(ciclo);
    setShowVerTodos(false);
  };

  const getIniciais = (nome) => {
    if (!nome) return '??';
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatarData = (dataString) => {
    if (!dataString) return 'Não respondido';
    const data = new Date(dataString);
    const agora = new Date();
    const diffDias = Math.floor((agora - data) / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return `Hoje ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDias === 1) return `Ontem ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return data.toLocaleDateString('pt-BR');
  };

  const mapearStatus = (status) => {
    const statusMap = {
      'concluido': 'Completo',
      'completo': 'Completo',
      'em_andamento': 'Em andamento',
      'pendente': 'Pendente',
      'nao_iniciado': 'Pendente',
      'enviado': 'Completo'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <p>Carregando formulários...</p>
      </div>
    );
  }

  if (showVerTodos) {
    return (
      <div>
        <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
          <div className="flex">
            <BlacktIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
            <h2>Todos os formulários</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setShowVerTodos(false)}>← Voltar</button>
        </div>

        <div className="view-section active" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <div>
            {ciclos.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ marginBottom: '1rem' }}>Nenhum formulário cadastrado ainda.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('criar-formulario')}>
                  Criar primeiro formulário
                </button>
              </div>
            ) : (
              ciclos.map((ciclo, idx) => {
                const stats = estatisticasCiclos[ciclo.id] || { total: 0, completas: 0, pendentes: 0 };
                return (
                  <div 
                    className="card" 
                    key={ciclo.id} 
                    style={{ 
                      borderBottom: '1px solid #eee', 
                      cursor: 'pointer', 
                      marginBottom: '1rem', 
                      display: 'flex', 
                      flexDirection: isMobile ? 'column' : 'row',
                      justifyContent: 'space-between',
                      gap: isMobile ? '0.5rem' : '0'
                    }} 
                    onClick={() => handleSelecionarCiclo(ciclo, idx)}
                  >
                    <div>
                      <strong>{ciclo.titulo}</strong>
                      <p className="text-sm" style={{ margin: '5px 0 0 0', color: '#666' }}>
                        Status: {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
                      </p>
                      {ciclo.status === 'ativo' && (
                        <p className="text-sm" style={{ margin: '5px 0 0 0', color: '#888' }}>
                          👥 {stats.total} presidentes | ✅ {stats.completas} respondidos | ⏳ {stats.pendentes} pendentes
                        </p>
                      )}
                    </div>
                    <p className="text-sm" style={{ margin: 0, color: '#666' }}>
                      Criado em: {new Date(ciclo.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  if (ciclos.length === 0 || !formularioAtual) {
    return (
      <div>
        <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
          <h2>Formulários</h2>
          <button className="btn btn-primary" onClick={() => setShowVerTodos(true)}>Ver todos</button>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>Nenhum formulário disponível.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('criar-formulario')}>
            Criar formulário
          </button>
        </div>
      </div>
    );
  }

  const totalPresidentes = presidentesDoCiclo.length;
  const respostasCompletas = presidentesDoCiclo.filter(p => p.status === 'concluido' || p.status === 'completo' || p.status === 'enviado').length;
  const respostasPendentes = totalPresidentes - respostasCompletas;

  return (
    <div>
      <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
        <h2>Formulários</h2>
        <button className="btn btn-primary" onClick={() => setShowVerTodos(true)}>Ver todos</button>
      </div>

      <div className="view-section active" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
        <div className="grid-3" style={{ 
          gap: 20, 
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
        }}>
          {ciclos.map((ciclo) => {
            // Pega as estatísticas calculadas para este ciclo
            const stats = estatisticasCiclos[ciclo.id] || { total: 0, completas: 0, pendentes: 0 };
            
            return (
              <div 
                key={ciclo.id} 
                className="card" 
                style={{ 
                  position: 'relative', 
                  cursor: 'pointer', 
                  opacity: formularioAtual.id === ciclo.id ? 1 : 0.7,
                  padding: isMobile ? '1rem' : '1.5rem'
                }} 
                onClick={() => handleSelecionarCiclo(ciclo, ciclos.indexOf(ciclo))}
              >
                <GrayIcon />
                <span className="badge" style={{ position: 'absolute', top: '10%', right: '10%' }}>
                  {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
                </span>
                <h3 className='mt-3' style={{ fontWeight: '700', fontSize: isMobile ? '1rem' : '1.2rem' }}>{ciclo.titulo}</h3>
                <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e0e0e0' }} />
                
                {ciclo.status === 'ativo' && (
                  <div className="flex gap-2 text-sm" style={{ marginTop: '1rem', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.5rem' : '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GrayIcon style={{ width: '1.5rem', height: '1.5rem' }} /> 
                      <span>{stats.completas} respondidos</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <GrayIcon style={{ width: '1.5rem', height: '1.5rem' }} /> 
                      <span>{stats.pendentes} pendentes</span>
                    </div>
                  </div>
                )}
                
                {ciclo.status === 'rascunho' && (
                  <p className="text-sm" style={{ marginTop: '1rem' }}>
                    Última edição: {new Date(ciclo.atualizado_em || ciclo.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            );
          })}
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: isMobile ? '1rem' : '1.5rem' }} 
               onClick={() => onNavigate('criar-formulario')}>
            <GrayIcon />
            <h3 style={{ marginTop: '0.5rem', fontSize: isMobile ? '1rem' : '1.2rem' }}>Novo Formulário</h3>
          </div>
        </div>

        <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <h3 style={{ fontWeight: '700', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Respostas recentes</h3>
          <p className="text-sm" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Formulário: {formularioAtual.titulo}
          </p>

          {presidentesDoCiclo.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p>Nenhum presidente associado a este formulário ainda.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: isMobile ? '500px' : '600px' }}>
                <thead>
                  <tr style={{ color: '#A1A1A1', fontSize: '12px', fontWeight: 600 }}>
                    <th>Presidente</th>
                    <th>Respondido em</th>
                    <th>Famílias</th>
                    <th>Eventos</th>
                    <th>Status</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {presidentesDoCiclo.map((presidente, i) => (
                    <tr key={presidente.id || i}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '150px' }}>
                          <div style={{ backgroundColor: '#D9D9D9', borderRadius: '50%', width: isMobile ? '2.5rem' : '3rem', height: isMobile ? '2.5rem' : '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <strong style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>{getIniciais(presidente.nome)}</strong>
                          </div>
                          <strong style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>{presidente.nome}</strong>
                        </div>
                      </td>
                      <td style={{ minWidth: '100px', fontSize: isMobile ? '0.8rem' : '0.9rem' }}>{formatarData(presidente.respondido_em)}</td>
                      <td style={{ textAlign: 'center', minWidth: '70px', fontSize: isMobile ? '1rem' : '1.2rem' }}>{presidente.familias_cadastradas || 0}</td>
                      <td style={{ textAlign: 'center', minWidth: '70px', fontSize: isMobile ? '1rem' : '1.2rem' }}>{presidente.eventos_realizados || 0}</td>
                      <td>
                        <span className="badge" style={{
                          backgroundColor: mapearStatus(presidente.status) === 'Completo' ? '#4CAF50' : '#FF9800',
                          color: 'white',
                          padding: isMobile ? '4px 8px' : '6px 12px',
                          fontSize: isMobile ? '0.7rem' : '0.8rem'
                        }}>
                          {mapearStatus(presidente.status)}
                        </span>
                       </td>
                      <td style={{ minWidth: '100px' }}>
                        {mapearStatus(presidente.status) === 'Completo'
                          ? <button className="btn btn-outline" style={{ padding: isMobile ? '4px 8px' : '6px 12px', fontSize: isMobile ? '0.7rem' : '0.8rem' }} onClick={() => onNavigate('ver-formulario', { respostaId: presidente.resposta_id })}>Ver</button>
                          : <button className="btn btn-primary" style={{ padding: isMobile ? '4px 8px' : '6px 12px', fontSize: isMobile ? '0.7rem' : '0.8rem' }} onClick={() => onNavigate('notificar', { presidenteId: presidente.id, nome: presidente.nome })}>Notificar</button>
                        }
                       </td>
                    </tr>
                  ))}
                </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Formularios;