import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/pages/formularios.css';

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

/* Ícone "+" circular — abre formulário novo */
const IconAddCircle = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask-add" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="30">
      <rect width="30" height="30" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask-add)">
      <path d="M13.7505 21.25H16.2505V16.25H21.2505V13.75H16.2505V8.75H13.7505V13.75H8.75049V16.25H13.7505V21.25ZM15.0005 27.5C13.2713 27.5 11.6463 27.1719 10.1255 26.5156C8.60466 25.8594 7.28174 24.9688 6.15674 23.8438C5.03174 22.7188 4.14111 21.3958 3.48486 19.875C2.82861 18.3542 2.50049 16.7292 2.50049 15C2.50049 13.2708 2.82861 11.6458 3.48486 10.125C4.14111 8.60417 5.03174 7.28125 6.15674 6.15625C7.28174 5.03125 8.60466 4.14063 10.1255 3.48438C11.6463 2.82813 13.2713 2.5 15.0005 2.5C16.7297 2.5 18.3547 2.82813 19.8755 3.48438C21.3963 4.14063 22.7192 5.03125 23.8442 6.15625C24.9692 7.28125 25.8599 8.60417 26.5161 10.125C27.1724 11.6458 27.5005 13.2708 27.5005 15C27.5005 16.7292 27.1724 18.3542 26.5161 19.875C25.8599 21.3958 24.9692 22.7188 23.8442 23.8438C22.7192 24.9688 21.3963 25.8594 19.8755 26.5156C18.3547 27.1719 16.7297 27.5 15.0005 27.5ZM15.0005 25C17.7922 25 20.1567 24.0313 22.0942 22.0938C24.0317 20.1563 25.0005 17.7917 25.0005 15C25.0005 12.2083 24.0317 9.84375 22.0942 7.90625C20.1567 5.96875 17.7922 5 15.0005 5C12.2088 5 9.84424 5.96875 7.90674 7.90625C5.96924 9.84375 5.00049 12.2083 5.00049 15C5.00049 17.7917 5.96924 20.1563 7.90674 22.0938C9.84424 24.0313 12.2088 25 15.0005 25Z" fill="white"/>
    </g>
  </svg>
);

/* Ícone de nuvem/cloud — aparece no subitem para navegar ao formulário */
const IconCloud = () => (
  <svg width="26" height="19" viewBox="0 0 26 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.9083 15.1667L17.5 8.575L15.8083 6.88333L10.8792 11.8125L8.42917 9.3625L6.76667 11.025L10.9083 15.1667ZM6.41667 18.6667C4.64722 18.6667 3.13542 18.0542 1.88125 16.8292C0.627083 15.6042 0 14.1069 0 12.3375C0 10.8208 0.456944 9.46944 1.37083 8.28333C2.28472 7.09722 3.48056 6.33889 4.95833 6.00833C5.44444 4.21944 6.41667 2.77083 7.875 1.6625C9.33333 0.554167 10.9861 0 12.8333 0C15.1083 0 17.0382 0.792361 18.6229 2.37708C20.2076 3.96181 21 5.89167 21 8.16667C22.3417 8.32222 23.4549 8.90069 24.3396 9.90208C25.2243 10.9035 25.6667 12.075 25.6667 13.4167C25.6667 14.875 25.1562 16.1146 24.1354 17.1354C23.1146 18.1562 21.875 18.6667 20.4167 18.6667H6.41667ZM6.41667 16.3333H20.4167C21.2333 16.3333 21.9236 16.0514 22.4875 15.4875C23.0514 14.9236 23.3333 14.2333 23.3333 13.4167C23.3333 12.6 23.0514 11.9097 22.4875 11.3458C21.9236 10.7819 21.2333 10.5 20.4167 10.5H18.6667V8.16667C18.6667 6.55278 18.0979 5.17708 16.9604 4.03958C15.8229 2.90208 14.4472 2.33333 12.8333 2.33333C11.2194 2.33333 9.84375 2.90208 8.70625 4.03958C7.56875 5.17708 7 6.55278 7 8.16667H6.41667C5.28889 8.16667 4.32639 8.56528 3.52917 9.3625C2.73194 10.1597 2.33333 11.1222 2.33333 12.25C2.33333 13.3778 2.73194 14.3403 3.52917 15.1375C4.32639 15.9347 5.28889 16.3333 6.41667 16.3333Z" fill="#035A8F"/>
  </svg>
);

const cycles = [
  {
    id: 1,
    name: 'Questionário (Ciclo 1)',
    familias: [
      { id: 101, nome: 'Questionário (Ciclo 1) - Família Souza' },
      { id: 102, nome: 'Questionário (Ciclo 1) - Família Lima' },
      { id: 103, nome: 'Questionário (Ciclo 1) - Família Rocha' },
      { id: 104, nome: 'Questionário (Ciclo 1) - Família Gomes' },
    ],
  },
  { id: 2, name: 'Questionário 2', familias: [] },
  { id: 3, name: 'Questionário 3', familias: [] },
  { id: 4, name: 'Questionário 4', familias: [] },
];

const FormularioPage = () => {
  const [openId, setOpenId] = useState(1);
  const navigate = useNavigate();

  const toggle = (id) => setOpenId(prev => (prev === id ? null : id));

  const handleNovoFormulario = (e, cycleId) => {
    e.stopPropagation();
    navigate(`/formularios/${cycleId}/novo`);
  };

  const handleAbrirFormulario = (familiaId) => {
    navigate(`/formularios/responder/${familiaId}`);
  };

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
                  <span className="formulario-page__icon-form">
                    <IconFormulario />
                  </span>
                  <span className="formulario-page__accordion-name">{cycle.name}</span>
                </div>

                <div className="formulario-page__accordion-actions">
                  <span className={`formulario-page__chevron${openId === cycle.id ? ' formulario-page__chevron--open' : ''}`}>
                    <IconChevronDown />
                  </span>
                  <button
                    className="formulario-page__btn-add"
                    aria-label="Novo formulário"
                    onClick={(e) => handleNovoFormulario(e, cycle.id)}
                  >
                    <IconAddCircle />
                  </button>
                </div>
              </div>

              {openId === cycle.id && cycle.familias.length > 0 && (
                <ul className="formulario-page__subitems">
                  {cycle.familias.map((familia) => (
                    <li
                      key={familia.id}
                      className="formulario-page__subitem"
                      onClick={() => handleAbrirFormulario(familia.id)}
                    >
                      <span className="formulario-page__subitem-nome">{familia.nome}</span>
                      <span className="formulario-page__subitem-icon">
                        <IconCloud />
                      </span>
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