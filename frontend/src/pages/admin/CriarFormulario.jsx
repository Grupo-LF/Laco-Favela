import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { getToken } from '../../services/auth';

const CriarFormulario = ({ onNavigate }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [presidentes, setPresidentes] = useState([]);
  const [presidentesSelecionados, setPresidentesSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarSelecaoPresidentes, setMostrarSelecaoPresidentes] = useState(false);

  // Carregar lista de presidentes ao montar componente
  useEffect(() => {
    carregarPresidentes();
  }, []);

  const carregarPresidentes = async () => {
    try {
      setLoading(true);
      getToken();
      const response = await api.get('/presidentes/');
      setPresidentes(response.data);
      setError('');
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err);
      setError('Erro ao carregar lista de presidentes');
    } finally {
      setLoading(false);
    }
  };

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

  const togglePresidente = (presidenteId) => {
    if (presidentesSelecionados.includes(presidenteId)) {
      setPresidentesSelecionados(presidentesSelecionados.filter(id => id !== presidenteId));
    } else {
      setPresidentesSelecionados([...presidentesSelecionados, presidenteId]);
    }
  };

  const selecionarTodosPresidentes = () => {
    if (presidentesSelecionados.length === presidentes.length) {
      setPresidentesSelecionados([]);
    } else {
      setPresidentesSelecionados(presidentes.map(p => p.id));
    }
  };

  const handlePublicar = async () => {
    if (!titulo) {
      alert('Digite o título do formulário');
      return;
    }
    
    if (perguntas.length === 0) {
      alert('Adicione pelo menos uma pergunta ao formulário');
      return;
    }

    if (presidentesSelecionados.length === 0) {
      alert('Selecione pelo menos um presidente para responder o formulário');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/admin/formularios/criar/', {
        titulo: titulo,
        descricao: descricao,
        perguntas: perguntas.map(p => ({
          texto: p.texto,
          tipo: p.tipo,
          opcoes: p.opcoes
        })),
        presidentes_ids: presidentesSelecionados
      });
      
      alert('Formulário publicado com sucesso!');
      onNavigate('formularios');
    } catch (err) {
      console.error('Erro ao publicar:', err);
      setError(err.response?.data?.error || 'Erro ao publicar formulário. Tente novamente.');
      alert(err.response?.data?.error || 'Erro ao publicar formulário. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!titulo) {
      alert('Digite o título do formulário');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/admin/formularios/rascunho/', {
        titulo: titulo,
        descricao: descricao,
        perguntas: perguntas.map(p => ({
          texto: p.texto,
          tipo: p.tipo,
          opcoes: p.opcoes
        })),
        presidentes_ids: presidentesSelecionados
      });
      
      alert('Formulário salvo como rascunho!');
      onNavigate('formularios');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError(err.response?.data?.error || 'Erro ao salvar formulário');
      alert(err.response?.data?.error || 'Erro ao salvar formulário');
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="card" style={{ backgroundColor: '#ffebee', color: '#c62828', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="card">
          <div className="flex" style={{ alignItems: 'center', flexDirection: 'row'}}>
            <label style={{ whiteSpace: 'nowrap' }}><strong>Insira o Título do Formulário:</strong></label>
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

        {/* SELEÇÃO DE PRESIDENTES */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Selecionar Presidentes que irão responder</h3>
          
          {loading && presidentes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p>Carregando presidentes...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {presidentesSelecionados.length} de {presidentes.length} selecionados
                </span>
                <button className="btn btn-outline" onClick={selecionarTodosPresidentes} style={{ padding: '0.5rem 1rem' }}>
                  {presidentesSelecionados.length === presidentes.length ? 'Desselecionar Todos' : 'Selecionar Todos'}
                </button>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {presidentes.map(presidente => (
                  <div 
                    key={presidente.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      margin: '0.5rem 0',
                      backgroundColor: presidentesSelecionados.includes(presidente.id) ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => togglePresidente(presidente.id)}
                  >
                    <input
                      type="checkbox"
                      checked={presidentesSelecionados.includes(presidente.id)}
                      onChange={() => togglePresidente(presidente.id)}
                      style={{ marginRight: '1rem', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <strong>{presidente.nome} {presidente.sobrenome}</strong>
                      <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                        {presidente.email} | {presidente.comunidade}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {presidentes.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <p>Nenhum presidente cadastrado ainda.</p>
                  <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                    Cadastrar Presidente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3" style={{ marginTop: '2rem', marginBottom: '10rem' }}>
          <button className="btn btn-danger">Excluir</button>
          <button className="btn btn-outline" onClick={handleSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handlePublicar}
            disabled={loading || presidentesSelecionados.length === 0}
          >
            {loading ? 'Publicando...' : 'Publicar Formulário'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CriarFormulario;