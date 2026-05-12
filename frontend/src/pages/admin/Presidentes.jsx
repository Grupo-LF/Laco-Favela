import React from 'react';

const Presidentes = () => {
  const presidentes = [
    { rank: 1, nome: 'João Silva', setor: 'Norte', visitas: 50, meta: 50, score: 98, status: 'Ativo' },
    { rank: 2, nome: 'Maria Santos', setor: 'Sul', visitas: 45, meta: 50, score: 90, status: 'Ativo' },
    { rank: 3, nome: 'Pedro Costa', setor: 'Leste', visitas: 31, meta: 50, score: 61, status: 'Alerta' }
  ];

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Presidentes</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline">Exportar lista</button>
          <button className="btn btn-primary">Novo presidente</button>
        </div>
      </div>

      <div className="card">
        <div className="filter-group">
          <span className="text-sm" style={{ lineHeight: '2' }}>Ordenar:</span>
          <span className="filter-chip active">Ranking Geral</span>
          <span className="filter-chip">Visitas</span>
          <span className="filter-chip">Cotas</span>
        </div>
        <table>
          <thead>
            <tr><th>Rank</th><th>Presidente</th><th>Setor</th><th>Cota</th><th>Score</th><th>Status</th><th>Ação</th></tr>
          </thead>
          <tbody>
            {presidentes.map(p => (
              <tr key={p.rank}>
                <td>{p.rank}</td>
                <td><strong>{p.nome}</strong></td>
                <td>{p.setor}</td>
                <td>
                  {p.visitas}/{p.meta}
                  <div className="progress-container"><div className="progress-bar" style={{ width: `${(p.visitas/p.meta)*100}%` }}></div></div>
                </td>
                <td>{p.score}</td>
                <td><span className="badge" style={p.status === 'Alerta' ? { background: '#ffcc80' } : {}}>{p.status}</span></td>
                <td><button className="btn btn-outline">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="card" style={{ background: '#e9e9e9' }}>
        <h4>Editar Cota do Presidente</h4>
        <p className="text-sm mb-2">Defina a meta de famílias para cada presidente</p>
        <div className="grid-3" style={{ marginTop: '1rem' }}>
          <select style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option>João Silva</option>
            <option>Maria Santos</option>
            <option>Pedro Costa</option>
          </select>
          <input type="number" value="50" style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          <button className="btn btn-primary">Salvar cota</button>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;