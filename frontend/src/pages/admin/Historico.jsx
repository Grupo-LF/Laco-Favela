import React from 'react';

const Historico = () => {
  const timeline = [
    { data: '20 Abr • 14:35', titulo: 'Ciclo 3 - 38 famílias aprovadas publicadas', descricao: 'Taxa de aprovação: 7,8%. Principais critérios: engajamento e vulnerabilidade.' },
    { data: '15 Abr 2025 • 10:00', titulo: 'Ciclo 3 iniciado - Formulários enviados', descricao: '12 presidentes notificados para preenchimento. Prazo: 30/04/2025.' },
    { data: '05 Mar 2025 • 09:00', titulo: 'Evento comunitário - Praça Central', descricao: '234 famílias participantes. Todos os presidentes presentes.' },
    { data: '10 Fev 2025 • 14:00', titulo: 'Ciclo 2 finalizado', descricao: '42 famílias aprovadas. Distribuição de cestas básicas realizada.' }
  ];

  return (
    <div className="hist">

        <div className="header">
          <h2>Histórico Completo</h2>
          <div className="flex gap-1">
            <button className="btn btn-outline">Todos os ciclos</button>
            <button className="btn btn-primary">Exportar Histórico</button>
          </div>
        </div>

      <div className="view-section active">

        <div className="grid-3">
          <div className="card"><p className="text-sm">Total de Ciclos</p><h2>3</h2></div>
          <div className="card"><p className="text-sm">Famílias Beneficiadas</p><h2>104</h2></div>
          <div className="card"><p className="text-sm">Eventos Realizados</p><h2>67</h2></div>
        </div>

        <div className="card">
          <h4>Linha do Tempo</h4>
          <div className="timeline" style={{ marginTop: '1.5rem' }}>
            {timeline.map((item, index) => (
              <div key={index} className="timeline-item">
                <p className="text-sm">{item.data}</p>
                <h4>{item.titulo}</h4>
                <p className="text-sm">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Historico;