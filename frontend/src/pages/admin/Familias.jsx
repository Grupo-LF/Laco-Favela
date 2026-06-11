import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { listarFamilias, aprovarFamilias } from '../../services/familias';
import { ReactComponent as AddIcon } from '../../assets/addBtn.svg';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';
import { FaSearch } from 'react-icons/fa';

// ========== CONSTANTES ==========
const OPCOES_CATEGORIA = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'alta_participacao', label: 'Alta participação' },
  { valor: 'maes_solo', label: 'Mães Solo' },
  { valor: 'mais_3_filhos', label: '+3 Filhos' },
  { valor: 'baixa_renda', label: 'Baixa Renda' },
  { valor: 'idosos', label: 'Idosos' }
];

// ========== COMPONENTES AUXILIARES ==========
const BotaoFiltro = ({ ativo, onClick, children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button
      className="badge"
      onClick={onClick}
      style={{
        backgroundColor: ativo ? 'var(--color-primary)' : '#DFDFDF',
        color: ativo ? '#fff' : '#333',
        cursor: 'pointer',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '20px',
        minWidth: isMobile ? '90%' : '70px',
        minHeight: isMobile ? '100%' : 'auto',
        width: isMobile ? '100%' : 'auto',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        transition: 'all 0.3s ease',
        fontSize: 'clamp(0.7rem, 3vw, 0.85rem)'
      }}
    >
      {children}
    </button>
  );
};
const CardEstatistica = ({ titulo, valor }) => (
  <div className="card" style={{ textAlign: 'start' }}>
    <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: '900', textAlign: 'start' }}>{titulo}</h3>
    <h2 style={{ color: '#333', fontSize: '1.8rem', margin: 0 }}>{valor}</h2>
  </div>
);

