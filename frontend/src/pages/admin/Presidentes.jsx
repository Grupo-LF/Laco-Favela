import React, { useState } from 'react';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';
import { usePresidentes } from '../../hooks/usePresidentes';
import { ESTADO_INICIAL_FORM, OPCOES_TRABALHO, OPCOES_RENDA, OPCOES_MEMBROS } from '../../utils/constants/presidentes';

const Presidentes = () => {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL_FORM);
  const [cota, setCota] = useState({ id: '', valor: '' });
  
  const { presidentes, loading, carregando, erros, cadastrar, atualizarCota } = usePresidentes();

  if (loading) return <p>Carregando...</p>;
  
  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    
    if (name === 'telefone') {
      value = mascaraTelefone(value);
    }
    if (name === 'cnpj') {
      value = mascaraCNPJ(value);
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const envioForm = async (event) => {
    event.preventDefault();
    const sucesso = await cadastrar(form, () => setForm(ESTADO_INICIAL_FORM));
    if (sucesso) {
      // Opcional: fechar form após sucesso
    }
  };

  const handleSalvarCota = async () => {
    if (!cota.id || !cota.valor) {
      alert("Selecione um presidente e digite a nova cota.");
      return;
    }
    const sucesso = await atualizarCota(cota.id, cota.valor);
    if (sucesso) {
      setCota({ id: '', valor: '' });
    }
  };

  return (
    <div className="presi">
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Gestão de Presidentes</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Exportar lista</button>
          <button 
            className="btn btn-primary" 
            onClick={() => setMostrarForm(!mostrarForm)}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {mostrarForm ? 'Fechar Formulário' : 'Novo Presidente'}
          </button>
        </div>
      </div>

      <div className="view-section active" style={{ padding: '2rem' }}>
        {mostrarForm && (
          <form onSubmit={envioForm} className="card" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Cadastrar Novo Presidente</h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome:</label>
                <input type="text" name="nome" value={form.nome} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.nome && <span style={{ color: 'red', fontSize: '12px' }}>{erros.nome}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Organização:</label>
                <input type="text" name="organizacao" value={form.organizacao} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.organizacao && <span style={{ color: 'red', fontSize: '12px' }}>{erros.organizacao}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CNPJ:</label>
                <input type="text" name="cnpj" value={form.cnpj} onChange={handleChange} maxLength="18" required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.cnpj && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cnpj}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Endereço:</label>
                <input type="text" name="endereco" value={form.endereco} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.endereco && <span style={{ color: 'red', fontSize: '12px' }}>{erros.endereco}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Telefone:</label>
                <input type="text" name="telefone" value={form.telefone} onChange={handleChange} maxLength="15" required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.telefone && <span style={{ color: 'red', fontSize: '12px' }}>{erros.telefone}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Redes Sociais:</label>
                <input type="text" name="redes_sociais" value={form.redes_sociais} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.redes_sociais && <span style={{ color: 'red', fontSize: '12px' }}>{erros.redes_sociais}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Comunidade:</label>
                <input type="text" name="comunidade" value={form.comunidade} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.comunidade && <span style={{ color: 'red', fontSize: '12px' }}>{erros.comunidade}</span>}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Possui emprego atualmente?</label>
                <select name="situacao_trabalho" value={form.situacao_trabalho} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_TRABALHO.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Renda Familiar:</label>
                <select name="renda_familiar" value={form.renda_familiar} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_RENDA.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Membros da família:</label>
                <select name="num_membros" value={form.num_membros} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="">Selecione...</option>
                  {OPCOES_MEMBROS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cota Inicial:</label>
                <input type="number" name="cota" value={form.cota} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                {erros.cota && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cota}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="checkbox" id="termo_aceito" name="termo_aceito" checked={form.termo_aceito} onChange={handleChange} required />
              <label htmlFor="termo_aceito">Confirmo que o presidente aceitou os termos</label>
              {erros.termo_aceito && <span style={{ color: 'red', fontSize: '12px' }}>{erros.termo_aceito}</span>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={carregando} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {carregando ? 'Salvando...' : 'Salvar Presidente'}
            </button>
          </form>
        )}

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>PRESIDENTE</th>
                <th style={{ padding: '0.75rem' }}>COMUNIDADE</th>
                <th style={{ padding: '0.75rem' }}>COTA</th>
                <th style={{ padding: '0.75rem' }}>AÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {presidentes.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Nenhum presidente cadastrado ainda.</td>
                </tr>
              ) : (
                presidentes.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{p.id}</td>
                    <td style={{ padding: '0.75rem' }}><strong>{p.nome}</strong></td>
                    <td style={{ padding: '0.75rem' }}>{p.comunidade}</td>
                    <td style={{ padding: '0.75rem' }}>{p.cota}</td>
                    <td style={{ padding: '0.75rem' }}><button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', cursor: 'pointer' }}>Editar</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h4>Editar Cota do Presidente</h4>
          <p className="text-sm mb-2" style={{ color: '#666', fontSize: '14px' }}>Defina a meta de famílias para cada presidente</p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <select 
              value={cota.id} 
              onChange={(e) => setCota({ ...cota, id: e.target.value })}
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
            >
              <option value="">Selecione um presidente...</option>
              {presidentes.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            <input 
              type="number" 
              value={cota.valor} 
              onChange={(e) => setCota({ ...cota, valor: e.target.value })}
              placeholder="Ex: 50" 
              style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }} 
            />
            
            <button className="btn btn-primary" onClick={handleSalvarCota} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Salvar cota
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;