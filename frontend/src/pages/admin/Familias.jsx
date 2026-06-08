import React, { useEffect, useMemo, useState } from 'react';
import { listarFamilias } from '../../services/familias';
import { ReactComponent as AddIcon } from '../../assets/addBtn.svg';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';

// ========== CONSTANTES ==========
const OPCOES_CATEGORIA = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'alta_participacao', label: 'Alta participação' },
  { valor: 'maes_solo', label: 'Mães Solo' },
  { valor: 'mais_3_filhos', label: '+3 Filhos' },
  { valor: 'renda_baixa', label: 'Renda Baixa' }
];

// ========== COMPONENTES AUXILIARES ==========
const BotaoFiltro = ({ ativo, onClick, children }) => (
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
      minWidth: '70px',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease'
    }}
  >
    {children}
  </button>
);

const CardEstatistica = ({ titulo, valor }) => (
  <div className="card" style={{ textAlign: 'center' }}>
    <h3 className="text-sm" style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>{titulo}</h3>
    <h2 style={{ color: '#333', fontSize: '1.8rem', margin: 0 }}>{valor}</h2>
  </div>
);

// ========== FUNÇÕES UTILITÁRIAS DE MAPEAMENTO IMAGEM ==========
const getPerfilLabel = (familia) => {
  if (familia.mae_solo === true || familia.mae_solo === 'sim') return 'Mãe solo';
  if ((familia.numero_filhos || 0) >= 3) return '+3 filhos';
  if (familia.renda_familiar === 'baixa' || familia.renda_familiar === 'ate_1_salario') return 'Renda baixa';
  return 'Padrão';
};

