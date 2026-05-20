import React, { useState } from 'react';

const Formularios = ({ onNavigate }) => {
  const [showVerTodos, setShowVerTodos] = useState(false);
  
  const formularios = [
    { id: 1, titulo: 'Questionário (Ciclo 1)', status: 'Ativo', respondidos: 9, pendentes: 3 },
    { id: 2, titulo: 'Cadastro de Família', status: 'Rascunho', editado: 'Há 2 dias' }
  ];

  if (showVerTodos) {
    return (
      <div className="view-section active">
        <div className="header">
          <button className="btn btn-outline" onClick={() => setShowVerTodos(false)}>← Voltar</button>
          <h2>Todos os formulários</h2>
        </div>
        <div className="card">
          {formularios.map(form => (
            <div key={form.id} style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <span>{form.titulo}</span>
              <span className="text-sm">Publicado em 15 Jan 2026</span>
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

      <div className="grid-3">
        {formularios.map(form => (
          <div key={form.id} className="card">
            <div className="flex justify-between">
              <h4>{form.titulo}</h4>
              <span className="badge">{form.status}</span>
            </div>
            {form.respondidos && (
              <div className="flex gap-2 text-sm" style={{ marginTop: '1rem' }}>
                <span>{form.respondidos} respondidos</span>
                <span>{form.pendentes} pendentes</span>
              </div>
            )}
            {form.editado && (
              <p className="text-sm" style={{ marginTop: '1rem' }}>Última edição: {form.editado}</p>
            )}
            <button className="btn btn-outline" style={{ marginTop: '1rem', width: '100%' }}>Ver detalhes</button>
          </div>
        ))}
        <div 
          className="card" 
          style={{ justifyContent: 'center', textAlign: 'center', border: '2px dashed #ccc', background: 'transparent', cursor: 'pointer' }}
          onClick={() => onNavigate('criar-formulario')}
        >
          <h4>+ Novo Formulário</h4>
        </div>
      </div>

      <div className="card">
        <h4>Respostas Recentes</h4>
        <p className="text-sm">Formulário: Questionário (Ciclo 1)</p>
        <table>
          <thead><tr><th>Presidente</th><th>Respondido em</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>João Silva</strong></td>
              <td>Hoje 09:40</td>
              <td><span className="badge">Completo</span></td>
              <td><button className="btn btn-outline" onClick={() => onNavigate('ver-formulario')}>Ver</button></td>
            </tr>
            <tr>
              <td><strong>Maria Santos</strong></td>
              <td>Ontem 14:20</td>
              <td><span className="badge" style={{ background: '#9c9c9c' }}>Pendente</span></td>
              <td><button className="btn btn-primary">Notificar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default Formularios;