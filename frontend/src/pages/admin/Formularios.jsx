import React, { useState, useEffect } from 'react';
import { ReactComponent as GrayIcon } from '../../assets/Square_gray.svg';
import { ReactComponent as BlacktIcon } from '../../assets/Square_black.svg';
import { listarCiclos, getFormulariosDoCiclo } from '../../services/formularios';

const Formularios = ({ onNavigate }) => {
  const [showVerTodos, setShowVerTodos] = useState(false);
  const [formularioAtual, setFormularioAtual] = useState(null);
  const [ciclos, setCiclos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respostasAtuais, setRespostasAtuais] = useState([]);

  // Carregar ciclos ao montar componente
  useEffect(() => {
    carregarCiclos();
  }, []);

  const carregarCiclos = async () => {
    try {
      setLoading(true);
      const data = await listarCiclos();
      setCiclos(data);
      
      // Selecionar o primeiro ciclo como atual se existir
      if (data.length > 0) {
        setFormularioAtual(data[0]);
        await carregarRespostasDoCiclo(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar ciclos:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarRespostasDoCiclo = async (cicloId) => {
    try {
      const data = await getFormulariosDoCiclo(cicloId);
      setRespostasAtuais(data.respostas || []);
    } catch (error) {
      console.error('Erro ao carregar respostas:', error);
      setRespostasAtuais([]);
    }
  };

  const handleSelecionarCiclo = async (ciclo, index) => {
    setFormularioAtual(ciclo);
    console.log('Ciclo selecionado:', ciclo, 'Index:', index);
    await carregarRespostasDoCiclo(ciclo.id);
    setShowVerTodos(false);
  };

  // Função para pegar iniciais do nome
  const getIniciais = (nome) => {
    if (!nome) return '??';
    return nome.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Formatar data
  const formatarData = (dataString) => {
    if (!dataString) return 'Não respondido';
    const data = new Date(dataString);
    const agora = new Date();
    const hoje = new Date(agora.setHours(0,0,0,0));
    const dataCompare = new Date(data.setHours(0,0,0,0));
    
    const diffDias = Math.floor((agora - data) / (1000 * 60 * 60 * 24));
    
    if (diffDias === 0) return `Hoje ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDias === 1) return `Ontem ${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    return data.toLocaleDateString('pt-BR');
  };

  // Mapear status do backend para exibição
  const mapearStatus = (status) => {
    const statusMap = {
      'concluido': 'Completo',
      'em_andamento': 'Em andamento',
      'nao_iniciado': 'Pendente',
      'enviado': 'Completo'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <p>Carregando formulários...</p>
      </div>
    );
  }

  if (showVerTodos) {
    return (
      <div>
        <div className="header">
          <div className="flex">
            <BlacktIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
            <h2>Todos os formulários</h2>
          </div>
          <button className="btn btn-outline" onClick={() => setShowVerTodos(false)}>← Voltar</button>
        </div>

        <div className="view-section active">
          <div>
            {ciclos.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Nenhum formulário cadastrado ainda.</p>
                <button className="btn btn-primary" onClick={() => onNavigate('criar-formulario')}>
                  Criar primeiro formulário
                </button>
              </div>
            ) : (
              ciclos.map((ciclo, idx) => (
                <div 
                  className="card" 
                  key={ciclo.id} 
                  style={{ 
                    padding: '1.5rem', 
                    borderBottom: '1px solid #eee', 
                    cursor: 'pointer', 
                    marginBottom: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between' 
                  }} 
                  onClick={() => handleSelecionarCiclo(ciclo, idx)}
                >
                  <div>
                    <strong>{ciclo.titulo}</strong>
                    <p className="text-sm" style={{ margin: '5px 0 0 0', color: '#666' }}>
                      Status: {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
                    </p>
                  </div>
                  <p className="text-sm" style={{ margin: 0, color: '#666' }}>
                    Criado em: {new Date(ciclo.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!formularioAtual) {
    return (
      <div>
        <div className="header">
          <h2>Formulários</h2>
          <button className="btn btn-primary" onClick={() => setShowVerTodos(true)}>Ver todos</button>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Nenhum formulário disponível.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('criar-formulario')}>
            Criar formulário
          </button>
        </div>
      </div>
    );
  }

  // Calcular estatísticas
  const totalRespostas = respostasAtuais.length;
  const respostasCompletas = respostasAtuais.filter(r => r.status === 'concluido' || r.status === 'enviado').length;
  const respostasPendentes = totalRespostas - respostasCompletas;

  return (
    <div>
      <div className="header">
        <h2>Formulários</h2>
        <button className="btn btn-primary" onClick={() => setShowVerTodos(true)}>Ver todos</button>
      </div>

      <div className="view-section active">
        <div className="grid-3" style={{ gap: 20 }}>
          {ciclos.slice(0, 3).map((ciclo) => (
            <div 
              key={ciclo.id} 
              className="card" 
              style={{ position: 'relative', cursor: 'pointer', opacity: formularioAtual.id === ciclo.id ? 1 : 0.7 }} 
              onClick={() => handleSelecionarCiclo(ciclo, ciclos.indexOf(ciclo))}
            >
              <GrayIcon />
              <span className="badge" style={{ position: 'absolute', top: '10%', right: '10%' }}>
                {ciclo.status === 'ativo' ? 'Ativo' : ciclo.status === 'rascunho' ? 'Rascunho' : 'Encerrado'}
              </span>
              <h3 className='mt-3' style={{ fontWeight: '700' }}>{ciclo.titulo}</h3>
              <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e0e0e0' }} />
              
              {ciclo.status === 'ativo' && (
                <div className="flex gap-2 text-sm" style={{ marginTop: '1rem', alignItems: 'center' }}>
                  <GrayIcon style={{ width: '1.5rem', height: '1.5rem' }} /> 
                  <span>{respostasCompletas} respondidos</span>
                  <GrayIcon style={{ width: '1.5rem', height: '1.5rem', marginLeft: '3.5rem' }} /> 
                  <span>{respostasPendentes} pendentes</span>
                </div>
              )}
              
              {ciclo.status === 'rascunho' && (
                <p className="text-sm" style={{ marginTop: '1rem' }}>
                  Última edição: {new Date(ciclo.atualizado_em || ciclo.criado_em).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          ))}
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
               onClick={() => onNavigate('criar-formulario')}>
            <GrayIcon />
            <h3 style={{ marginTop: '0.5rem' }}>Novo Formulário</h3>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700' }}>Respostas Recentes</h3>
          <p className="text-sm" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            Formulário: {formularioAtual.titulo}
          </p>

          {respostasAtuais.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Nenhuma resposta para este formulário ainda.</p>
            </div>
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr style={{ color: '#A1A1A1', fontSize: '12px', fontWeight: 600 }}>
                  <th>Presidente</th>
                  <th>Respondido em</th>
                  <th>Famílias Cadastradas</th>
                  <th>Eventos Realizados</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {respostasAtuais.slice(0, 10).map((resposta, i) => (
                  <tr key={resposta.id || i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: '#D9D9D9', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <strong>{getIniciais(resposta.nome || resposta.presidente_nome)}</strong>
                        </div>
                        <strong>{resposta.nome || resposta.presidente_nome} {resposta.sobrenome || ''}</strong>
                      </div>
                    </td>
                    <td>{formatarData(resposta.respondido_em || resposta.enviado_em)}</td>
                    <td>{resposta.familias_cadastradas || resposta.familias || '-'}</td>
                    <td>{resposta.eventos_realizados || resposta.eventos || '-'}</td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: mapearStatus(resposta.status) === 'Completo' ? '#4CAF50' : '#FF9800',
                        color: 'white'
                      }}>
                        {mapearStatus(resposta.status)}
                      </span>
                    </td>
                    <td style={{ transform: 'scale(0.95)', margin: '0' }}>
                      {mapearStatus(resposta.status) === 'Completo'
                        ? <button className="btn btn-outline" onClick={() => onNavigate('ver-formulario', { respostaId: resposta.id })}>Ver</button>
                        : <button className="btn btn-primary" onClick={() => onNavigate('notificar', { respostaId: resposta.id, presidente: resposta.presidente_nome })}>Notificar</button>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Formularios;