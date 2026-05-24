import React, { useState, useEffect } from 'react';
import { cadastrarPresidente } from '../../services/api';
import api from '../../services/api';
import { mascaraTelefone, mascaraCNPJ } from '../../utils/masks';

const Presidentes = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/presidentes/')
      .then(res => {
        setPresidentes(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  const [mostrarForm, setMostrarForm] = useState(false);
  
  const [carregando, setCarregando] = useState(false);
  
  const [erros, setErros] = useState({});
  
  const [dadosForm, criarDadosForm] = useState({
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
  })
  
  if (loading) return <p>Carregando...</p>;
  
  const handleChange = (event) => {
    let { name, value, type, checked } = event.target;
    
    if (name === 'telefone') {
      value = mascaraTelefone(value);
    }
    if (name === 'cnpj') {
      value = mascaraCNPJ(value);
    }

    criarDadosForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (erros[name]) {
      setErros((errosAnteriores) => ({
        ...errosAnteriores,
        [name]: null
      }));
    }
  };

  const envioForm = async (event) => {
    event.preventDefault()
    setCarregando(true);
    setErros({})

    try {
      const resposta = await cadastrarPresidente(dadosForm);
      console.log("Presidente cadastrado com sucesso!", resposta);
      alert("Presidente cadastrado com sucesso!");

      criarDadosForm({
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
      });

    } catch (erro) {
      try {
        const mensagensErro = JSON.parse(erro.message);
        setErros(mensagensErro);
      } catch {
        alert("Erro inesperado de conexão.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="view-section active">
      <div className="header">
        <h2>Presidentes</h2>
        <div className="flex gap-1">
          <button className="btn btn-outline">Exportar lista</button>
          <button className="btn btn-primary" onClick={() => setMostrarForm(!mostrarForm)}>Novo presidente</button>
        </div>
      </div>

      {mostrarForm && (
        <form onSubmit={envioForm} className="card" style={{ marginTop: '1rem' }}>
          <h4>Cadastrar Novo Presidente</h4>

          <div className="grid-3">
            <div>
              <label>Nome:</label>
              <input
                type="text"
                name="nome"
                value={dadosForm.nome}
                onChange={handleChange}
                required
              />
              {erros.nome && <span style={{ color: 'red', fontSize: '12px' }}>{erros.nome}</span>}
            </div>

            <div>
              <label>Organização:</label>
              <input
                type="text"
                name="organizacao"
                value={dadosForm.organizacao}
                onChange={handleChange}
                required
              />
              {erros.organizacao && <span style={{ color: 'red', fontSize: '12px' }}>{erros.organizacao}</span>}
            </div>

            <div>
              <label>CNPJ:</label>
              <input
                type="text"
                name="cnpj"
                value={dadosForm.cnpj}
                onChange={handleChange}
                maxLength="18"
                required
              />
              {erros.cnpj && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cnpj}</span>}
            </div>

            <div>
              <label>Endereço:</label>
              <input
                type="text"
                name="endereco"
                value={dadosForm.endereco}
                onChange={handleChange}
                required
              />
              {erros.endereco && <span style={{ color: 'red', fontSize: '12px' }}>{erros.endereco}</span>}
            </div>

            <div>
              <label>Telefone:</label>
              <input
                type="text"
                name="telefone"
                value={dadosForm.telefone}
                onChange={handleChange}
                maxLength="15"
                required
              />
              {erros.telefone && <span style={{ color: 'red', fontSize: '12px' }}>{erros.telefone}</span>}
            </div>

            <div>
              <label>Redes Sociais:</label>
              <input
                type="text"
                name="redes_sociais"
                value={dadosForm.redes_sociais}
                onChange={handleChange}
                required
              />
              {erros.redes_sociais && <span style={{ color: 'red', fontSize: '12px' }}>{erros.redes_sociais}</span>}
            </div>

            <div>
              <label>Comunidade:</label>
              <input
                type="text"
                name="comunidade"
                value={dadosForm.comunidade}
                onChange={handleChange}
                required
              />
              {erros.comunidade && <span style={{ color: 'red', fontSize: '12px' }}>{erros.comunidade}</span>}
            </div>

            <div>
              <label>Possui emprego atualmente?</label>
              <select
                name="situacao_trabalho"
                value={dadosForm.situacao_trabalho}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="empreendedor">Sou empreendedor</option>
              </select>
              {erros.situacao_trabalho && <span style={{ color: 'red', fontSize: '12px' }}>{erros.situacao_trabalho}</span>}
            </div>

            <div>
              <label>Renda Familiar:</label>
              <select
                name="renda_familiar"
                value={dadosForm.renda_familiar}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="menos_um">Menos de um salário mínimo</option>
                <option value="um">Um salário mínimo</option>
                <option value="um_a_dois">De um a dois salários mínimos</option>
                <option value="acima_dois">Acima de dois salários mínimos</option>
              </select>
              {erros.renda_familiar && <span style={{ color: 'red', fontSize: '12px' }}>{erros.renda_familiar}</span>}
            </div>

            <div>
              <label>Número de membros da família:</label>
              <select
                name="num_membros"
                value={dadosForm.num_membros}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="1">1 integrante</option>
                <option value="2">2 integrantes</option>
                <option value="3">3 integrantes</option>
                <option value="4">4 integrantes</option>
                <option value="5">5 integrantes</option>
                <option value="6">Acima de 5 integrantes</option>
              </select>
              {erros.num_membros && <span style={{ color: 'red', fontSize: '12px' }}>{erros.num_membros}</span>}
            </div>

            <div>
              <label>Cota:</label>
              <input
                type="number"
                name="cota"
                value={dadosForm.cota}
                onChange={handleChange}
                required
              />
              {erros.cota && <span style={{ color: 'red', fontSize: '12px' }}>{erros.cota}</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 3', marginTop: '0.5rem' }}>
              <label >Confirmo que o presidente aceitou os termos</label>
              <input
                type="checkbox"
                id="termo_aceito"
                name="termo_aceito"
                checked={dadosForm.termo_aceito}
                onChange={handleChange}
                required
              />
              {erros.termo_aceito && <span style={{ color: 'red', fontSize: '12px' }}>{erros.termo_aceito}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : 'Salvar Presidente'}
          </button>
        </form>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Nome</th><th>Comunidade</th><th>Cota</th><th>Status</th><th>Ação</th></tr>
          </thead>
          <tbody>
            {presidentes.map(p => (
              <tr key={p.id}>
                <td><strong>{p.nome}</strong></td>
                <td>{p.comunidade}</td>
                <td>{p.cota}</td>
                <td><span className="badge">{p.ativo ? 'Ativo' : 'Inativo'}</span></td>
                <td><button className="btn btn-outline">Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Presidentes;