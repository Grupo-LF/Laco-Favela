import React from 'react';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
const VerFormulario = ({ onNavigate }) => {
  return (
    <div>
      <div className="header">
        <div className="flex items-center gap-1 ">
        <BlacktIcon></BlacktIcon>
        <h3 style={{ marginTop: '0.4rem' }}> <strong>Ver Formulário</strong></h3>  
        </div>
        
        <button className="btn btn-outline" onClick={() => onNavigate('formularios')}>← Voltar</button>
      </div>
    <div className="view-section active">
      
      <div >
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3>Questionário (Ciclo 1)</h3>
          <p  className="text-sm" style= {{marginTop:'1rem' ,width:'70%',lineHeight:'1.5rem'}}>Esse formulário visa coletar informações dos moradores que sinalizem interesse em receber donativos do G10 Favelas durante o Ciclo 1.

<strong>Atenção, Presidente:</strong> Preencha as informações com atenção e certifique-se que estão corretas</p>
        </div>
        <div className="form-question-box">
          <label className="text-sm">Informe o nome e sobrenome do representante da família</label>
          <input type="text" placeholder="Exemplo: Maria José da Silva" className="input-underline"  />
          <hr />
        </div>
        <div className="form-question-box">
          <label className="text-sm">Endereço completo</label>
          <input type="text" placeholder="Rua, número, complemento..." className="input-underline"  />
          <hr />
        </div>
        <div className="form-question-box">
          <label className="text-sm">Comunidade onde reside</label>
          <input type="text" placeholder="Exemplo: Comunidade Esperança" className="input-underline"  />
          <hr />
        </div>
        <div className="form-question-box">
          <label className="text-sm">Município</label>
          <input type="text" placeholder="Exemplo: Recife" className="input-underline" />
          <hr />
        </div>
      </div>
    </div>
    </div>
  );
};

export default VerFormulario;