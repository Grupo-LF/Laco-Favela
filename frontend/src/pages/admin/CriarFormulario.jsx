import React, { useState } from 'react';

const CriarFormulario = ({ onNavigate }) => {
  const [titulo, setTitulo] = useState('');

  const handlePublicar = () => {
    alert('Formulário publicado com sucesso!');
    onNavigate('formularios');
  };

  return (
    
    <div className="view-section active">

      <div className="card">
        <div>
          <label className="text-sm">Insira o Título do Formulário:</label>
          <input 
            type="text" 
            placeholder="Título do Formulário" 
            className="input-full"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <label className="text-sm">Insira a descrição do Formulário:</label>
          <input type="text" placeholder="Descrever informações importantes do formulário" className="input-full" />
        </div>

        <div className="form-question-box">
          <label className="text-sm">Insira a 1ª pergunta aqui</label>
          <input type="text" placeholder="Exemplo de Resposta para o Usuário" className="input-underline" />
        </div>

        <div className="add-question-section">
          <p className="text-sm">Adicione uma pergunta:</p>
          <div className="flex gap-1" style={{ marginTop: '10px', flexDirection:'column' }}>
            <button className="btn btn-outline" style={{width:'20%'}}>Resposta Única +</button>
            <button className="btn btn-outline" style={{width:'20%'}}>Múltipla Escolha +</button>
            <button className="btn btn-outline" style={{width:'20%'}}>Resposta aberta +</button>
          </div>
        </div>
      </div>

      <div className="flex gap-1" style={{ marginTop: '1rem' }}>
        <button className="btn btn-danger">Excluir</button>
        <button className="btn btn-outline">Salvar</button>
        <button className="btn btn-primary" onClick={handlePublicar}>Publicar</button>
      </div>
    </div>
  );
};

export default CriarFormulario;