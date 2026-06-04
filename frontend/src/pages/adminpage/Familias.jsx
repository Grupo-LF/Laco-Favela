import React, { useEffect, useMemo, useState } from 'react';
import { listarFamilias } from '../../services/familias';

const STATUS_LABELS = {
  pendente: 'Pendente',
  aprovada: 'Aprovada',
  lista_espera: 'Lista de espera',
};

const Familias = ({ onSelectFamilia }) => {
  const [familias, setFamilias] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [filtroPresidente, setFiltroPresidente] = useState('todos');

  const carregarFamilias = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarFamilias({
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setFamilias(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Nao foi possivel carregar as familias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarFamilias();
  }, [search, statusFilter]);

  const totals = useMemo(() => {
    const base = { total: familias.length, aprovadas: 0, pendentes: 0, listaEspera: 0 };
    return familias.reduce((acc, familia) => {
      if (familia.status === 'aprovada') acc.aprovadas += 1;
      if (familia.status === 'pendente') acc.pendentes += 1;
      if (familia.status === 'lista_espera') acc.listaEspera += 1;
      return acc;
    }, base);
  }, [familias]);

  // Aplicar todos os filtros
  const familiasFiltradas = () => {
    let filtradas = [...familias];

    // Filtro por categoria
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

    // Filtro por presidente
    if (filtroPresidente !== 'todos') {
      switch (filtroPresidente) {
        case 'presidente_1':
          filtradas = filtradas.filter(f => f.presidente_id === 1 || f.presidente_nome === 'João Silva');
          break;
        case 'presidente_2':
          filtradas = filtradas.filter(f => f.presidente_id === 2 || f.presidente_nome === 'Maria Oliveira');
          break;
        default:
          break;
      }
    }

    return filtradas;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <div className="header" style={{ 
        marginBottom: '0', 
        borderBottom: 'none'
      }}>
        <h2 style={{ marginBottom: '0.5rem' }}>Famílias</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline" disabled title="Funcionalidade em breve">
            Exportar lista
          </button>
          <button className="btn btn-primary" disabled title="Funcionalidade em breve">
            Gerar aprovados
          </button>
        </div>
      </div>

      <div className="view-section active" style={{ 
        margin: '0', 
        paddingTop: '1.5rem',
      }}>
        
        {/* Filtros na mesma linha com wrap e largura flexível */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            flexWrap: 'wrap',
            width: '100%'
          }}>

            {/* Filtro por categoria */}
            <h4 style={{ margin: 0, fontWeight: '300', whiteSpace: 'nowrap' }}>Filtrar:</h4>

            <button
              className="badge"
              onClick={() => setFiltroCategoria('todos')}
              style={{
                backgroundColor: filtroCategoria === 'todos' ? '#333' : '#DFDFDF',
                color: filtroCategoria === 'todos' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Todos
            </button>

            <button
              className="badge"
              onClick={() => setFiltroCategoria('alta_participacao')}
              style={{
                backgroundColor: filtroCategoria === 'alta_participacao' ? '#333' : '#DFDFDF',
                color: filtroCategoria === 'alta_participacao' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Alta participação
            </button>

            <button
              className="badge"
              onClick={() => setFiltroCategoria('maes_solo')}
              style={{
                backgroundColor: filtroCategoria === 'maes_solo' ? '#333' : '#DFDFDF',
                color: filtroCategoria === 'maes_solo' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Mães Solo
            </button>

            <button
              className="badge"
              onClick={() => setFiltroCategoria('mais_3_filhos')}
              style={{
                backgroundColor: filtroCategoria === 'mais_3_filhos' ? '#333' : '#DFDFDF',
                color: filtroCategoria === 'mais_3_filhos' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              +3 Filhos
            </button>

            <button
              className="badge"
              onClick={() => setFiltroCategoria('renda_baixa')}
              style={{
                backgroundColor: filtroCategoria === 'renda_baixa' ? '#333' : '#DFDFDF',
                color: filtroCategoria === 'renda_baixa' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Renda Baixa
            </button>

            {/* Haste vertical separadora */}
            <div style={{
              width: '1px',
              height: '30px',
              backgroundColor: '#ccc',
              margin: '0 4px'
            }}></div>

            {/* Filtro por presidente */}
            <h4 style={{ margin: 0, fontWeight: '300', whiteSpace: 'nowrap' }}>Presidente:</h4>

            <button
              className="badge"
              onClick={() => setFiltroPresidente('todos')}
              style={{
                backgroundColor: filtroPresidente === 'todos' ? '#333' : '#DFDFDF',
                color: filtroPresidente === 'todos' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Todos
            </button>

            <button
              className="badge"
              onClick={() => setFiltroPresidente('presidente_1')}
              style={{
                backgroundColor: filtroPresidente === 'presidente_1' ? '#333' : '#DFDFDF',
                color: filtroPresidente === 'presidente_1' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              João Silva
            </button>

            <button
              className="badge"
              onClick={() => setFiltroPresidente('presidente_2')}
              style={{
                backgroundColor: filtroPresidente === 'presidente_2' ? '#333' : '#DFDFDF',
                color: filtroPresidente === 'presidente_2' ? '#fff' : '#333',
                cursor: 'pointer',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '20px',
                flex: '1 0 auto',
                minWidth: '70px',
                maxWidth: '120px',
                whiteSpace: 'nowrap'
              }}
            >
              Maria Oliveira
            </button>

          </div>
        </div>

        <div className="grid-4" style={{ marginBottom: '1rem' }}>
          <div className="card">
            <h3 className="text-sm" style={{ color: '#A1A1A1', marginBottom: '0.5rem', fontSize: '1rem' }}>Total de Familias</h3>
            <h2>{familiasFiltradas().length}</h2>
          </div>
          <div className="card">
            <h3 className="text-sm" style={{ color: '#A1A1A1', marginBottom: '0.5rem', fontSize: '1rem' }}>Alta Participação</h3>
            <h2>{familiasFiltradas().filter(f => (f.eventos_participados || 0) >= 5).length}</h2>
          </div>
          <div className="card">
            <h3 className="text-sm" style={{ color: '#A1A1A1', marginBottom: '0.5rem', fontSize: '1rem' }}>Mães Solo</h3>
            <h2>{familiasFiltradas().filter(f => f.mae_solo === true || f.mae_solo === 'sim').length}</h2>
          </div>
          <div className="card">
            <h3 className="text-sm" style={{ color: '#A1A1A1', marginBottom: '0.5rem', fontSize: '1rem' }}>Sem Participação</h3>
            <h2>{familiasFiltradas().filter(f => (f.eventos_participados || 0) === 0).length}</h2>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
            <div className="title_rank" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h4>Ranking de Familias</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Ordenado por pontuação de engajamento</p>
            </div>
            <div className="flex gap-1">
              <select
                style={{
                  outline: 'none',
                  padding: '0.35rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  backgroundColor: '#fff',
                  color: '#696969',
                  fontSize: '0.9rem'
                }}
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Maior aprovação</option>
                <option value="pendente">Pendente</option>
                <option value="aprovada">Aprovada</option>
                <option value="lista_espera">Lista de espera</option>
              </select>
            </div>
          </div>
          {error && <div className="text-sm" style={{ color: '#b00020' }}>{error}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', backgroundColor: '#f9f9f9' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>RANK</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>FAMILIAS</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>PRESIDENTES RESP.</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>PERFIL</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>EVENTOS</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>PART.(%)</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>SCORE</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>PRÉ-SELEÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center' }}>Carregando familias...</td>
                </tr>
              ) : familiasFiltradas().length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center' }}>Nenhuma familia encontrada.</td>
                </tr>
              ) : (
                familiasFiltradas().map((familia, index) => (
                  <tr key={familia.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{index + 1}</td>
                    <td style={{ padding: '0.75rem' }}>{familia.nome_responsavel}</td>
                    <td style={{ padding: '0.75rem' }}>{familia.presidente_nome || 'Não atribuído'}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {familia.mae_solo ? 'Mãe Solo' : familia.numero_filhos >= 3 ? '+3 Filhos' : 'Padrão'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>{familia.eventos_participados || 0}</td>
                    <td style={{ padding: '0.75rem' }}>{((familia.eventos_participados || 0) / (familia.total_eventos || 1) * 100).toFixed(0)}%</td>
                    <td style={{ padding: '0.75rem' }}>{familia.score || 0}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => onSelectFamilia && onSelectFamilia(familia.id)}
                        style={{ padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Familias;