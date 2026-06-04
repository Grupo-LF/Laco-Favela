import React, { useState } from 'react';

const CriarFormulario = ({ onNavigate }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [tipoResposta, setTipoResposta] = useState('');

  const adicionarPergunta = (tipo) => {
    if (novaPergunta.trim() === '') {
      alert('Digite uma pergunta');
      return;
    }
    
    setPerguntas([...perguntas, { 
      id: Date.now(), 
      texto: novaPergunta, 
      tipo: tipo,
      opcoes: tipo === 'Resposta Única' || tipo === 'Múltipla Escolha' ? ['Opção 1', 'Opção 2', 'Opção 3'] : []
    }]);
    setNovaPergunta('');
  };

  const removerPergunta = (id) => {
    setPerguntas(perguntas.filter(p => p.id !== id));
  };

  const handlePublicar = () => {
    if (!titulo) {
      alert('Digite o título do formulário');
      return;
    }
    alert('Formulário publicado com sucesso!');
    onNavigate('formularios');
  };

  const handleSalvar = () => {
    alert('Formulário salvo com sucesso!');
  };

  // Componente para mostrar o campo de resposta correto
  const CampoResposta = ({ tipo, opcoes = [] }) => {
    if (tipo === 'Resposta Aberta') {
      return <input style={{ marginTop: '30px', width: '100%' }} type="text" placeholder="Digite sua resposta aqui..." className="input-underline" />;
    }
    if (tipo === 'Resposta Única') {
      return (
        <div style={{ marginTop: '16px' }}>
          {opcoes.map((op, idx) => (
            <div key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" name={`radio-${Date.now()}`} /> <span>{op}</span>
            </div>
          ))}
        </div>
      );
    }
    if (tipo === 'Múltipla Escolha') {
      return (
        <div style={{ marginTop: '16px' }}>
          {opcoes.map((op, idx) => (
            <div key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" /> <span>{op}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Criar Novo Formulário</h2>
      </div>
      <div className="view-section active">

        <div className="card">
          <div className="flex" style={{ alignItems: 'center', flexDirection: 'row'}}>
            <label style={{  whiteSpace: 'nowrap' }}><strong>Insira o Título do Formulário:</strong></label>
            <input 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }}
              type="text" 
              placeholder="Título do Formulário" 
              className="input-full"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="flex" style={{ alignItems: 'center', flexDirection: 'row'}}>
            <label style={{ whiteSpace: 'nowrap'}}><strong>Insira a descrição do Formulário:</strong></label>
            
          <input 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%' }} 
            type="text" 
            placeholder="Descrever informações importantes do formulário" 
            className="input-full"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          </div>
       
        </div>

        {/* LISTA DE PERGUNTAS ADICIONADAS */}
        {perguntas.map((pergunta, idx) => (
          <div key={pergunta.id} className="form-question-box" style={{ position: 'relative' }}>
            <label className="text-sm">Pergunta {idx + 1}: {pergunta.texto}</label>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Tipo: {pergunta.tipo}</p>
            <button 
              onClick={() => removerPergunta(pergunta.id)}
              style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px',
                background: 'none',
                border: 'none',
                color: 'red',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
            
            <CampoResposta tipo={pergunta.tipo} opcoes={pergunta.opcoes} />
            
            <hr style={{ width: '50%' }} />
          </div>
        ))}

        {/* NOVA PERGUNTA */}
        <div className="form-question-box">
          <label className="text-sm">Insira a nova pergunta aqui</label>
          <input 
            style={{ marginTop: '30px' }} 
            type="text" 
            placeholder="Digite sua pergunta" 
            className="input-underline"
            value={novaPergunta}
            onChange={(e) => setNovaPergunta(e.target.value)}
          />
          <hr style={{ width: '50%' }} />
        </div>

        <div className="card">
          <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Adicione uma pergunta:</p>
          <div className="flex gap-1" style={{ marginTop: '20px', flexDirection: 'column', gap: '14px' }}>
            <button 
              className="btn btn-outline" 
              style={{ width: '16%', justifyContent: 'center', padding: '0.8rem', color: 'gray' }}
              onClick={() => adicionarPergunta('Resposta Única')}
            >
              Resposta Única +
            </button>
            <button 
              className="btn btn-outline" 
              style={{ width: '16%', justifyContent: 'center', padding: '0.8rem', color: 'gray' }}
              onClick={() => adicionarPergunta('Múltipla Escolha')}
            >
              Múltipla Escolha +
            </button>
            <button 
              className="btn btn-outline" 
              style={{ width: '16%', justifyContent: 'center', padding: '0.8rem', color: 'gray' }}
              onClick={() => adicionarPergunta('Resposta Aberta')}
            >
              Resposta aberta +
            </button>
          </div>
        </div>

        <div className="flex gap-3" style={{ marginTop: '2rem', marginBottom: '10rem' }}>
          <button className="btn btn-danger">Excluir</button>
          <button className="btn btn-outline" onClick={handleSalvar}>Salvar</button>
          <button className="btn btn-primary" onClick={handlePublicar}>Publicar</button>
        </div>
      </div>
    </div>
  );
};

export default CriarFormulario;