import React, { useState, useEffect, useCallback } from 'react';
import { criarCiclo, publicarCiclo, listarPresidentes, listarPresidentesNaoAssociados } from '../../services/formularios';

const CriarFormulario = ({ onNavigate }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [presidentes, setPresidentes] = useState([]);
  const [presidentesSelecionados, setPresidentesSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarPresidentes();
  }, []);

  const carregarPresidentes = async () => {
    try {
      setLoading(true);
      const data = await listarPresidentes();
      setPresidentes(data);
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
    if (window.confirm('Tem certeza que deseja remover esta pergunta?')) {
      setPerguntas(perguntas.filter(p => p.id !== id));
    }
  };

  const adicionarOpcao = useCallback((perguntaId) => {
    setPerguntas(prevPerguntas => 
      prevPerguntas.map(p => {
        if (p.id === perguntaId) {
          return { ...p, opcoes: [...p.opcoes, `Nova Opção ${p.opcoes.length + 1}`] };
        }
        return p;
      })
    );
  }, []);

  const removerOpcao = useCallback((perguntaId, opcaoIndex) => {
    setPerguntas(prevPerguntas => 
      prevPerguntas.map(p => {
        if (p.id === perguntaId) {
          if (p.opcoes.length > 1) {
            const novasOpcoes = p.opcoes.filter((_, idx) => idx !== opcaoIndex);
            return { ...p, opcoes: novasOpcoes };
          } else {
            alert('A pergunta precisa ter pelo menos uma opção');
            return p;
          }
        }
        return p;
      })
    );
  }, []);

  const atualizarOpcao = useCallback((perguntaId, opcaoIndex, novoValor) => {
    setPerguntas(prevPerguntas => 
      prevPerguntas.map(p => {
        if (p.id === perguntaId) {
          const novasOpcoes = [...p.opcoes];
          novasOpcoes[opcaoIndex] = novoValor;
          return { ...p, opcoes: novasOpcoes };
        }
        return p;
      })
    );
  }, []);

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

  const handleSalvar = async () => {
    if (!titulo) {
      alert('Digite o título do formulário');
      return;
    }

    if (perguntas.length === 0) {
      alert('Adicione pelo menos uma pergunta ao formulário');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ciclo = await criarCiclo({
        titulo: titulo,
        descricao: descricao,
        perguntas: perguntas,
        presidentes_ids: presidentesSelecionados
      });

      console.log('Rascunho salvo:', ciclo);
      alert('Formulário salvo como rascunho!');
      onNavigate('formularios');
    } catch (err) {
      console.error('Erro ao salvar:', err);
      setError(err.response?.data?.detail || 'Erro ao salvar formulário');
    } finally {
      setLoading(false);
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
      // Cria o ciclo JÁ COM OS PRESIDENTES ASSOCIADOS
      const ciclo = await criarCiclo({
        titulo: titulo,
        descricao: descricao,
        perguntas: perguntas,
        presidentes_ids: presidentesSelecionados
      });
      
      console.log('Ciclo criado com presidentes:', ciclo);
      console.log('Presidentes associados:', presidentesSelecionados);

      // Publica o ciclo
      await publicarCiclo(ciclo.id); // Atualiza a lista de presidentes não associados para refletir as mudanças
      
      alert('Formulário publicado com sucesso!');
      onNavigate('formularios');
    } catch (err) {
      console.error('Erro ao publicar:', err);
      setError(err.response?.data?.detail || 'Erro ao publicar formulário');
    } finally {
      setLoading(false);
    }
  };

  const CampoResposta = React.memo(({ tipo, opcoes = [], perguntaId }) => {
    if (tipo === 'Resposta Aberta') {
      return <input style={{ marginTop: '30px', width: '100%' }} type="text" placeholder="Digite sua resposta aqui..." className="input-underline" />;
    }
    if (tipo === 'Resposta Única') {
      return (
        <div style={{ marginTop: '16px' }}>
          {opcoes.map((op, idx) => (
            <div key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="radio" name={`radio-${perguntaId}`} />
              <input 
                type="text" 
                defaultValue={op}
                onBlur={(e) => atualizarOpcao(perguntaId, idx, e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '4px 8px', 
                  border: 'none',
                  outline: 'none', 
                  borderRadius: '4px',
                }}
              />
              <button
                onClick={() => removerOpcao(perguntaId, idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => adicionarOpcao(perguntaId)}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Adicionar opção
          </button>
        </div>
      );
    }
    if (tipo === 'Múltipla Escolha') {
      return (
        <div style={{ marginTop: '16px' }}>
          {opcoes.map((op, idx) => (
            <div key={idx} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" />
              <input 
                type="text" 
                defaultValue={op}
                onBlur={(e) => atualizarOpcao(perguntaId, idx, e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '4px 8px', 
                  border: '1px solid #ccc', 
                  borderRadius: '4px',
                  backgroundColor: '#f9f9f9'
                }}
              />
              <button
                onClick={() => removerOpcao(perguntaId, idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => adicionarOpcao(perguntaId)}
            style={{
              marginTop: '8px',
              padding: '4px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            + Adicionar opção
          </button>
        </div>
      );
    }
    return null;
  });

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
          <div className="flex" style={{ alignItems: 'center', flexDirection: 'row' }}>
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

        <div className="card" style={{ marginTop: '1rem', display: 'flex' }}>
          <div className="flex" style={{ alignItems: 'center', flexDirection: 'row', width: '100%' }}>
            <label style={{ whiteSpace: 'nowrap' }}><strong>Insira a descrição do Formulário:</strong></label>
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

        {perguntas.map((pergunta, idx) => (
          <div key={pergunta.id} className="form-question-box" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="text-sm">Pergunta {idx + 1}: {pergunta.texto}</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => removerPergunta(pergunta.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer'
                  }}
                  title="Remover pergunta"
                >
                  ✕
                </button>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Tipo: {pergunta.tipo}</p>

            <CampoResposta 
              tipo={pergunta.tipo} 
              opcoes={pergunta.opcoes} 
              perguntaId={pergunta.id}
            />

            {pergunta.tipo === 'Resposta Aberta' && (
              <hr style={{ width: '50%' }} />
            )}
          </div>
        ))}

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
                      <strong>{presidente.nome}</strong>
                      <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                        {presidente.email || 'Sem email'} | {presidente.comunidade || 'Sem comunidade'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {presidentes.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <p>Nenhum presidente cadastrado ainda.</p>
                  <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => onNavigate('presidentes')}>
                    Cadastrar Presidente
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3" style={{ marginTop: '2rem', marginBottom: '10rem' }}>
          <button className="btn btn-danger" onClick={() => onNavigate('formularios')}>Cancelar</button>
          <button className="btn btn-outline" onClick={handleSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Rascunho'}
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