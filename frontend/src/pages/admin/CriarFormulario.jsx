import React, { useState, useEffect, useCallback } from 'react';
import { criarCiclo, publicarCiclo, associarRespostasAsFamilias, listarFamilias } from '../../services/formularios';

const CriarFormulario = ({ onNavigate }) => {
  // ========== DECLARAÇÕES DE ESTADO ==========
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [perguntas, setPerguntas] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [familias, setFamilias] = useState([]);
  const [familiasSelecionadas, setFamiliasSelecionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log('🟢 [CriarFormulario] Componente renderizado');

  // ========== CARREGAR FAMÍLIAS ==========
  useEffect(() => {
    console.log('🟢 [CriarFormulario] useEffect - carregarFamilias');
    carregarFamilias();
  }, []);

  const carregarFamilias = async () => {
    console.log('🔄 [carregarFamilias] Iniciando...');
    try {
      setLoading(true);
      const data = await listarFamilias();
      console.log('✅ [carregarFamilias] Famílias carregadas:', data.length);
      setFamilias(data);
      setError('');
    } catch (err) {
      console.error('❌ [carregarFamilias] Erro:', err);
      setError('Erro ao carregar lista de famílias');
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNÇÕES DE PERGUNTAS ==========
  const adicionarPergunta = (tipo) => {
    console.log('📝 [adicionarPergunta] Tipo:', tipo, 'Texto:', novaPergunta);
    if (novaPergunta.trim() === '') {
      console.warn('⚠️ [adicionarPergunta] Pergunta vazia, ignorando');
      return;
    }

    setPerguntas([...perguntas, {
      id: Date.now(),
      texto: novaPergunta,
      tipo: tipo,
      opcoes: tipo === 'Resposta Única' || tipo === 'Múltipla Escolha' ? ['Opção 1', 'Opção 2', 'Opção 3'] : []
    }]);
    console.log('✅ [adicionarPergunta] Pergunta adicionada. Total:', perguntas.length + 1);
    setNovaPergunta('');
  };

  const removerPergunta = (id) => {
    console.log('🗑️ [removerPergunta] ID:', id);
    if (window.confirm('Tem certeza que deseja remover esta pergunta?')) {
      setPerguntas(perguntas.filter(p => p.id !== id));
      console.log('✅ [removerPergunta] Pergunta removida');
    }
  };

  // ========== FUNÇÕES PARA EDITAR OPÇÕES ==========
  const adicionarOpcao = useCallback((perguntaId) => {
    console.log('➕ [adicionarOpcao] Pergunta ID:', perguntaId);
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
    console.log('➖ [removerOpcao] Pergunta ID:', perguntaId, 'Opção Index:', opcaoIndex);
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
    console.log('✏️ [atualizarOpcao] Pergunta ID:', perguntaId, 'Opção:', opcaoIndex, 'Novo valor:', novoValor);
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

  // ========== FUNÇÕES DE FAMÍLIAS ==========
  const toggleFamilia = (familiaId) => {
    console.log('🔄 [toggleFamilia] Familia ID:', familiaId);
    if (familiasSelecionadas.includes(familiaId)) {
      setFamiliasSelecionadas(familiasSelecionadas.filter(id => id !== familiaId));
      console.log('❌ Removida. Total:', familiasSelecionadas.length - 1);
    } else {
      setFamiliasSelecionadas([...familiasSelecionadas, familiaId]);
      console.log('✅ Adicionada. Total:', familiasSelecionadas.length + 1);
    }
  };

  const selecionarTodasFamilias = () => {
    console.log('🔘 [selecionarTodasFamilias]');
    if (familiasSelecionadas.length === familias.length) {
      setFamiliasSelecionadas([]);
      console.log('❌ Todas desselecionadas');
    } else {
      setFamiliasSelecionadas(familias.map(f => f.id));
      console.log('✅ Todas selecionadas:', familias.length);
    }
  };

  // ========== FUNÇÃO SALVAR RASCUNHO ==========
  const handleSalvar = async () => {
    console.log('=' .repeat(50));
    console.log('💾 [handleSalvar] INICIANDO SALVAR COMO RASCUNHO');
    console.log('📝 Título:', titulo);
    console.log('📝 Descrição:', descricao);
    console.log('📝 Perguntas:', perguntas.length);
    
    if (!titulo) {
      console.warn('❌ [handleSalvar] Título vazio');
      alert('Digite o título do formulário');
      return;
    }

    if (perguntas.length === 0) {
      console.warn('❌ [handleSalvar] Nenhuma pergunta');
      alert('Adicione pelo menos uma pergunta ao formulário');
      return;
    }

    setLoading(true);
    setError('');

    const dadosParaEnviar = {
      titulo: titulo,
      descricao: descricao,
      perguntas: perguntas,
      status: 'rascunho'
    };
    console.log('📤 [handleSalvar] Dados enviados:', JSON.stringify(dadosParaEnviar, null, 2));

    try {
      const ciclo = await criarCiclo(dadosParaEnviar);
      console.log('✅ [handleSalvar] Resposta:', ciclo);
      console.log('✅ [handleSalvar] Status retornado:', ciclo.status);
      alert('Formulário salvo como rascunho!');
      onNavigate('formularios');
    } catch (err) {
      console.error('❌ [handleSalvar] Erro:', err);
      console.error('❌ Detalhes:', err.response?.data);
      setError(err.response?.data?.detail || 'Erro ao salvar formulário');
    } finally {
      setLoading(false);
      console.log('🏁 [handleSalvar] Finalizado');
      console.log('=' .repeat(50));
    }
  };

  // ========== FUNÇÃO PUBLICAR ==========
  const handlePublicar = async () => {
    console.log('=' .repeat(50));
    console.log('🚀 [handlePublicar] INICIANDO PUBLICAÇÃO');
    console.log('📝 Título:', titulo);
    console.log('📝 Descrição:', descricao);
    console.log('📝 Perguntas:', perguntas.length);
    console.log('📝 Famílias selecionadas:', familiasSelecionadas.length, familiasSelecionadas);
    
    if (!titulo) {
      console.warn('❌ [handlePublicar] Título vazio');
      alert('Digite o título do formulário');
      return;
    }

    if (perguntas.length === 0) {
      console.warn('❌ [handlePublicar] Nenhuma pergunta');
      alert('Adicione pelo menos uma pergunta ao formulário');
      return;
    }

    if (familiasSelecionadas.length === 0) {
      console.warn('❌ [handlePublicar] Nenhuma família selecionada');
      alert('Selecione pelo menos uma família para responder o formulário');
      return;
    }

    setLoading(true);
    setError('');

    // Transformar perguntas para o formato do backend
    const perguntasFormatadas = perguntas.map((p, idx) => ({
      texto: p.texto,
      tipo: p.tipo === 'Resposta Única' ? 'selecao_unica' : 
            p.tipo === 'Múltipla Escolha' ? 'selecao_multipla' : 'texto',
      obrigatoria: true,
      ordem: idx,
      opcoes: p.opcoes?.map((opcao, opIdx) => ({
        texto: opcao,
        ordem: opIdx
      })) || []
    }));

    const dadosParaEnviar = {
      titulo: titulo,
      descricao: descricao,
      perguntas: perguntasFormatadas,
      familias_ids: familiasSelecionadas,
      status: 'ativo'  // ← ATENÇÃO: Está enviando 'ativo'
    };

    console.log('📤 [handlePublicar] STATUS SENDO ENVIADO:', dadosParaEnviar.status);
    console.log('📤 [handlePublicar] Dados completos:', JSON.stringify(dadosParaEnviar, null, 2));

    try {
      console.log('🔄 [handlePublicar] Chamando criarCiclo...');
      const ciclo = await criarCiclo(dadosParaEnviar);
      
      console.log('✅ [handlePublicar] RESPOSTA DO BACKEND:');
      console.log('   - ID:', ciclo.id);
      console.log('   - Título:', ciclo.titulo);
      console.log('   - Status RECEBIDO:', ciclo.status);
      
      if (ciclo.status === 'ativo') {
        console.log('🎉 [handlePublicar] SUCESSO! Ciclo criado como ATIVO');
      } else {
        console.warn(`⚠️ [handlePublicar] ATENÇÃO! Status retornado: "${ciclo.status}" (esperado "ativo")`);
        console.warn('   → O backend pode estar ignorando o status enviado');
      }
      
      alert('Formulário publicado com sucesso!');
      onNavigate('formularios');
      
    } catch (err) {
      console.error('❌ [handlePublicar] ERRO:');
      console.error('   - Mensagem:', err.message);
      console.error('   - Status:', err.response?.status);
      console.error('   - Dados do erro:', err.response?.data);
      setError(err.response?.data?.detail || 'Erro ao publicar formulário');
    } finally {
      setLoading(false);
      console.log('🏁 [handlePublicar] Finalizado');
      console.log('=' .repeat(50));
    }
  };

  // ========== COMPONENTE CAMPO RESPOSTA ==========
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
                  border: '1px solid #ccc', 
                  borderRadius: '4px'
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
                  borderRadius: '4px'
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

  // ========== RENDER ==========
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label><strong>Insira o Título do Formulário:</strong></label>
            <input
              type="text"
              placeholder="Título do Formulário"
              className="input-full"
              style={{ flex: 1, padding: '0.5rem', border: 'none', outline:'none', borderRadius: '4px' }}
              value={titulo}
              onChange={(e) => {
                console.log('📝 [Título] alterado:', e.target.value);
                setTitulo(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <label><strong>Insira a descrição do Formulário:</strong></label>
            <input
              type="text"
              placeholder="Descrever informações importantes do formulário"
              className="input-full"
              style={{ flex: 1, padding: '0.5rem', border: 'none',outline:'none', borderRadius: '4px' }}
              value={descricao}
              onChange={(e) => {
                console.log('📝 [Descrição] alterado:', e.target.value);
                setDescricao(e.target.value);
              }}
            />
          </div>
        </div>

        {perguntas.map((pergunta, idx) => (
          <div key={pergunta.id} className="form-question-box" style={{ position: 'relative', border: '1px solid #eee', padding: '1rem', marginTop: '1rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="text-sm"><strong>Pergunta {idx + 1}:</strong> {pergunta.texto}</label>
              <button
                onClick={() => removerPergunta(pergunta.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'red',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="Remover pergunta"
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>Tipo: {pergunta.tipo}</p>

            <CampoResposta 
              tipo={pergunta.tipo} 
              opcoes={pergunta.opcoes} 
              perguntaId={pergunta.id}
            />
          </div>
        ))}

        <div className="form-question-box" style={{ marginTop: '1rem' }}>
          <label className="text-sm">Insira a nova pergunta aqui</label>
          <input
            type="text"
            placeholder="Digite sua pergunta"
            className="input-underline"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', border: 'none', borderBottom: '1px solid #ccc' }}
            value={novaPergunta}
            onChange={(e) => {
              console.log('📝 [NovaPergunta] alterado:', e.target.value);
              setNovaPergunta(e.target.value);
            }}
          />
        </div>

        <div className="card" style={{ marginTop: '1rem' }}>
          <p style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Adicione uma pergunta:</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '10px',flexDirection:'column', maxWidth:'200px',justifyContent:'center'}}>
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', cursor: 'pointer',display:'block' }}
              onClick={() => adicionarPergunta('Resposta Única')}
            >
              Resposta Única +
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', cursor: 'pointer' ,display:'block'}}
              onClick={() => adicionarPergunta('Múltipla Escolha')}
            >
              Múltipla Escolha +
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', display:'block' }}
              onClick={() => adicionarPergunta('Resposta Aberta')}
            >
              Resposta aberta +
            </button>
          </div>
        </div>

        {/* SELEÇÃO DE FAMÍLIAS */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Selecionar Famílias que irão responder</h3>

          {loading && familias.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p>Carregando famílias...</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {familiasSelecionadas.length} de {familias.length} selecionadas
                </span>
                <button className="btn btn-outline" onClick={selecionarTodasFamilias} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                  {familiasSelecionadas.length === familias.length ? 'Desselecionar Todas' : 'Selecionar Todas'}
                </button>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {familias.map(familia => (
                  <div
                    key={familia.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      margin: '0.5rem 0',
                      backgroundColor: familiasSelecionadas.includes(familia.id) ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => toggleFamilia(familia.id)}
                  >
                    <input
                      type="checkbox"
                      checked={familiasSelecionadas.includes(familia.id)}
                      onChange={() => toggleFamilia(familia.id)}
                      style={{ marginRight: '1rem', cursor: 'pointer' }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <strong>{familia.nome_responsavel}</strong>
                      <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                        {familia.num_membros} membros | {familia.comunidade || 'Sem comunidade'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '10rem' , justifyContent:'space-between', padding:'6px 4px'}}>
          <div style={{display:'flex',flexDirection:'row',gap:'1rem'}}>
           <button
            className="btn btn-primary"
            onClick={handlePublicar}
            disabled={loading || familiasSelecionadas.length === 0}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer',background:'var(--color-primary)',color:'#fff' }}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
          <button className="btn btn-outline" onClick={handleSalvar} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor:'#8C8C8C',color:'#fff'}}>
            {loading ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
         
          </div>
          <div>
          <button className="btn btn-danger" onClick={() => onNavigate('formularios')} style={{ padding: '0.5rem 1rem', cursor: 'pointer',backgroundColor:'#696969' }}>Excluir</button>
          </div>
           
        </div>
        
      </div>
    </div>
  );
};

export default CriarFormulario;