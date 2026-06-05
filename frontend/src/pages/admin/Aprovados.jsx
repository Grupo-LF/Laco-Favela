import React, { useEffect, useState } from 'react';
import { listarFamilias } from '../../services/familias';

const Aprovados = () => {
  const [aprovados, setAprovados] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const carregarAprovados = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarFamilias({
        status: 'aprovada',
        search: search.trim() || undefined,
      });
      setFamilias(Array.isArray(data) ? data : []);
      setAprovados(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Nao foi possivel carregar as familias aprovadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAprovados();
  }, [search]);

  // Função para contar famílias por categoria
  const contarPorCategoria = (categoria) => {
    switch (categoria) {
      case 'maes_solo':
        return aprovados.filter(familia => familia.mae_solo === true).length;
      case 'mais_3_filhos':
        return aprovados.filter(familia => (familia.numero_filhos || 0) > 3).length;
      case 'renda_baixa':
        return aprovados.filter(familia => familia.renda === 'baixa').length;
      case 'alta_participacao':
        return aprovados.filter(familia => familia.participacao === 'alta').length;
      default:
        return aprovados.length;
    }
  };

  // Função para filtrar as famílias com base no filtro selecionado
  const filtrarFamilias = () => {
    let filtrados = [...aprovados];

    if (filtroCategoria !== 'todos') {
      filtrados = filtrados.filter(familia => {
        switch (filtroCategoria) {
          case 'alta_participacao':
            return familia.participacao === 'alta';
          case 'maes_solo':
            return familia.mae_solo === true;
          case 'mais_3_filhos':
            return (familia.numero_filhos || 0) > 3;
          case 'renda_baixa':
            return familia.renda === 'baixa';
          default:
            return true;
        }
      });
    }

    return filtrados;
  };

  const familiasFiltradas = filtrarFamilias();

  return (
    <div className="apro">
      <div className="header">
        <h2>Aprovados</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline" disabled title="Funcionalidade em breve">
            Exportar lista
          </button>
          <button className="btn btn-primary" disabled title="Funcionalidade em breve">
            Publicar aprovados
          </button>
        </div>
      </div>

      <div className="view-section active">
        <div className="card flex justify-between items-center">
          <div>
            <h3>Seleção do Ciclo Finalizada</h3>
            <p className="text-sm mt-1">sub texto</p>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <h1>{familiasFiltradas.length}</h1>
              <span className="text-sm">Aprovadas</span>
            </div>
            <div className="text-center">
              <h1>{familias.length}</h1>
              <span className="text-sm">Avaliadas</span>
            </div>
            <div className="text-center">
              <h1>{familias.length > 0 ? Math.round((familiasFiltradas.length / familias.length) * 100) : 0}%</h1>
              <span className="text-sm" style={{ marginRight: '10px' }}>taxa</span>
            </div>
          </div>
        </div>

        {/* Filtro único com quantidades */}
        <div className="card" style={{ padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <h4 style={{ margin: 0, fontWeight: '300', whiteSpace: 'nowrap' }}>Filtrar por:</h4>

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
                whiteSpace: 'nowrap'
              }}
            >
              Todas ({contarPorCategoria('todos')})
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
                whiteSpace: 'nowrap'
              }}
            >
              Mães Solo ({contarPorCategoria('maes_solo')})
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
                whiteSpace: 'nowrap'
              }}
            >
              +3 Filhos ({contarPorCategoria('mais_3_filhos')})
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
                whiteSpace: 'nowrap'
              }}
            >
              Baixa Renda ({contarPorCategoria('renda_baixa')})
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
                whiteSpace: 'nowrap'
              }}
            >
              Alta Participação ({contarPorCategoria('alta_participacao')})
            </button>
          </div>
        </div>

        {/* Tabela de famílias */}
        <div className="card">
          <div className="flex justify-between mb-2">
            <h4>Familias Aprovadas</h4>
            <input
              type="text"
              placeholder="Buscar familia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          {error && <div className="text-sm" style={{ color: '#b00020' }}>{error}</div>}
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Família</th>
                <th>Presidente</th>
                <th>Pontuação</th>
                <th>Critério Principal</th>
                <th>Publicado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Carregando familias...</td>
                </tr>
              ) : familiasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7">Nenhuma familia aprovada encontrada.</td>
                </tr>
              ) : (
                familiasFiltradas.map((familia, index) => (
                  <tr key={familia.id}>
                    <td>{index + 1}</td>
                    <td>{familia.nome_responsavel}</td>
                    <td>{familia.presidente || '—'}</td>
                    <td>{familia.pontuacao || '—'}</td>
                    <td>{familia.criterio_principal || '—'}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: familia.publicado ? '#4CAF50' : '#DFDFDF', color: familia.publicado ? '#fff' : '#333' }}>
                        {familia.publicado ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }}>
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

export default Aprovados;