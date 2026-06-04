import '../../styles/pages/formularios.css';
const cycles = [
  { id: 1, name: 'Ciclo 1' },
  { id: 2, name: 'Ciclo 2' },
  { id: 3, name: 'Ciclo 3' }
];
const FormularioPage = () => {
  return (
    <div className="formulario-page">
      <h1 className="formulario-page__title">Formulários</h1>
      <ul className="formulario-page__list">
        {cycles.map(cycle => (
          <li key={cycle.id} className="formulario-page__item">
            {cycle.name}
            <div style={{display:'flex',gap:'8px'}}><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect y="0.444336" width="32" height="32" fill="black"/>
                   <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" stroke-width="2"/>
                   </svg>  
                   <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <rect y="0.444336" width="32" height="32" fill="black"/>
                   <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" stroke-width="2"/>
                   </svg>     
            </div>
                           
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FormularioPage;
<div data-svg-wrapper data-layer="Group 1077" className="Group1077" style={{position: 'relative'}}>
  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect y="0.444336" width="32" height="32" fill="black"/>
  <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" stroke-width="2"/>
  </svg>
</div>