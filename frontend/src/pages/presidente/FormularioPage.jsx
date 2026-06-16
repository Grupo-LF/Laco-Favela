import { useState } from 'react';
import '../../styles/pages/formularios.css';

// SVGs do Figma — fill="currentColor" para o CSS controlar a cor
const IconFormulario = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask-form" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="28">
      <rect width="28" height="28" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask-form)">
      <path d="M5.83333 24.5003C5.19167 24.5003 4.64236 24.2719 4.18542 23.8149C3.72847 23.358 3.5 22.8087 3.5 22.167V5.83366C3.5 5.19199 3.72847 4.64269 4.18542 4.18574C4.64236 3.7288 5.19167 3.50033 5.83333 3.50033H10.7333C10.9861 2.80033 11.409 2.23644 12.0021 1.80866C12.5951 1.38088 13.2611 1.16699 14 1.16699C14.7389 1.16699 15.4049 1.38088 15.9979 1.80866C16.591 2.23644 17.0139 2.80033 17.2667 3.50033H22.1667C22.8083 3.50033 23.3576 3.7288 23.8146 4.18574C24.2715 4.64269 24.5 5.19199 24.5 5.83366V22.167C24.5 22.8087 24.2715 23.358 23.8146 23.8149C23.3576 24.2719 22.8083 24.5003 22.1667 24.5003H5.83333ZM5.83333 22.167H22.1667V5.83366H5.83333V22.167ZM8.16667 19.8337H16.3333V17.5003H8.16667V19.8337ZM8.16667 15.167H19.8333V12.8337H8.16667V15.167ZM8.16667 10.5003H19.8333V8.16699H8.16667V10.5003ZM14.6271 4.71074C14.7924 4.54546 14.875 4.33644 14.875 4.08366C14.875 3.83088 14.7924 3.62185 14.6271 3.45658C14.4618 3.2913 14.2528 3.20866 14 3.20866C13.7472 3.20866 13.5382 3.2913 13.3729 3.45658C13.2076 3.62185 13.125 3.83088 13.125 4.08366C13.125 4.33644 13.2076 4.54546 13.3729 4.71074C13.5382 4.87602 13.7472 4.95866 14 4.95866C14.2528 4.95866 14.4618 4.87602 14.6271 4.71074Z" fill="currentColor"/>
    </g>
  </svg>
);

const IconChevronDown = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask-chev" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="50" height="50">
      <rect width="50" height="50" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask-chev)">
      <path d="M25 32.0827L12.5 19.5827L15.4167 16.666L25 26.2493L34.5833 16.666L37.5 19.5827L25 32.0827Z" fill="white"/>
    </g>
  </svg>
);

const IconAdd = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2"/>
    <path d="M13 8H15V13H20V15H15V20H13V15H8V13H13V8Z" fill="white"/>
  </svg>
);

const cycles = [
  {
    id: 1,
    name: 'Questionário (Ciclo 1)',
    familias: [
      'Questionário (Ciclo 1) - Família Souza',
      'Questionário (Ciclo 1) - Família Lima',
      'Questionário (Ciclo 1) - Família Rocha',
      'Questionário (Ciclo 1) - Família Gomes',
    ],
  },
  { id: 2, name: 'Questionário 2', familias: [] },
  { id: 3, name: 'Questionário 3', familias: [] },
  { id: 4, name: 'Questionário 4', familias: [] },
];

const FormularioPage = () => {
  const [openId, setOpenId] = useState(1);

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  return (
    <div className="formulario-page">
      <h1 className="formulario-page__title">Formulários</h1>

      <div className="formulario-page__card">
        <h2 className="formulario-page__section-title">Formulários Recebidos</h2>

        <ul className="formulario-page__list">
          {cycles.map(cycle => (
            <li key={cycle.id} className="formulario-page__item">

              <div
                className={`formulario-page__accordion-header${openId === cycle.id ? ' formulario-page__accordion-header--open' : ''}`}
                onClick={() => toggle(cycle.id)}
                role="button"
                aria-expanded={openId === cycle.id}
              >
                <div className="formulario-page__accordion-left">
                  {/* <span className="formulario-page__icon-form">
                    <IconFormulario />
                  </span> */}
                  <span className="formulario-page__accordion-name">{cycle.name}</span>
                </div>

                <div className="formulario-page__accordion-actions">
                  <span className={`formulario-page__chevron${openId === cycle.id ? ' formulario-page__chevron--open' : ''}`}>
                    <IconChevronDown />
                  </span>
                  <button
                    className="formulario-page__btn-add"
                    aria-label="Adicionar formulário"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconAdd />
                  </button>
                </div>
              </div>

              {openId === cycle.id && cycle.familias.length > 0 && (
                <ul className="formulario-page__subitems">
                  {cycle.familias.map((familia, idx) => (
                    <li key={idx} className="formulario-page__subitem">
                      {familia}
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FormularioPage;