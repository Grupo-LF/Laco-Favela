import React from 'react';

function Login({ onLogin }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#f0f0f0',
      gap: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '300px'
      }}>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Logo</div>
        <p style={{ color: '#666', marginBottom: '8px' }}>Escolha seu perfil</p>
        <button
          onClick={() => onLogin('admin')}
          style={{
            width: '100%',
            padding: '14px',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Entrar como Admin
        </button>
        <button
          onClick={() => onLogin('presidente')}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fff',
            color: '#333',
            border: '2px solid #333',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Entrar como Presidente
        </button>
      </div>
    </div>
  );
}

export default Login;