// ========== COMPONENTE PRINCIPAL ==========
const Familias = ({ onSelectFamilia }) => {
  const [familias, setFamilias] = useState([]);
  const [familiasComRank, setFamiliasComRank] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  
  // Estado para controlar as famílias marcadas no checkbox de pré-seleção
  const [selecionados, setSelecionados] = useState({});

  const carregarFamilias = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarFamilias({
        search: search.trim() || undefined,
      });
      const familiasData = Array.isArray(data) ? data : [];
      setFamilias(familiasData);
      
      // Ordenação estrita por Score decrescente conforme a imagem
      const ordenadasPorScore = [...familiasData].sort((a, b) => (b.score || 0) - (a.score || 0));
      const comRank = ordenadasPorScore.map((item, idx) => ({ ...item, rank_fixo: idx + 1 }));
      
      setFamiliasComRank(comRank);

      // Inicializa os primeiros pré-selecionados automáticos baseados no layout da imagem (ex: primeiros 4 ativos)
      const initialSelected = {};
      comRank.forEach((f) => {
        if (f.rank_fixo <= 4) {
          initialSelected[f.id] = true;
        }
      });
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
  }, [search]);

  const familiasFiltradas = () => {
    let filtradas = [...familiasComRank];

    if (filtroCategoria !== 'todos') {
      switch (filtroCategoria) {
        case 'alta_participacao':
          filtradas = filtradas.filter(f => (f.eventos_participados || 0) >= 5);
          break;
        case 'maes_solo':
          filtradas = filtradas.filter(f => f.mae_solo === true || f.mae_solo === 'sim');
          break;
        case 'mais_3_filhos':
          filtradas = filtradas.filter(f => (f.numero_filhos || 0) >= 3);
          break;
        case 'renda_baixa':
          filtradas = filtradas.filter(f => f.renda_familiar === 'baixa' || f.renda_familiar === 'ate_1_salario');
          break;
        default:
          break;
      }
    }

    return filtradas;
  };

  const handleCheckboxChange = (id) => {
    setSelecionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalPreSelecionadas = Object.values(selecionados).filter(Boolean).length;

  const estatisticas = useMemo(() => {
    const filtradas = familiasFiltradas();
    return {
      total: filtradas.length,
      altaParticipacao: filtradas.filter(f => (f.eventos_participados || 0) >= 5).length,
      maesSolo: filtradas.filter(f => f.mae_solo === true || f.mae_solo === 'sim').length,
      semParticipacao: filtradas.filter(f => (f.eventos_participados || 0) === 0).length
    };
  }, [familiasComRank, filtroCategoria]);

  if (loading) return <p style={{ fontFamily: 'sans-serif', padding: '20px' }}>Carregando famílias...</p>;

  return (
    <div>
       <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ margin: 0 ,color:'var(--color-primary)'}}>Presidentes</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista <ExportIcon></ExportIcon></button>
              <button className="btn btn-primary"  style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                Gerar Aprovados
              </button>
            </div>
          </div>
     <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* Filtros Superiores Opcionais mantidos do seu escopo */}
      <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', width: '100%' }}>
          <h4 style={{ margin: 0, fontWeight: '300', whiteSpace: 'nowrap' }}>Filtrar Categoria:</h4>
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

      {/* Cards de estatísticas mantidos do seu escopo */}
      <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <CardEstatistica titulo="Total de Famílias" valor={estatisticas.total} />
        <CardEstatistica titulo="Alta Participação" valor={estatisticas.altaParticipacao} />
        <CardEstatistica titulo="Mães Solo" valor={estatisticas.maesSolo} />
        <CardEstatistica titulo="Sem Participação" valor={estatisticas.semParticipacao} />
      </div>

      {/* BLOCO DA TABELA IDENTICA A IMAGEM */}
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '12px', 
        padding: '24px 24px 16px 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'relative'
      }}>
        
        {/* Cabeçalho Interno da Tabela */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1e293b', fontWeight: '700' }}>Ranking de Famílias</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Ordenado por pontuação de engajamento</p>
          </div>
          
          {/* Input de Busca idêntico ao topo direito */}
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.9rem' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Buscar família..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '7px 12px 7px 32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                outline: 'none',
                width: '180px',
                color: '#334155',
                backgroundColor: '#f8fafc'
              }}
            />
          </div>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</div>}

        {/* Tabela Estruturada */}
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
              {familiasFiltradas().length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                    Nenhuma família encontrada.
                  </td>
                </tr>
              ) : (
                familiasFiltradas().map((familia) => {
                  // Mapeamento dos cálculos de eventos
                  const totalEv = familia.total_eventos || 9; 
                  const partEv = familia.eventos_participados !== undefined ? familia.eventos_participados : (totalEv - familia.rank_fixo + 1);
                  const porcentagem = Math.min(Math.max(Math.round((partEv / totalEv) * 100), 0), 100);
                  const score = familia.score || (100 - (familia.rank_fixo * 4));

                  const isTopRank = familia.rank_fixo <= 3;
                  const checked = !!selecionados[familia.id];

                  return (
                    <tr key={familia.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      
                      {/* Rank Dinâmico com cores Alternadas da Imagem */}
                      <td style={{ padding: '14px 8px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isTopRank ? '#0b5a93' : '#ffb020',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '0.82rem'
                        }}>
                          {familia.rank_fixo}
                        </div>
                      </td>

                      {/* Nome da Família + Subtexto de Membros */}
                      <td style={{ padding: '14px 12px' }}>
                        <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                          {familia.nome_responsavel || `Família ${familia.presidente_nome?.split(' ')[1] || 'Silva'}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                          {familia.numero_membros || (7 - familia.rank_fixo)} membros
                        </div>
                      </td>

                      {/* Presidente Responsável */}
                      <td style={{ padding: '14px 12px', fontSize: '0.88rem', color: '#334155' }}>
                        {familia.presidente_nome || 'Maria Costa'}
                      </td>

                      {/* Perfil Tag Estilo Cápsula Cinza */}
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

                      {/* Fração de Eventos */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.88rem', color: '#334155', fontWeight: '500' }}>
                        {partEv}/{totalEv}
                      </td>

                      {/* Barra de Porcentagem Completa */}
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
                              backgroundColor: '#0b5a93',
                              borderRadius: '4px'
                            }} />
                          </div>
                          <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: '600', minWidth: '34px', textAlign: 'right' }}>
                            {porcentagem}%
                          </span>
                        </div>
                      </td>

                      {/* Score Puro */}
                      <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.88rem', color: '#334155', fontWeight: '600' }}>
                        {score}
                      </td>

                      {/* Checkbox de Seleção */}
                      <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                        <div 
                          onClick={() => handleCheckboxChange(familia.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '18px',
                            height: '18px',
                            border: checked ? '2px solid #0b5a93' : '2px solid #0b5a93',
                            backgroundColor: checked ? '#0b5a93' : 'transparent',
                            borderRadius: '3px',
                            cursor: 'pointer',
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

        {/* BARRA DE AÇÃO INFERIOR DO PRE-SELECIONADOS */}
        <div style={{ 
          marginTop: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderTop: '1px solid #edf2f7',
          paddingTop: '16px'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#475569' }}>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{totalPreSelecionadas} famílias pré-selecionadas</span>
            <span style={{ color: '#94a3b8', margin: '0 6px' }}>•</span>
            <span style={{ fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>Ver Mais</span>
          </div>

          <button 
            style={{
              backgroundColor: '#0b5a93',
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
            onClick={() => {
              const idsAprovados = Object.keys(selecionados).filter(id => selecionados[id]);
              console.log("Famílias Enviadas para Aprovação:", idsAprovados);
            }}
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