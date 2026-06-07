import React, { useState } from 'react';
import '../../styles/pages/presidente/NovaFamiliaModal.css';

const PERFIS = ['Mãe solo', '+3 filhos', 'Renda baixa', 'Geral'];

function NovaFamiliaModal({ onFechar, onCadastrar }) {
  const [form, setForm] = useState({
    nome: '',
    endereco: '',
    membros: '',
    telefone: '',
    perfil: '',
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePerfil(perfil) {
    setForm({ ...form, perfil });
  }

  function handleSubmit() {
    if (!form.nome || !form.endereco) return;
    onCadastrar(form);
    onFechar();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal__header">
          <span className="modal__titulo">Nova Família</span>
          <button className="modal__fechar" onClick={onFechar}>✕</button>
        </div>

        <div className="modal__corpo">
          <label className="modal__label">Nome da Família:</label>
          <input className="modal__input" name="nome" placeholder="Ex.: Família Silveira" value={form.nome} onChange={handleChange} />

          <label className="modal__label">Endereço:</label>
          <input className="modal__input" name="endereco" placeholder="Ex.: Rua Fruta, 26, Goiaba, Comunidade Polpa, Recife" value={form.endereco} onChange={handleChange} />

          <label className="modal__label">Nº de Membros:</label>
          <input className="modal__input" name="membros" placeholder="Ex.: 4" type="number" value={form.membros} onChange={handleChange} />

          <label className="modal__label">Telefone:</label>
          <input className="modal__input" name="telefone" placeholder="Ex.: (11) 00000-0000" value={form.telefone} onChange={handleChange} />

          <label className="modal__label">Perfil</label>
          <div className="modal__perfis">
            {PERFIS.map((p) => (
              <button
                key={p}
                className={`modal__perfil-btn ${form.perfil === p ? 'modal__perfil-btn--ativo' : ''}`}
                onClick={() => handlePerfil(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <button className="modal__cadastrar" onClick={handleSubmit}>
            Cadastrar família
          </button>
        </div>
      </div>
    </div>
  );
}

export default NovaFamiliaModal;