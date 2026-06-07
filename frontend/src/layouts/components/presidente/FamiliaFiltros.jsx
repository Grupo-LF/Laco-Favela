import React from 'react';
import '../../styles/pages/presidente/FamiliaFiltros.css';

function FamiliaFiltros({ busca, onBusca, status, onStatus }) {
  return (
    <div className="familia-filtros">
      <div className="familia-filtros__busca">
        <div className="familia-filtros__icone" />
        <input
          type="text"
          placeholder="Buscar família..."
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          className="familia-filtros__input"
        />
      </div>
      <select
        className="familia-filtros__select"
        value={status}
        onChange={(e) => onStatus(e.target.value)}
      >
        <option value="">Todos os status</option>
        <option value="Visitada">Visitada</option>
        <option value="Pendente">Pendente</option>
      </select>
    </div>
  );
}

export default FamiliaFiltros;