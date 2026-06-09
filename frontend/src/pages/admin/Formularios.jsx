import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactComponent as AddCircle } from '../../assets/add_circle.svg';
import { ReactComponent as Assign } from '../../assets/assignment.svg';
import { ReactComponent as Note } from '../../assets/note_alt.svg';
import { getCiclos, getCicloDetalhado } from '../../services/formularios';
import { listarPresidentes } from '../../services/presidente';

// ========== CONSTANTES ==========
const STATUS_MAP = {
  'concluido': 'Completo',
  'completo': 'Completo',
  'em_andamento': 'Em andamento',
  'pendente': 'Pendente',
  'nao_iniciado': 'Pendente',
  'enviado': 'Completo'
};

const STATUS_COLORS = {
  'Completo': 'var(--color-primary)',
  'Em andamento': '#FF9800',
  'Pendente': '#FFB133'
};

// Cores dos badges por status do ciclo
const getBadgeStyle = (status) => {
  if (status === 'ativo') {
    return {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--white)'
    };
  }
  if (status === 'rascunho') {
    return {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-primary)'
    };
  }
  return {
    backgroundColor: '#999',
    color: 'var(--white)'
  };
};

// ========== COMPONENTES FILHOS ==========
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
    <p>Carregando formulários...</p>
  </div>
);

const EmptyState = ({ onNavigate }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <p style={{ marginBottom: '1rem' }}>Nenhum formulário disponível.</p>
    <button className="btn btn-primary" style={{backgroundColor:'var(--color-primary)'}} onClick={() => onNavigate('criar-formulario')}>
      Criar formulário
    </button>
  </div>
);

