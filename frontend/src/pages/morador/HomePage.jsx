import React, { useEffect, useState } from 'react';

/* ── Ícone do protótipo: quadrado preto com diagonal branca ── */
function ProtoIcon({ size = 33 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="black"/>
      <line x1="0.707107" y1="0.7072" x2="31.7374" y2="31.7375" stroke="white" strokeWidth="2"/>
    </svg>
  );
}

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