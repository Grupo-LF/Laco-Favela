import React, { useState } from 'react';

const Feedbacks = () => {
  const [filter, setFilter] = useState('todos');
  
  const feedbacks = [
    { id: 1, tipo: 'Denúncia', mensagem: 'O presidente do meu setor está priorizando famílias sem seguir os critérios corretos. Algumas famílias com alta participação não estão sendo consideradas.', data: '20/04/2025 • 14:32', lido: false },
    { id: 2, tipo: 'Sugestão', mensagem: 'Seria muito útil se o formulário de cadastro de família tivesse um campo para registrar necessidade especial de saúde.', data: '18/04/2025 • 21:03', lido: false },
    { id: 3, tipo: 'Elogio', mensagem: 'O presidente João Silva tem sido muito atencioso com as famílias do setor Norte. Parabéns pelo trabalho!', data: '15/04/2025 • 10:15', lido: true }
  ];

  const getFilteredFeedbacks = () => {
    if (filter === 'todos') return feedbacks;
    if (filter === 'nao-lidos') return feedbacks.filter(f => !f.lido);
    if (filter === 'denuncias') return feedbacks.filter(f => f.tipo === 'Denúncia');
    if (filter === 'elogios') return feedbacks.filter(f => f.tipo === 'Elogio');
    return feedbacks;
  };

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Feedbacks anônimos</h2>
        <button className="btn btn-outline">Marcar todos como lidos</button>
      </div>

      <div className="filter-group">
        <span className={`filter-chip ${filter === 'todos' ? 'active' : ''}`} onClick={() => setFilter('todos')}>Todos ({feedbacks.length})</span>
        <span className={`filter-chip ${filter === 'nao-lidos' ? 'active' : ''}`} onClick={() => setFilter('nao-lidos')}>Não lidos ({feedbacks.filter(f => !f.lido).length})</span>
        <span className={`filter-chip ${filter === 'denuncias' ? 'active' : ''}`} onClick={() => setFilter('denuncias')}>Denúncias</span>
        <span className={`filter-chip ${filter === 'elogios' ? 'active' : ''}`} onClick={() => setFilter('elogios')}>Elogios</span>
      </div>

      <div className="flex-col gap-1">
        {getFilteredFeedbacks().map(feedback => (
          <div key={feedback.id} className="card">
            <div className="flex justify-between">
              <span className="badge" style={feedback.tipo === 'Denúncia' ? { background: '#ffcdd2', color: '#c62828' } : feedback.tipo === 'Elogio' ? { background: '#c8e6c9', color: '#2e7d32' } : { background: '#e1bee7', color: '#6a1b9a' }}>
                {feedback.tipo}
              </span>
              {!feedback.lido && <button className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>Marcar como lido</button>}
            </div>
            <p style={{ marginTop: '1rem' }}>{feedback.mensagem}</p>
            <p className="text-sm" style={{ marginTop: '0.5rem' }}>Recebido: {feedback.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;