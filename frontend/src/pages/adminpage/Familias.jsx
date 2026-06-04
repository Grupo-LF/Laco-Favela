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

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Famílias</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline" disabled title="Funcionalidade em breve">
            Exportar lista
          </button>
          <button className="btn btn-primary" disabled title="Funcionalidade em breve">
            Gerar aprovados
          </button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '1rem' }}>
        <div className="card"><p className="text-sm">Total de Familias</p><h2>{totals.total}</h2></div>
        <div className="card"><p className="text-sm">Aprovadas</p><h2>{totals.aprovadas}</h2></div>
        <div className="card"><p className="text-sm">Pendentes</p><h2>{totals.pendentes}</h2></div>
        <div className="card"><p className="text-sm">Lista de espera</p><h2>{totals.listaEspera}</h2></div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center" style={{ marginBottom: '0.75rem' }}>
          <h4>Lista de Familias</h4>
          <div className="flex gap-1">
            <input
              type="text"
              placeholder="Buscar por responsavel, comunidade ou municipio"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovada">Aprovada</option>
              <option value="lista_espera">Lista de espera</option>
            </select>
          </div>
        </div>
        {error && <div className="text-sm" style={{ color: '#b00020' }}>{error}</div>}
        <table>
          <thead>
            <tr><th>ID</th><th>Responsavel</th><th>Comunidade</th><th>Municipio</th><th>Status</th><th>Acoes</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6">Carregando familias...</td></tr>
            ) : familias.length === 0 ? (
              <tr><td colSpan="6">Nenhuma familia encontrada.</td></tr>
            ) : (
              familias.map((familia) => (
                <tr key={familia.id}>
                  <td>{familia.id}</td>
                  <td>{familia.nome_responsavel}</td>
                  <td>{familia.comunidade}</td>
                  <td>{familia.municipio}</td>
                  <td><span className="badge">{STATUS_LABELS[familia.status] || familia.status}</span></td>
                  <td>
                    <button
                      className="btn btn-outline"
                      onClick={() => onSelectFamilia && onSelectFamilia(familia.id)}
                    >
                      Ver formulario
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Familias;