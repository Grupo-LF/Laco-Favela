import React, { useEffect, useState } from 'react';
import { cadastrarPresidente, listarPresidentes, atualizarCotaPresidente } from '../../services/api';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';

const Presidentes = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});
  const [idPresidenteCota, setIdPresidenteCota] = useState('');
  const [valorCota, setValorCota] = useState('');

  // Estado inicial do formulário limpo
  const estadoInicialForm = {
    nome: '',
    organizacao: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    redes_sociais: '',
    comunidade: '',
    situacao_trabalho: '',
    renda_familiar: '',
    num_membros: '',
    termo_aceito: false,
    cota: '',
  };
<<<<<<< HEAD

  // CORREÇÃO 1: Criado o estado 'dadosForm' que estava faltando
  const [dadosForm, setDadosForm] = useState(estadoInicialForm);

  // CORREÇÃO 2: Criada a função 'carregarPresidentes'
  const carregarPresidentes = async () => {
    try {
      const data = await listarPresidentes();
      setPresidentes(data);
    } catch (err) {
      console.error("Erro ao carregar presidentes:", err);
    } finally {
=======
  
  const [dadosForm, setDadosForm] = useState(estadoInicialForm);

  // Função para carregar presidentes
  const carregarPresidentes = async () => {
    try {
      const resposta = await listarPresidentes();
      setPresidentes(resposta.data || resposta);
      setLoading(false);
    } catch (err) {
      console.error(err);
>>>>>>> 21f7778dc09838d86cfa93b39919764d5b0a20f7
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // CORREÇÃO 3: Usando a função carregarPresidentes no useEffect em vez de api.get
=======
>>>>>>> 21f7778dc09838d86cfa93b39919764d5b0a20f7
  useEffect(() => {
    carregarPresidentes();
  }, []);

  if (loading) return <p>Carregando...</p>;

  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;

    if (name === 'telefone') {
      value = mascaraTelefone(value);
    }
    if (name === 'cnpj') {
      value = mascaraCNPJ(value);
    }

<<<<<<< HEAD
    // CORREÇÃO 4: Substituído 'criarDadosForm' por 'setDadosForm'
=======
>>>>>>> 21f7778dc09838d86cfa93b39919764d5b0a20f7
    setDadosForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (erros[name]) {
      setErros((errosAnteriores) => ({ ...errosAnteriores, [name]: null }));
    }
  };

  const envioForm = async (event) => {
    event.preventDefault();
    setCarregando(true);
    setErros({});

    try {
      const resposta = await cadastrarPresidente(dadosForm);
      console.log("Presidente cadastrado com sucesso!", resposta);
      alert("Presidente cadastrado com sucesso!");

<<<<<<< HEAD
      // CORREÇÃO 4: Substituído 'criarDadosForm' por 'setDadosForm'
      setDadosForm(estadoInicialForm);

=======
      // Reseta o formulário para o estado inicial limpo
      setDadosForm(estadoInicialForm);
      
>>>>>>> 21f7778dc09838d86cfa93b39919764d5b0a20f7
      // Atualiza a tabela imediatamente após salvar
      carregarPresidentes();
    } catch (erro) {
      try {
        const mensagensErro = JSON.parse(erro.message);
        setErros(mensagensErro);
      } catch {
        alert("Erro inesperado de conexão ao cadastrar.");
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarCota = async () => {
    if (!idPresidenteCota || !valorCota) {
      alert("Selecione um presidente e digite a nova cota.");
      return;
    }
    try {
      await atualizarCotaPresidente(idPresidenteCota, valorCota);
      alert("Cota atualizada com sucesso!");
      carregarPresidentes();
      setValorCota('');
      setIdPresidenteCota('');
    } catch (erro) {
      alert("Erro ao atualizar cota.");
    }
  };

  return (
    <div className="view-section active" style={{ padding: '2rem' }}>
      
      {/* SEÇÃO DO TOPO COM BOTÃO DE EXIBIR/OCULTAR */}
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

      {/* FORMULÁRIO DE CADASTRO */}
      {mostrarForm && (
        <form onSubmit={envioForm} className="card" style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h4 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Cadastrar Novo Presidente</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome:</label>
              <input type="text" name="nome" value={dadosForm.nome} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.nome && <span style={{ color: 'red', fontSize: '12px' }}>{erros.nome}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Organização:</label>
              <input type="text" name="organizacao" value={dadosForm.organizacao} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.organizacao && <span style={{ color: 'red', fontSize: '12px' }}>{erros.organizacao}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CNPJ:</label>
              <input type="text" name="cnpj" value={dadosForm.cnpj} onChange={handleChange} maxLength="18" required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.cnpj && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cnpj}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Endereço:</label>
              <input type="text" name="endereco" value={dadosForm.endereco} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.endereco && <span style={{ color: 'red', fontSize: '12px' }}>{erros.endereco}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Telefone:</label>
              <input type="text" name="telefone" value={dadosForm.telefone} onChange={handleChange} maxLength="15" required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.telefone && <span style={{ color: 'red', fontSize: '12px' }}>{erros.telefone}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Redes Sociais:</label>
              <input type="text" name="redes_sociais" value={dadosForm.redes_sociais} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.redes_sociais && <span style={{ color: 'red', fontSize: '12px' }}>{erros.redes_sociais}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Comunidade:</label>
              <input type="text" name="comunidade" value={dadosForm.comunidade} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.comunidade && <span style={{ color: 'red', fontSize: '12px' }}>{erros.comunidade}</span>}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Possui emprego atualmente?</label>
              <select name="situacao_trabalho" value={dadosForm.situacao_trabalho} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="empreendedor">Sou empreendedor</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Renda Familiar:</label>
              <select name="renda_familiar" value={dadosForm.renda_familiar} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">Selecione...</option>
                <option value="menos_um">Menos de um salário mínimo</option>
                <option value="um">Um salário mínimo</option>
                <option value="um_a_dois">De um a dois salários mínimos</option>
                <option value="acima_dois">Acima de dois salários mínimos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Membros da família:</label>
              <select name="num_membros" value={dadosForm.num_membros} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="">Selecione...</option>
                <option value="1">1 integrante</option>
                <option value="2">2 integrantes</option>
                <option value="3">3 integrantes</option>
                <option value="4">4 integrantes</option>
                <option value="5">5 integrantes</option>
                <option value="6">Acima de 5 integrantes</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cota Inicial:</label>
              <input type="number" name="cota" value={dadosForm.cota} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              {erros.cota && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cota}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input type="checkbox" id="termo_aceito" name="termo_aceito" checked={dadosForm.termo_aceito} onChange={handleChange} required />
            <label htmlFor="termo_aceito">Confirmo que o presidente aceitou os termos</label>
            {erros.termo_aceito && <span style={{ color: 'red', fontSize: '12px' }}>{erros.termo_aceito}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {carregando ? 'Salvando...' : 'Salvar Presidente'}
          </button>
        </form>
      )}

      {/* TABELA DE VISUALIZAÇÃO */}
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

      {/* FORMULÁRIO DE EDITAR COTA */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h4>Editar Cota do Presidente</h4>
        <p className="text-sm mb-2" style={{ color: '#666', fontSize: '14px' }}>Defina a meta de famílias para cada presidente</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          
          <select 
            value={idPresidenteCota} 
            onChange={(e) => setIdPresidenteCota(e.target.value)}
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
          >
            <option value="">Selecione um presidente...</option>
            {presidentes.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <input 
            type="number" 
            value={valorCota} 
            onChange={(e) => setValorCota(e.target.value)}
            placeholder="Ex: 50" 
            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }} 
          />
          
          <button className="btn btn-primary" onClick={handleSalvarCota} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#4A4A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Salvar cota
          </button>
        </div>
      </div>
    </div>
  );
};

export default Presidentes;