import React, { useEffect, useState } from 'react';
import { listarFamilias } from '../../services/api';

const Aprovados = () => {
  const [aprovados, setAprovados] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarAprovados = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarFamilias({
        status: 'aprovada',
        search: search.trim() || undefined,
      });
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

  return (
    <div className="view-section active">
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

      <div className="card flex justify-between items-center" style={{ background: '#e9e9e9' }}>
        <div>
          <h4>Familias aprovadas</h4>
          <p className="text-sm">Lista atual de aprovados</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center"><h2>{aprovados.length}</h2><span className="text-sm">Aprovadas</span></div>
        </div>
      </div>

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
        <table>
          <thead>
            <tr><th>ID</th><th>Responsavel</th><th>Comunidade</th><th>Municipio</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">Carregando familias...</td></tr>
            ) : aprovados.length === 0 ? (
              <tr><td colSpan="5">Nenhuma familia aprovada encontrada.</td></tr>
            ) : (
              aprovados.map((familia) => (
                <tr key={familia.id}>
                  <td>{familia.id}</td>
                  <td>{familia.nome_responsavel}</td>
                  <td>{familia.comunidade}</td>
                  <td>{familia.municipio}</td>
                  <td><span className="badge">Aprovada</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Aprovados;