// ========== COMPONENTE MODAL DE CONFIRMAÇÃO ==========
const ModalConfirmacao = ({ isOpen, onClose, onConfirm, totalSelecionados, aprovando }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', fontWeight: '600', textAlign: 'center', color: 'var(--color-primary)' }}>
          {aprovando ? 'Processando...' : 'Deseja confirmar seleção e gerar aprovados?'}
        </h2>

        {!aprovando && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', margin: '20px 30px' }}>
            <button
              onClick={onConfirm}
              style={{
                padding: '8px 18px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Sim
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '8px 18px',
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Não
            </button>
          </div>
        )}

        {aprovando && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

// ========== FUNÇÕES UTILITÁRIAS ==========
const getPerfilLabel = (familia) => {
  switch (familia.perfil) {
    case 'mae_solo':
      return 'Mãe solo';
    case 'baixa_renda':
      return 'Baixa renda';
    case 'mais_3_filhos':
      return '+3 filhos';
    case 'idosos':
      return 'Idosos';
    default:
      return 'Padrão';
  }
};

// ========== COMPONENTE PRINCIPAL ==========
const Familias = ({ onSelectFamilia }) => {
  const [familias, setFamilias] = useState([]);
  const [familiasComRank, setFamiliasComRank] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [selecionados, setSelecionados] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [aprovando, setAprovando] = useState(false);

  // Carregar todas as famílias uma vez
  const carregarFamilias = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarFamilias({});
      const familiasData = Array.isArray(data) ? data : [];
      setFamilias(familiasData);

      // Ordenar por score
      const ordenadasPorScore = [...familiasData].sort((a, b) => (b.score || 0) - (a.score || 0));
      const comRank = ordenadasPorScore.map((item, idx) => ({ ...item, rank_fixo: idx + 1 }));

      setFamiliasComRank(comRank);

      // Pré-selecionar as 4 primeiras NÃO APROVADAS
      const initialSelected = {};
      let count = 0;
      for (const f of comRank) {
        if (count < 4 && !f.aprovada) {
          initialSelected[f.id] = true;
          count++;
        }
      }
      setSelecionados(initialSelected);
    } catch (err) {
      setError('Não foi possível carregar as famílias.');
      console.error('Erro ao carregar famílias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFamilias();
  }, []);

  // Função para aprovar as famílias selecionadas
  const handleAprovar = async () => {
    const idsAprovados = Object.keys(selecionados).filter(id => selecionados[id]);

    if (idsAprovados.length === 0) {
      alert('Nenhuma família selecionada para aprovação');
      return;
    }
    console.log(idsAprovados)
    setAprovando(true);

    try {
      const response = await aprovarFamilias(idsAprovados);
      console.log("Famílias aprovadas:", response);

      // Recarregar a lista
      await carregarFamilias();

      // Fechar modal e limpar seleções
      setShowModal(false);
      setSelecionados({});

      alert(response.mensagem || `${idsAprovados.length} família(s) aprovada(s) com sucesso!`);

    } catch (err) {
      console.error('Erro ao aprovar famílias:', err);
      alert('Erro ao aprovar famílias. Tente novamente.');
    } finally {
      setAprovando(false);
    }
  };

  // Filtro LOCAL - sem requisição ao backend
  const familiasFiltradas = useMemo(() => {
    let filtradas = [...familiasComRank];

    // Filtro por categoria
    if (filtroCategoria !== 'todos') {
      switch (filtroCategoria) {
        case 'alta_participacao':
          filtradas = filtradas.filter(f => (f.score || 0) >= 70);
          break;
        case 'maes_solo':
          filtradas = filtradas.filter(f => f.perfil === 'mae_solo');
          break;
        case 'mais_3_filhos':
          filtradas = filtradas.filter(f => f.perfil === 'mais_3_filhos');
          break;
        case 'baixa_renda':
          filtradas = filtradas.filter(f => f.perfil === 'baixa_renda');
          break;
        case 'idosos':
          filtradas = filtradas.filter(f => f.perfil === 'idosos');
          break;
        default:
          break;
      }
    }

    // Filtro por busca LOCAL (nome do responsável)
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtradas = filtradas.filter(f =>
        f.nome_responsavel?.toLowerCase().includes(searchLower)
      );
    }

    return filtradas;
  }, [familiasComRank, filtroCategoria, search]);

  const handleCheckboxChange = (id) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalPreSelecionadas = Object.values(selecionados).filter(Boolean).length;

  const estatisticas = useMemo(() => {
    return {
      total: familiasFiltradas.length,
      altaParticipacao: familiasFiltradas.filter(f => (f.score || 0) >= 70).length,
      maesSolo: familiasFiltradas.filter(f => f.perfil === 'mae_solo').length,
      semParticipacao: familiasFiltradas.filter(f => (f.eventos_compareceu || 0) === 0).length
    };
  }, [familiasFiltradas]);

  // Limpar busca
  const limparBusca = () => {
    setSearch('');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ fontFamily: 'sans-serif', padding: '20px' }}>Carregando famílias...</p>
      </div>
    );
  }

  return (
    <div>
      <ModalConfirmacao
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleAprovar}
        totalSelecionados={totalPreSelecionadas}
        aprovando={aprovando}
      />

      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Famílias</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'nowrap' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 0.8rem', cursor: 'pointer' }}>Exportar lista <ExportIcon /></button>
          <button
            className="btn btn-primary"
            style={{ padding: '0.5rem 0.8rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
            onClick={() => setShowModal(true)}
          >
            Gerar Aprovados
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>

        <div className="card" style={{
          padding: '1rem',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '1rem'
        }}>

          {/* Desktop: linha com Filtrar à esquerda */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            width: '100%'
          }} className="filter-desktop">
            <h4 style={{ margin: 0, fontWeight: '300', whiteSpace: 'nowrap' }}>Filtrar Categoria:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {OPCOES_CATEGORIA.map(opcao => (
                <BotaoFiltro
                  key={opcao.valor}
                  ativo={filtroCategoria === opcao.valor}
                  onClick={() => setFiltroCategoria(opcao.valor)}
                >
                  {opcao.label}
                </BotaoFiltro>
              ))}
            </div>
          </div>
          {/* Mobile: Filtrar no centro + grid 2x3 */}
          <div className="filter-mobile" style={{ display: 'none' }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              fontWeight: '600',
              textAlign: 'center',
              color: 'var(--color-primary)'
            }}>Filtrar Categoria</h4>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(100px, 140px))',  /* ← largura fixa das colunas */
              gap: '0.5rem',
              justifyContent: 'center',  /* ← centraliza o grid */
              justifyItems: 'center'      /* ← centraliza os botões dentro das células */
            }}>
              {OPCOES_CATEGORIA.map(opcao => (
                <BotaoFiltro
                  
                  key={opcao.valor}
                  ativo={filtroCategoria === opcao.valor}
                  onClick={() => setFiltroCategoria(opcao.valor)}
                >
                  {opcao.label}
                </BotaoFiltro>
              ))}
            </div>
          </div>

          <style>{`
    @media (max-width: 768px) {
      .filter-desktop {
        display: none !important;
      }
      .filter-mobile {
        display: block !important;
      }
    }
  `}</style>
        </div>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <CardEstatistica titulo="Total de Famílias" valor={estatisticas.total} />
          <CardEstatistica titulo="Alta Participação" valor={estatisticas.altaParticipacao} />
          <CardEstatistica titulo="Mães Solo" valor={estatisticas.maesSolo} />
          <CardEstatistica titulo="Sem Participação" valor={estatisticas.semParticipacao} />
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px 24px 16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e293b', fontWeight: '700' }}>Ranking de Famílias</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Ordenado por pontuação de engajamento</p>
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '0.9rem'
              }}>
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 12px 8px 32px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  width: '220px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              {search && (
                <button
                  onClick={limparBusca}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: '#94a3b8',
                    padding: '2px'
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</div>}

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', width: '70px' }}>RANK</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em' }}>FAMÍLIA</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em' }}>PRESIDENTE RESP.</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'center' }}>PERFIL</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'center' }}>EVENTOS</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', width: '160px' }}>PART. (%)</th>
                  <th style={{ padding: '12px 12px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'center' }}>SCORE</th>
                  <th style={{ padding: '12px 8px', fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.05em', textAlign: 'center', width: '100px' }}>PRÉ-SELEÇÃO</th>
                </tr>
              </thead>
              <tbody>
                {familiasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                      {search ? `Nenhuma família encontrada para "${search}"` : 'Nenhuma família encontrada.'}
                    </td>
                  </tr>
                ) : (
                  familiasFiltradas.map((familia) => {
                    const totalEv = familia.total_eventos || 9;
                    const partEv = familia.eventos_compareceu || 0;
                    const porcentagem = familia.participacao_num || Math.min(Math.max(Math.round((partEv / totalEv) * 100), 0), 100);
                    const score = familia.score || porcentagem;
                    const isTopRank = familia.rank_fixo <= 3;
                    const checked = !!selecionados[familia.id];
                    const nomePresidente = familia.presidente?.nome || familia.presidente_nome || 'Não definido';
                    const jaAprovada = familia.aprovada === true;

                    return (
                      <tr key={familia.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: jaAprovada ? 0.6 : 1 }}>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: isTopRank ? 'var(--color-primary)' : '#ffb020',
                            color: isTopRank ? '#fff' : '#000',
                            fontWeight: 'bold',
                            fontSize: '0.82rem'
                          }}>
                            {familia.rank_fixo}
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                            {familia.nome_responsavel}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                            {familia.num_membros} membros
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', fontSize: '0.88rem', color: '#334155' }}>
                          {nomePresidente}
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                          <span style={{
                            backgroundColor: '#e2e8f0',
                            color: '#475569',
                            padding: '4px 14px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: '500',
                            display: 'inline-block'
                          }}>
                            {getPerfilLabel(familia)}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                          {partEv}/{totalEv}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              flex: 1,
                              height: '8px',
                              backgroundColor: '#e2e8f0',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              minWidth: '70px'
                            }}>
                              <div style={{
                                width: `${porcentagem}%`,
                                height: '100%',
                                backgroundColor: 'var(--color-primary)',
                                borderRadius: '4px'
                              }} />
                            </div>
                            <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '600', minWidth: '34px', textAlign: 'right' }}>
                              {porcentagem}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                          {score}
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                          <div
                            onClick={() => !jaAprovada && handleCheckboxChange(familia.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '18px',
                              height: '18px',
                              border: '2px solid var(--color-primary)',
                              backgroundColor: checked ? 'var(--color-primary)' : 'transparent',
                              borderRadius: '3px',
                              cursor: jaAprovada ? 'not-allowed' : 'pointer',
                              opacity: jaAprovada ? 0.5 : 1,
                              transition: 'all 0.1s ease'
                            }}
                          >
                            {checked && (
                              <span style={{ color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', lineHeight: 1 }}>
                                ✓
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #edf2f7', paddingTop: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontSize: '0.88rem', color: '#475569' }}>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{totalPreSelecionadas} famílias pré-selecionadas</span>
              <span style={{ color: '#94a3b8', margin: '0 6px' }}>•</span>
              <span
                style={{ fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}
                onClick={() => {
                  setFiltroCategoria('todos');
                  setSearch('');
                }}
              >
                Ver Mais
              </span>
            </div>

            <button
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.88rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(11, 90, 147, 0.2)'
              }}
              onClick={() => setShowModal(true)}
            >
              Confirmar seleção e gerar aprovados
              <span style={{ fontSize: '0.95rem' }}>✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Familias;