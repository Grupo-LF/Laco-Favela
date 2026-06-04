import React, { useEffect, useState } from 'react';


function HomePage() {
  const [usuario, setUsuario] = useState({ nome: 'Nome' });
  const [cota, setCota] = useState(null);
  const [formularios, setFormularios] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        // const res = await axios.get('/api/home/');
        // setUsuario(res.data.usuario);
        // setCota(res.data.cota);
        // setFormularios(res.data.formularios);
        // setVisitas(res.data.visitas);
      } catch (err) {
        console.error('Erro ao carregar dados da home:', err);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  if (loading) return <div className="home-loading">Carregando...</div>;

  
}

export default HomePage;