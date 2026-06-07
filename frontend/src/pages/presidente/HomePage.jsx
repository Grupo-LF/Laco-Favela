import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProgressoCota from '../../components/presidente/ProgressoCota';
import FormulariosCard from '../../components/presidente/FormulariosCard';
import UltimasVisitas from '../../components/presidente/UltimasVisitas';
import '../../styles/pages/presidente/HomePage.css';

function HomePage() {
  const [usuario, setUsuario] = useState({ nome: 'Nome' });
  const [cota, setCota] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await axios.get('http://localhost:8000/api/presidentes/me/home/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
          }
        });
        if (res.data) {
          setUsuario(res.data.usuario);
          setCota(res.data.cota);
          setFormularios(res.data.formularios || []);
          setVisitas(res.data.visitas || []);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da home:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading) return <div className="home-loading">Carregando...</div>;

  return (
    <div className="home-page">
      <h1 className="home-page__saudacao">Olá, {usuario.nome}!</h1>
      <div className="home-page__topo">
        <ProgressoCota
          visitasRealizadas={cota?.visitasRealizadas ?? 18}
          meta={cota?.meta ?? 24}
          diasRestantes={cota?.diasRestantes ?? 20}
          posicaoRanking={cota?.posicaoRanking ?? 3}
        />
        <FormulariosCard formularios={formularios} />
      </div>
      <UltimasVisitas visitas={visitas} />
    </div>
  );
}

export default HomePage;