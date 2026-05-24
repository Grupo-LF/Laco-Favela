import React from 'react';
import '../../styles/pages/presidente/UltimasVisitas.css';

function UltimasVisitas({ visitas = [], onNavigate }) {
  const dadosExemplo = [
    { id: 1, familia: 'Família Souza', data: 'Hoje, 09:30', descricao: 'Formulário enviado', status: 'sincronizado' },
    { id: 2, familia: 'Família Oliveira', data: 'Ontem, 15:20', descricao: 'Salvo offline', status: 'offline' },
    { id: 3, familia: 'Família Lima', data: 'Ontem, 10:15', descricao: 'Formulário enviado', status: 'sincronizado' },
  ];

  const lista = visitas.length > 0 ? visitas : dadosExemplo;

  const statusLabel = {
    sincronizado: 'Sincronizado',
    offline: 'Offline',
    pendente: 'Pendente',
  };

  return (
    <div className="ultimas-visitas">
      <h2 className="ultimas-visitas__titulo">Últimas Visitas</h2>
      <div className="ultimas-visitas__lista">
        {lista.map((v) => (
          <div key={v.id} className="ultimas-visitas__item">
            <div className="ultimas-visitas__icone" />
            <div className="ultimas-visitas__info">
              <span className="ultimas-visitas__familia">{v.familia}</span>
              <span className="ultimas-visitas__detalhe">{v.data} • {v.descricao}</span>
            </div>
            <span className={`ultimas-visitas__status ultimas-visitas__status--${v.status}`}>
              {statusLabel[v.status] || v.status}
            </span>
          </div>
        ))}
      </div>
      <button className="ultimas-visitas__ver-todas" onClick={() => onNavigate && onNavigate('familias')}>
        Ver todas as visitas
      </button>
    </div>
  );
}

export default UltimasVisitas;