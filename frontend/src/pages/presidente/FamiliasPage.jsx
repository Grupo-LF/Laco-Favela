import React, { useState } from 'react';
import FamiliaCard from '../../components/presidente/FamiliaCard';
import FamiliaFiltros from '../../components/presidente/FamiliaFiltros';
import NovaFamiliaModal from '../../components/presidente/NovaFamiliaModal';
import '../../styles/pages/presidente/FamiliasPage.css';

const FAMILIAS_EXEMPLO = [
  { id: 1, nome: 'Família Souza', endereco: 'Rua Santo Laço, 22, Casa Amarela, Alto Santa Isabel, Recife', membros: 4, status: 'Visitada', perfil: 'Mãe solo' },
  { id: 2, nome: 'Família Pereira', endereco: 'Rua da Força, 36, Casa Amarela, Alto Santa Isabel, Recife', membros: 6, status: 'Pendente', perfil: '+3 filhos' },
  { id: 3, nome: 'Família Rodrigues', endereco: 'Rua da Força, 70, Casa Amarela, Alto Santa Isabel, Recife', membros: 3, status: 'Pendente', perfil: 'Renda baixa' },
  { id: 4, nome: 'Família Rocha', endereco: 'Rua União, 54, Casa Amarela, Alto Santa Isabel, Recife', membros: 3, status: 'Visitada', perfil: 'Mãe solo' },
  { id: 5, nome: 'Família Gomes', endereco: 'Rua da Cooperação, 49, Casa Amarela, Alto Santa Isabel, Recife', membros: 2, status: 'Visitada', perfil: 'Geral' },
];

function FamiliasPage() {
  const [familias, setFamilias] = useState(FAMILIAS_EXEMPLO);
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const familiasFiltradas = familias.filter((f) => {
    const buscaOk = f.nome.toLowerCase().includes(busca.toLowerCase());
    const statusOk = status === '' || f.status === status;
    return buscaOk && statusOk;
  });

  function handleCadastrar(novaFamilia) {
    setFamilias([...familias, { ...novaFamilia, id: familias.length + 1, status: 'Pendente' }]);
  }

  return (
    <div className="familias-page">
      <h1 className="familias-page__titulo">Famílias</h1>

      <div className="familias-page__card">
        <div className="familias-page__header">
          <span className="familias-page__subtitulo">
            Lista de Famílias <span className="familias-page__contador">{familiasFiltradas.length}</span>
          </span>
          <button className="familias-page__adicionar" onClick={() => setModalAberto(true)}>
            Adicionar família +
          </button>
        </div>

        <FamiliaFiltros busca={busca} onBusca={setBusca} status={status} onStatus={setStatus} />

        <div className="familias-page__lista">
          {familiasFiltradas.map((f) => (
            <FamiliaCard key={f.id} familia={f} />
          ))}
        </div>
      </div>

      {modalAberto && (
        <NovaFamiliaModal onFechar={() => setModalAberto(false)} onCadastrar={handleCadastrar} />
      )}
    </div>
  );
}

export default FamiliasPage;