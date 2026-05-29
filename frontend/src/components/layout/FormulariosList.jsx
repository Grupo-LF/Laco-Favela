import React, { useState, useEffect } from 'react';
import { getCiclos, getFormulariosDoCiclo, getFormulario } from '../../services/api';
import FormularioPreenchimento from './FormularioPreenchimento';

// >>> INÍCIO DO CÓDIGO NOVO (substitui o arquivo inteiro) <<<

const FormulariosList = () => {
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cicloSelecionado, setCicloSelecionado] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [formularioAtivo, setFormularioAtivo] = useState(null);

  useEffect(() => {
    loadCiclos();
  }, []);

  const loadCiclos = async () => {
    try {
      setLoading(true);
      const data = await getCiclos();
      setCiclos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selecionarCiclo = async (cicloId) => {
    try {
      setLoading(true);
      setCicloSelecionado(cicloId);
      const data = await getFormulariosDoCiclo(cicloId);
      setFormularios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const voltarParaCiclos = () => {
    setCicloSelecionado(null);
    setFormularios([]);
    setFormularioAtivo(null);
  };

  const abrirFormulario = async (formularioId) => {
    try {
      const data = await getFormulario(formularioId);
      setFormularioAtivo(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (formularioAtivo) {
    return (
      <FormularioPreenchimento
        formulario={formularioAtivo}
        onVoltar={() => setFormularioAtivo(null)}
      />
    );
  }

  if (loading) return <div className="formularios-list__loading">Carregando...</div>;
  if (error) return <div className="formularios-list__error">Erro: {error}</div>;

  return (
    <div className="formularios-list">
      <div className="formularios-list__header">
        <h2 className="formularios-list__title">
          {cicloSelecionado ? 'Formulários do Ciclo' : 'Ciclos de Formulários'}
        </h2>
        {cicloSelecionado && (
          <button className="formularios-list__back" onClick={voltarParaCiclos}>
            ← Voltar para ciclos
          </button>
        )}
      </div>

      {!cicloSelecionado ? (
        <div className="formularios-list__grid">
          {ciclos.map((ciclo) => (
            <div
              key={ciclo.id}
              className="formularios-list__card"
              onClick={() => selecionarCiclo(ciclo.id)}
            >
              <div className="formularios-list__card-icon">
                <img src="/assets/ Square_black.svg" alt="Ícone" />
              </div>
              <div className="formularios-list__card-info">
                <h3 className="formularios-list__card-title">{ciclo.titulo}</h3>
                <p className="formularios-list__card-desc">{ciclo.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="formularios-list__grid">
          {formularios.map((form) => (
            <div
              key={form.id}
              className="formularios-list__card formularios-list__card--form"
              onClick={() => abrirFormulario(form.id)}
            >
              <div className="formularios-list__card-icon">
                <img src="/assets/Square_gray.svg" alt="Ícone" />
              </div>
              <div className="formularios-list__card-info">
                <h3 className="formularios-list__card-title">{form.titulo}</h3>
                <p className="formularios-list__card-desc">{form.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulariosList;

// >>> FIM DO CÓDIGO NOVO <<<