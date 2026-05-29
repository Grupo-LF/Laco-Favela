import '../../styles/pages/formularios.css';
const cycles = [
  { id: 1, name: 'Ciclo 1' },
  { id: 2, name: 'Ciclo 2' },
  { id: 3, name: 'Ciclo 3' }
];
const FormularioPage = () => {
  return (
    <div className="formulario-page">
      <h1 className="formulario-page__title">Formulário de Presidente</h1>
      <ul className="formulario-page__list">
        {cycles.map(cycle => (
          <li key={cycle.id} className="formulario-page__item">
            {cycle.name}
            <button className="formulario-page__button">Selecionar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default FormularioPage;