import React, { useState, useEffect } from 'react';
import '../../styles/pages/morador/perfil_morador.css'; // Ajuste o caminho se necessário

export default function PerfilMorador() {
  // Estados para os dados cadastrais
  const [profileData, setProfileData] = useState({
    nomeCompleto: 'Pedro Pereira dos Santos',
    email: 'nomesobrenome@email.com',
    telefone: '(81) 00000-0000',
    endereco: 'Rua da Amarração, 00, Casinha, Recife - PE',
    comunidade: 'Fitinha',
    rendaFamiliar: '1 salário mínimo',
    status: 'Mãe Solo',
    quantidadeIntegrantes: '3 pessoas',
    quantidadeFilhos: '2',
    bolsaFamilia: 'Não',
    presidenteRua: 'André Alves'
  });

  // Estados para alteração de senha
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // 🔗 LINK DO BACK-END: Buscar dados do morador ao carregar a página
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://api.lacofavela.com.br/morador/perfil', {
          headers: {
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // setProfileData(data); // Descomente quando a API estiver pronta
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleProfileSave = async () => {
    try {
      // 🔗 LINK DO BACK-END: Atualizar dados cadastrais
      const response = await fetch('https://api.lacofavela.com.br/morador/perfil/atualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (response.ok) alert('Dados salvos com sucesso!');
    } catch (error) {
      alert('Erro ao salvar dados.');
    }
  };

  const handlePasswordSave = async () => {
    if (novaSenha !== confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }
    try {
      // 🔗 LINK DO BACK-END: Alterar senha
      const response = await fetch('https://api.lacofavela.com.br/morador/perfil/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha })
      });
      if (response.ok) {
        alert('Senha alterada com sucesso!');
        setNovaSenha('');
        setConfirmarSenha('');
      }
    } catch (error) {
      alert('Erro ao alterar senha.');
    }
  };

  return (
    <div className="perfil-container">
      <header className="page-header">
        <h1>Perfil</h1>
      </header>

      {/* Bloco 1: Dados do Morador */}
      <div className="profile-card">
        <h2>Dados do Morador</h2>
        
        <div className="form-grid">
          <div className="input-group full-width">
            <label>Nome Completo</label>
            <input type="text" value={profileData.nomeCompleto} disabled />
          </div>

          <div className="input-group mid-width">
            <label>E-mail</label>
            <input type="email" value={profileData.email} disabled />
          </div>
          <div className="input-group mid-width">
            <label>Telefone</label>
            <input type="text" value={profileData.telefone} disabled />
          </div>

          <div className="input-group long-width">
            <label>Endereço</label>
            <input type="text" value={profileData.endereco} disabled />
          </div>
          <div className="input-group short-width">
            <label>Comunidade</label>
            <input type="text" value={profileData.comunidade} disabled />
          </div>

          <div className="input-group tier-width">
            <label>Renda Familiar</label>
            <input type="text" value={profileData.rendaFamiliar} disabled />
          </div>
          <div className="input-group tier-width">
            <label>Status</label>
            <input type="text" value={profileData.status} disabled />
          </div>
          <div className="input-group tier-width">
            <label>Quantidade de Integrantes da casa</label>
            <input type="text" value={profileData.quantidadeIntegrantes} disabled />
          </div>

          <div className="input-group tier-width">
            <label>Quantidade de Filhos</label>
            <input type="text" value={profileData.quantidadeFilhos} disabled />
          </div>
          <div className="input-group tier-width">
            <label>Bolsa Família ou outro</label>
            <input type="text" value={profileData.bolsaFamilia} disabled />
          </div>
          <div className="input-group tier-width">
            <label>Presidente de Rua responsável</label>
            <input type="text" value={profileData.presidenteRua} disabled />
          </div>
        </div>

        <div className="actions-row">
          <button className="btn-secondary">Desfazer</button>
          <button className="btn-primary" onClick={handleProfileSave}>Salvar</button>
        </div>
      </div>

      {/* Bloco 2: Alteração de Senha */}
      <div className="profile-card password-card">
        <h2>Alteração de Senha</h2>
        <div className="form-grid">
          <div className="input-group half-width">
            <label>Nova senha:</label>
            <input 
              type="password" 
              placeholder="Digite a nova senha" 
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="input-group half-width">
            <label>Confirme sua nova senha:</label>
            <input 
              type="password" 
              placeholder="Digite a senha novamente" 
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
        </div>
        <div className="actions-row">
          <button className="btn-secondary" onClick={() => { setNovaSenha(''); setConfirmarSenha(''); }}>Desfazer</button>
          <button className="btn-primary" onClick={handlePasswordSave}>Salvar nova senha</button>
        </div>
      </div>
    </div>
  );
}