import React from 'react';

const Familias = () => {
  const familias = [
    { rank: 1, nome: 'Família Santos', responsavel: 'Maria Costa', perfil: 'Mãe solo', participacao: 100, score: 97 },
    { rank: 2, nome: 'Família Oliveira', responsavel: 'Ana Lima', perfil: '+3 filhos', participacao: 89, score: 93 },
    { rank: 3, nome: 'Família Souza', responsavel: 'Carlos Souza', perfil: 'Baixa renda', participacao: 75, score: 82 }
  ];

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Famílias</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline">Exportar lista</button>
          <button className="btn btn-primary">Gerar aprovados</button>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '1rem' }}>
        <div className="card"><p className="text-sm">Total de Famílias</p><h2>487</h2></div>
        <div className="card"><p className="text-sm">Alta participação</p><h2>142</h2></div>
        <div className="card"><p className="text-sm">Mães solo</p><h2>89</h2></div>
        <div className="card"><p className="text-sm">Sem participação</p><h2>31</h2></div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center">
          <h4>Ranking de Famílias</h4>
          <button className="btn btn-outline">Maior aprovação</button>
        </div>
        <table>
          <thead>
            <tr><th>Rank</th><th>Família</th><th>Perfil</th><th>Part. (%)</th><th>Score</th><th>Pré-Seleção</th></tr>
          </thead>
          <tbody>
            {familias.map(f => (
              <tr key={f.rank}>
                <td>{f.rank}</td>
                <td>{f.nome}<br /><span className="text-sm">{f.responsavel}</span></td>
                <td><span className="badge">{f.perfil}</span></td>
                <td>
                  {f.participacao}%
                  <div className="progress-container"><div className="progress-bar" style={{ width: `${f.participacao}%` }}></div></div>
                </td>
                <td>{f.score}</td>
                <td><input type="checkbox" defaultChecked={f.rank < 3} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Familias;