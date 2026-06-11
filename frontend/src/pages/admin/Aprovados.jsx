import React, { useEffect, useState } from 'react';
import { listarFamilias } from '../../services/familias';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';
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
    // Busca apenas os aprovados (sem search)
    const data = await listarFamilias({
      aprovada: 'true',  // ou 'true' dependendo do backend
    });
    console.log(data);
    const familiasData = Array.isArray(data) ? data : [];
    setFamilias(familiasData);
    setAprovados(familiasData);
  } catch (err) {
    setError('Nao foi possivel carregar as familias aprovadas.');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  carregarAprovados();
}, []); // ⚠️ Removeu o search da dependência


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
    console.log(filtrados)
    return filtrados;
  };

  const familiasFiltradas = filtrarFamilias();

  return (
    <div className="apro">
     
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                 <h2 style={{ margin: 0 ,color:'var(--color-primary)'}}>Aprovados</h2>
                 <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista <ExportIcon></ExportIcon></button>
                   <button className="btn btn-primary"  style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                     Gerar Aprovados
                   </button>
                 </div>
               </div>
      

      <div className="view-section active">
        <div className="card flex justify-between items-center" >
          <div>
            <h3 style={{color:'var(--color-primary)'}}><strong>Seleção do Ciclo Finalizada </strong></h3>
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
                backgroundColor: filtroCategoria === 'todos' ? 'var(--color-primary)' : '#DFDFDF',
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
                backgroundColor: filtroCategoria === 'maes_solo' ? 'var(--color-primary)' : '#DFDFDF',
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
                backgroundColor: filtroCategoria === 'mais_3_filhos' ? 'var(--color-primary)' : '#DFDFDF',
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
                backgroundColor: filtroCategoria === 'renda_baixa' ? 'var(--color-primary)' : '#DFDFDF',
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
                backgroundColor: filtroCategoria === 'alta_participacao' ? 'var(--color-primary)' : '#DFDFDF',
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
                <th>Status</th>
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
                    <td>{familia.presidente_nome || '—'}</td>
                    <td>{familia.score || '—'}</td>
                    <td><span className="badge" style={{ backgroundColor: '#D9D9D9', color: '#333' }}>
                       {familia.perfil_display || '—'}
                       </span></td>
                    <td>
                      <span className="badge" style={{ backgroundColor: familia.publicado ? 'var(--color-primary)' : 'var(--color-accent)', color: familia.publicado ? '#fff' : '#333' }}>
                        {familia.publicado ? 'Publicado' : 'Pendente'}
                      </span>
                    </td>
                    <td style={{display:'flex', justifyContent:'center'}}>
                      <button className="btn btn-outline" style={{ backgroundColor: familia.publicado ? '#D9D9D9' : 'var(--color-primary)', color: familia.publicado ? '#333' : '#fff',padding:'6px 12px' }}>
                        {familia.publicado ? 'Detalhes' : 'Publicar'}

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