const CicloCard = ({ ciclo, stats, isSelected, isMobile, onSelect }) => {
  const badgeStyle = getBadgeStyle(ciclo.status);
  
  return (
    <div
      className="card"
      style={{
        position: 'relative',
        cursor: 'pointer',
        opacity: isSelected ? 1 : 0.7,
        padding: isMobile ? '1rem' : '1.5rem'
      }}
      onClick={onSelect}
    >
      {ciclo.status === 'ativo' ? <Assign /> : ciclo.status === 'rascunho' ? <Note /> : <Assign />}
      
      <span 
        className="badge" 
        style={{ 
          position: 'absolute', 
          top: '10%', 
          right: '5%',
          backgroundColor: badgeStyle.backgroundColor,
          color: badgeStyle.color,
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}
      >
        {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
      </span>
      
      <h2 className='mt-3' style={{ fontWeight: '800', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>{ciclo.titulo}</h2>
      <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e0e0e0' }} />

      {ciclo.status === 'ativo' && (
        <div className="flex gap-2 text-sm" style={{ marginTop: '1rem', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '0.5rem' : '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ borderRadius:'50%',width: '1rem', height: '1rem', backgroundColor:'#5ED262' }} />
            <span>{stats.completas} respondidos</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ borderRadius:'50%',width: '1rem', height: '1rem', backgroundColor:'rgba(222, 47, 47,0.8)' }} />
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
};

const TabelaRespostas = ({ formularioAtual, presidentesDoCiclo, isMobile, onNavigate }) => {
  if (presidentesDoCiclo.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Nenhum presidente associado a este formulário ainda.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', minWidth: isMobile ? '500px' : '600px' }}>
        <thead>
          <tr style={{ color: '#A1A1A1', fontSize: '12px', fontWeight: 600 }}>
            <th></th>
            <th>Presidente</th>
            <th>Respondido em</th>
            <th>Famílias</th>
            <th>Eventos</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {presidentesDoCiclo.map((presidente) => (
            <tr key={presidente.id}>
                <td style={{position:'relative',width:'0'}}>
                    <div style={{ backgroundColor: '#D9D9D9', borderRadius: '50%', width: isMobile ? '2.5rem' : '3rem', height: isMobile ? '2.5rem' : '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <strong>{getIniciais(presidente.nome)}</strong>
                    </div>
                  
              </td>
              <td><h3>{presidente.nome}</h3></td>
              <td style={{ minWidth: '100px' }}>{formatarData(presidente.respondido_em)}</td>
              <td style={{ textAlign: 'center',  }}>{presidente.familias_cadastradas || 0}</td>
              <td style={{ textAlign: 'center', minWidth: '70px' }}>{presidente.eventos_realizados || 0}</td>
              <td>
                <span className="badge" style={{
                  backgroundColor: STATUS_COLORS[mapearStatus(presidente.status)],
                  color: 'black',
                  padding: isMobile ? '4px 8px' : '6px 12px',
                  fontSize: isMobile ? '0.7rem' : '0.8rem'
                }}>
                  {mapearStatus(presidente.status)}
                </span>
              </td>
              <td style={{position:'relative', left:'4%'}}>
                {mapearStatus(presidente.status) === 'Completo'
                  ? <button className="btn btn-outline" style={{ padding: isMobile ? '4px 8px' : '6px 12px', fontSize: isMobile ? '0.7rem' : '0.8rem' }} onClick={() => onNavigate('ver-formulario', { respostaId: presidente.resposta_id })}>Ver</button>
                  : <button className="btn btn-primary" style={{backgroundColor:'var(--color-primary)',color:'#fff', padding: isMobile ? '4px 8px' : '6px 12px', fontSize: isMobile ? '0.7rem' : '0.8rem' }} onClick={() => onNavigate('notificar', { presidenteId: presidente.id, nome: presidente.nome })}>Notificar</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ========== FUNÇÕES UTILITÁRIAS ==========
const getIniciais = (nome) => {
  if (!nome) return '??';
  return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

const mapearStatus = (status) => STATUS_MAP[status] || status;

// ========== COMPONENTE PRINCIPAL ==========
const Formularios = ({ onNavigate }) => {
  // Estados
  const [showVerTodos, setShowVerTodos] = useState(false);
  const [formularioAtual, setFormularioAtual] = useState(null);
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [presidentesDoCiclo, setPresidentesDoCiclo] = useState([]);
  const [todosPresidentes, setTodosPresidentes] = useState([]);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [estatisticasCiclos, setEstatisticasCiclos] = useState({});

  // Handlers de resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const carregarDados = async () => {
      await Promise.all([carregarCiclos(), carregarPresidentes()]);
    };
    carregarDados();
  }, []);

  const carregarPresidentes = useCallback(async () => {
    try {
      const data = await listarPresidentes();
      setTodosPresidentes(data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err);
      setError('Erro ao carregar lista de presidentes');
    }
  }, []);

  const carregarEstatisticasDosCiclos = useCallback(async (ciclosList) => {
    const novasEstatisticas = {};

    await Promise.all(ciclosList.map(async (ciclo) => {
      try {
        const cicloDetalhado = await getCicloDetalhado(ciclo.id);
        const presidentes = cicloDetalhado.presidentes_associados || [];
        const completas = presidentes.filter(p =>
          ['concluido', 'completo', 'enviado'].includes(p.status)
        ).length;

        novasEstatisticas[ciclo.id] = {
          total: presidentes.length,
          completas,
          pendentes: presidentes.length - completas
        };
      } catch (error) {
        console.error(`Erro ao carregar estatísticas do ciclo ${ciclo.id}:`, error);
        novasEstatisticas[ciclo.id] = { total: 0, completas: 0, pendentes: 0 };
      }
    }));

    setEstatisticasCiclos(novasEstatisticas);
  }, []);

  const carregarCiclos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCiclos();
      setCiclos(data);
      await carregarEstatisticasDosCiclos(data);

      if (data.length > 0) {
        await selecionarCiclo(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar ciclos:', error);
    } finally {
      setLoading(false);
    }
  }, [carregarEstatisticasDosCiclos]);

  const selecionarCiclo = useCallback(async (ciclo) => {
    try {
      const cicloDetalhado = await getCicloDetalhado(ciclo.id);
      setFormularioAtual(cicloDetalhado);
      setPresidentesDoCiclo(cicloDetalhado.presidentes_associados || []);
    } catch (error) {
      console.error('Erro ao carregar detalhes do ciclo:', error);
      setFormularioAtual(ciclo);
      setPresidentesDoCiclo([]);
    }
  }, []);

  const handleSelecionarCiclo = useCallback(async (ciclo) => {
    await selecionarCiclo(ciclo);
    setShowVerTodos(false);
  }, [selecionarCiclo]);

  // Memoized values
  const totalPresidentes = useMemo(() => presidentesDoCiclo.length, [presidentesDoCiclo.length]);
  const respostasCompletas = useMemo(() =>
    presidentesDoCiclo.filter(p => ['concluido', 'completo', 'enviado'].includes(p.status)).length,
    [presidentesDoCiclo]
  );

  // Renderização condicional
  if (loading) return <LoadingSpinner />;

  // Tela "Ver todos"
  if (showVerTodos) {
    return (
      <div>
        <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
          <div className="flex">
            <Note style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
            <h2>Todos os formulários</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setShowVerTodos(false)}>← Voltar</button>
        </div>

        <div className="view-section active" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          {ciclos.length === 0 ? (
            <EmptyState onNavigate={onNavigate} />
          ) : (
            ciclos.map((ciclo) => {
              const stats = estatisticasCiclos[ciclo.id] || { total: 0, completas: 0, pendentes: 0 };
              const badgeStyle = getBadgeStyle(ciclo.status);
              
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
                  onClick={() => handleSelecionarCiclo(ciclo)}
                >
                  <div>
                    <strong>{ciclo.titulo}</strong>
                    <p className="text-sm" style={{ margin: '5px 0 0 0', color: '#666' }}>
                      Status: 
                      <span 
                        style={{ 
                          marginLeft: '8px',
                          backgroundColor: badgeStyle.backgroundColor,
                          color: badgeStyle.color,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}
                      >
                        {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
                      </span>
                    </p>
                    {ciclo.status === 'ativo' && (
                      <p className="text-sm" style={{ margin: '5px 0 0 0', color: '#888' }}>
                        {stats.total} presidentes | {stats.completas} respondidos | {stats.pendentes} pendentes
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
    );
  }

  // Tela inicial sem formulários
  if (ciclos.length === 0 || !formularioAtual) {
    return (
      <div>
        <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
          <h2 style={{ color: 'var(--color-primary)' }}>Formulários</h2>
          <button className="btn" style={{ color: '#fff', backgroundColor: 'var(--color-primary)' }} onClick={() => setShowVerTodos(true)}>Ver todos</button>
        </div>
        <EmptyState onNavigate={onNavigate} />
      </div>
    );
  }

  // Tela principal com formulários
  return (
    <div>
      <div className="header" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '0' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Formulários</h2>
        <button className="btn" style={{ color: '#fff', backgroundColor: 'var(--color-primary)', border: 'none' }} onClick={() => setShowVerTodos(true)}>Ver todos</button>
      </div>

      <div className="view-section active" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
        <div className="grid-3" style={{
          gap: 20,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
        }}>
          {ciclos.map((ciclo) => {
            const stats = estatisticasCiclos[ciclo.id] || { total: 0, completas: 0, pendentes: 0 };
            return (
              <CicloCard
                key={ciclo.id}
                ciclo={ciclo}
                stats={stats}
                isSelected={formularioAtual.id === ciclo.id}
                isMobile={isMobile}
                onSelect={() => handleSelecionarCiclo(ciclo)}
              />
            );
          })}

          <div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: isMobile ? '1rem' : '1.5rem' }}
            onClick={() => onNavigate('criar-formulario')}
          >
            <AddCircle />
            <h3 style={{ marginTop: '0.5rem', fontSize: isMobile ? '1rem' : '1.2rem' }}>Novo Formulário</h3>
          </div>
        </div>

        <div className="card" style={{ padding: isMobile ? '1rem' : '1.5rem' }}>
          <h3 style={{ fontWeight: '700', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>Respostas recentes</h3>
          <p className="text-sm" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Formulário: {formularioAtual.titulo}
          </p>

          <TabelaRespostas
            formularioAtual={formularioAtual}
            presidentesDoCiclo={presidentesDoCiclo}
            isMobile={isMobile}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default Formularios;