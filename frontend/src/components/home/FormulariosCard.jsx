import React from 'react';
import './FormulariosCard.css';

function FormulariosCard({ formularios = [], onVerMais }) {
  const dadosExemplo = [
    { id: 1, nome: 'Questionário (Ciclo 1)', status: 'ativo', prazo: '15/05' },
    { id: 2, nome: 'Questionário 2', status: 'rascunho', prazo: null },
    { id: 3, nome: 'Questionário 3', status: 'rascunho', prazo: null },
  ];

  const lista = formularios.length > 0 ? formularios : dadosExemplo;

  return (
    <div className="formularios-card">
      <div className="formularios-card__header">
        <span className="formularios-card__titulo">Formulários</span>
        <button className="formularios-card__ver-mais" onClick={onVerMais}>
          Ver mais
        </button>
      </div>
      <div className="formularios-card__lista">
        {lista.map((f) => (
          <div key={f.id} className="formularios-card__item">
            <span className="formularios-card__item-nome">{f.nome}</span>
            <span className={`formularios-card__item-status formularios-card__item-status--${f.status}`}>
              {f.status === 'ativo' ? `Ativo • Prazo: ${f.prazo}` : 'Rascunho'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FormulariosCard;