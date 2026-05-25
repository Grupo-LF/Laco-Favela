import React, { useState } from 'react';
import { ReactComponent as GrayIcon } from '../../assets/Square_gray.svg';

const Formularios = ({ onNavigate }) => {
  const [showVerTodos, setShowVerTodos] = useState(false);
  const [formularioAtual, setFormularioAtual] = useState(0);

  const formularios = [
    { 
      id: 1, 
      titulo: 'Questionário (Ciclo 1)', 
      status: 'Ativo', 
      respondidos: 9, 
      pendentes: 3, 
      respostas: [
        { presidente: 'João Silva', data: 'Hoje 09:40', familias: 'Quantitativo', eventos: 'Quantitativo', status: 'Completo' },
        { presidente: 'Maria Santos', data: 'Ontem 14:20', familias: 'Qualitativo', eventos: 'Qualitativo', status: 'Pendente' },
        { presidente: 'Pedro Costa', data: '15/01/2026', familias: 'Quantitativo', eventos: 'Quantitativo', status: 'Completo' },
        { presidente: 'Ana Paula', data: '14/01/2026', familias: 'Qualitativo', eventos: 'Qualitativo', status: 'Completo' },
        { presidente: 'Carlos Mendes', data: '13/01/2026', familias: 'Quantitativo', eventos: 'Quantitativo', status: 'Pendente' },
        { presidente: 'Fernanda Lima', data: '12/01/2026', familias: 'Qualitativo', eventos: 'Qualitativo', status: 'Completo' }
      ]
    },
    { 
      id: 2, 
      titulo: 'Cadastro de Família', 
      status: 'Rascunho', 
      editado: 'Há 2 dias', 
      respostas: [
        { presidente: 'Ana Oliveira', data: '12/01/2026', familias: 'Quantitativo', eventos: 'Quantitativo', status: 'Completo' },
        { presidente: 'Roberto Silva', data: '11/01/2026', familias: 'Qualitativo', eventos: 'Qualitativo', status: 'Completo' },
        { presidente: 'Carla Souza', data: '10/01/2026', familias: 'Quantitativo', eventos: 'Quantitativo', status: 'Pendente' }
      ]
    }
  ];

  const atual = formularios[formularioAtual];
  
  // Função para pegar iniciais do nome
  const getIniciais = (nome) => {
    return nome.split(' ').map(n => n[0]).join('');
  };

  if (showVerTodos) {
    return (
      <div className="view-section active">
        <div className="header">
          <button className="btn btn-outline" onClick={() => setShowVerTodos(false)}>← Voltar</button>
          <h2>Todos os formulários</h2>
        </div>
        <div className="card">
          {formularios.map((form, idx) => (
            <div key={form.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => { setFormularioAtual(idx); setShowVerTodos(false); }}>
              <strong>{form.titulo}</strong>
              <p className="text-sm" style={{ margin: 0, color: '#666' }}>Publicado em 15 Jan 2026</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h2>Formulários</h2>
        <button className="btn btn-primary" onClick={() => setShowVerTodos(true)}>Ver todos</button>
      </div>

      <div className="view-section active">
        <div className="grid-3" style={{ gap: 20 }}>
          {formularios.map((form, idx) => (
            <div key={form.id} className="card" style={{ position: 'relative', cursor: 'pointer'}} onClick={() => setFormularioAtual(idx)}>
              <GrayIcon />
              <span className="badge" style={{ position: 'absolute', top: '10%', right: '10%' }}>{form.status}</span>
              <h3 className='mt-3' style={{ fontWeight: '700' }}>{form.titulo}</h3>
              <hr style={{ margin: '24px 0', border: 'none', borderTop: '2px solid #e0e0e0' }} />
              {form.respondidos && <div className="flex gap-2 text-sm" style={{ marginTop: '1rem', alignItems: 'center' }}>
                <GrayIcon style={{ width: '1.5rem', height: '1.5rem' }} /> <span>{form.respondidos} respondidos</span>
                <GrayIcon style={{ width: '1.5rem', height: '1.5rem', marginLeft: '3.5rem' }} /> <span>{form.pendentes} pendentes</span>
              </div>}
              {form.editado && <p className="text-sm" style={{ marginTop: '1rem' }}>Última edição: {form.editado}</p>}
            </div>
          ))}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => onNavigate('criar-formulario')}>
            <GrayIcon /><h3 style={{ marginTop: '0.5rem' }}>Novo Formulário</h3>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontWeight: '700' }}>Respostas Recentes</h3>
          <p className="text-sm" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>Formulário: {atual.titulo}</p>
          
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
              {atual.respostas.map((r, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ backgroundColor: '#D9D9D9', borderRadius: '50%', width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <strong>{getIniciais(r.presidente)}</strong>
                      </div>
                      <strong>{r.presidente}</strong>
                    </div>
                   </td>
                  <td>{r.data}</td>
                  <td>{r.familias}</td>
                  <td>{r.eventos}</td>
                  <td><span className="badge">{r.status}</span></td>
                  <td style={{transform: 'scale(0.95)', margin: '0'}}>
                    {r.status === 'Completo' 
                      ? <button className="btn btn-outline " onClick={() => onNavigate('ver-formulario')}>Ver</button>
                      : <button className="btn btn-primary " onClick={() => onNavigate('notificar')} >Notificar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Formularios;