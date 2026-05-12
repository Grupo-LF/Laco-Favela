import React from 'react';

const Aprovados = () => {
  const aprovados = [
    { id: '001', familia: 'Família Santos', pontuacao: 97, criterio: 'Mãe solo', publicado: true },
    { id: '002', familia: 'Família Oliveira', pontuacao: 93, criterio: '+3 filhos', publicado: true },
    { id: '003', familia: 'Família Rodrigues', pontuacao: 88, criterio: 'Renda baixa', publicado: false }
  ];

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Aprovados</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline">Exportar lista</button>
          <button className="btn btn-primary">Publicar aprovados</button>
        </div>
      </div>

      <div className="card flex justify-between items-center" style={{ background: '#e9e9e9' }}>
        <div>
          <h4>Seleção do Ciclo 3 finalizada</h4>
          <p className="text-sm">Revisão completa</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center"><h2>38</h2><span className="text-sm">Aprovadas</span></div>
          <div className="text-center"><h2>487</h2><span className="text-sm">Avaliadas</span></div>
          <div className="text-center"><h2>7,8%</h2><span className="text-sm">Taxa</span></div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between mb-2">
          <h4>Famílias Aprovadas - Ciclo 3</h4>
          <input type="text" placeholder="Buscar família..." style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }} />
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Família</th><th>Pontuação</th><th>Critério Principal</th><th>Publicado</th><th>Ação</th></tr>
          </thead>
          <tbody>
            {aprovados.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.familia}</td>
                <td>{a.pontuacao}</td>
                <td><span className="badge">{a.criterio}</span></td>
                <td><span className="badge" style={!a.publicado ? { background: '#ffd54f' } : {}}>{a.publicado ? 'Publicado' : 'Pendente'}</span></td>
                <td><button className={a.publicado ? 'btn btn-outline' : 'btn btn-primary'}>{a.publicado ? 'Detalhes' : 'Publicar'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Aprovados;