import React, { useState } from 'react';

function NovoPresidenteModal({ onFechar, onCadastrar, carregando }) {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !setor) return;

    // Repassa os dados preenchidos para a função principal tratar a API
    onCadastrar({ nome, setor });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    }}>
      {/* Container Principal */}
      <div style={{
        backgroundColor: '#FFFFFF',
        width: '100%',
        maxWidth: '500px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        fontFamily: 'inherit'
      }}>
        
        {/* Cabeçalho */}
        <div style={{
          backgroundColor: 'var(--color-primary, #046BAA)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#FFFFFF', margin: 0, fontSize: '20px', fontWeight: '600' }}>
            Novo Presidente
          </h2>
          <button 
            onClick={onFechar}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '24px',
              cursor: 'pointer',
              lineHeight: '1',
              padding: '4px'
            }}
          >
            &times;
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          
          {/* Nome */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '14px' }}>
              Nome e Sobrenome do Presidente
            </label>
            <input 
              type="text" 
              placeholder="Ex.: Sandra Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Setor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            <label style={{ fontWeight: '600', color: '#2B2B2B', fontSize: '14px' }}>
              Setor:
            </label>
            <input 
              type="text" 
              placeholder="Ex.: X"
              value={setor}
              onChange={(e) => setSetor(e.target.value)}
              required
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Ações */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={carregando}
              style={{
                backgroundColor: 'var(--color-primary, #046BAA)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '24px',
                padding: '12px 28px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(4, 107, 170, 0.2)'
              }}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar presidente'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default NovoPresidenteModal;