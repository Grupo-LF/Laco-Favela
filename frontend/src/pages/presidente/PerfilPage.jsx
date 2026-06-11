import React from 'react';
import '../../styles/pages/presidente/PerfilPage.css';

export default function PerfilPage() {
  return (
    <div className="pres-container">
      <header className="pres-header">
        <h1>Perfil</h1>
      </header>

      {/* Seção 1: Dados do Presidente */}
      <div className="perf-section-card">
        <h3>Dados do Presidente</h3>
        <form className="perf-form-grid" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group full-width">
            <label>Nome Completo da liderança</label>
            <input type="text" defaultValue="André Alves de Oliveira" disabled />
          </div>

          <div className="form-group span-8">
            <label>Nome da organização que representa</label>
            <input type="text" defaultValue="Iniciativa Fita" disabled />
          </div>
          <div className="form-group span-4">
            <label>CNPJ da organização</label>
            <input type="text" defaultValue="000.000.000-00" disabled />
          </div>

          <div className="form-group span-6">
            <label>Endereço</label>
            <input type="text" defaultValue="Rua do Santo Laço, 00, Amarração, Recife - PE" disabled />
          </div>
          <div className="form-group span-3">
            <label>Telefone</label>
            <input type="text" defaultValue="(81) 00000-0000" disabled />
          </div>
          <div className="form-group span-3">
            <label>Redes Sociais</label>
            <input type="text" defaultValue="@apoioandrealves" disabled />
          </div>

          <div className="form-group span-6">
            <label>Comunidade atuante</label>
            <input type="text" defaultValue="Alto Santa Isabel" disabled />
          </div>
          <div className="form-group span-6">
            <label>Trabalho</label>
            <input type="text" defaultValue="Técnico em Informática" disabled />
          </div>

          <div className="form-group span-6">
            <label>Renda Familiar</label>
            <input type="text" defaultValue="2 salários mínimos" disabled />
          </div>
          <div className="form-group span-6">
            <label>Quantidade de Integrantes da casa</label>
            <input type="text" defaultValue="3 pessoas" disabled />
          </div>

          <div className="perf-actions-row">
            <button type="button" className="btn-secondary">Desfazer</button>
            <button type="button" className="btn-primary">Salvar</button>
          </div>
        </form>
      </div>

      {/* Seção 2: Alteração de Senha */}
      <div className="perf-section-card margin-top">
        <h3>Alteração de Senha</h3>
        <form className="perf-form-grid" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group span-6">
            <label>Nova senha:</label>
            <input type="password" placeholder="Digite a nova senha" />
          </div>
          <div className="form-group span-6">
            <label>Confirme sua nova senha:</label>
            <input type="password" placeholder="Digite a senha novamente" />
          </div>

          <div className="perf-actions-row">
            <button type="button" className="btn-secondary">Desfazer</button>
            <button type="button" className="btn-primary-blue">Salvar nova senha</button>
          </div>
        </form>
      </div>
    </div>
  );
}