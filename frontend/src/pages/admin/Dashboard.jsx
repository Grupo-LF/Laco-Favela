import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  // Dados do gráfico de barras
  const dadosParticipacoes = [
    { mes: 'Jan', familias: 120, eventos: 45 },
    { mes: 'Fev', familias: 150, eventos: 60 },
    { mes: 'Mar', familias: 180, eventos: 75 },
    { mes: 'Abr', familias: 220, eventos: 90 },
    { mes: 'Mai', familias: 260, eventos: 110 },
  ];

  // Dados do gráfico de pizza
  const dadosPerfis = [
    { name: 'Mães solo', value: 89, color: '#FF6B6B' },
    { name: '+3 filhos', value: 67, color: '#4ECDC4' },
    { name: 'Renda baixa', value: 45, color: '#45B7D1' },
    { name: 'Idosos', value: 23, color: '#96CEB4' },
  ];

  // Dados do Ranking de Presidentes (Top 5)
  const rankingPresidentes = [
    { posicao: 1, nome: 'Nome 1', visitas: 48 },
    { posicao: 2, nome: 'Nome 2', visitas: 45 },
    { posicao: 3, nome: 'Nome 3', visitas: 40 },
    { posicao: 4, nome: 'Nome 4', visitas: 35 },
    { posicao: 5, nome: 'Nome 5', visitas: 30 },
  ];

  // Dados do Status de Cotas
  const statusCotas = [
    { nome: 'Nome e sobrenome', atual: 48, meta: 50, percentual: 96 },
    { nome: 'Nome e sobrenome', atual: 45, meta: 50, percentual: 90 },
    { nome: 'Nome e sobrenome', atual: 50, meta: 50, percentual: 100 },
    { nome: 'Nome e sobrenome', atual: 31, meta: 50, percentual: 62 },
    { nome: 'Nome e sobrenome', atual: 22, meta: 50, percentual: 44 },
  ];

  return (
    <div className="view-section active">
      <div className="header">
        <div>
          <h2>Dashboard Analítico</h2>
          <p className="text-sm">Ciclo 1 - Mês 6</p>
        </div>
        <div className="flex gap-1">
          <button className="btn btn-outline">Exportar</button>
          <button className="btn btn-primary">Novo ciclo</button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid-4">
        <div className="card">
          <p className="text-sm">FAMÍLIAS CADASTRADAS</p>
          <h1 style={{ fontSize: '2.5rem' }}>487</h1>
          <p className="text-sm">+30 famílias neste ciclo</p>
        </div>
        <div className="card">
          <p className="text-sm">PRESIDENTES ATIVOS</p>
          <h1 style={{ fontSize: '2.5rem' }}>12</h1>
          <p className="text-sm">Meta: 12</p>
        </div>
        <div className="card">
          <p className="text-sm">APROVAÇÕES PENDENTES</p>
          <h1 style={{ fontSize: '2.5rem' }}>48</h1>
          <p className="text-sm">10% do total</p>
        </div>
        <div className="card">
          <p className="text-sm">FEEDBACKS PENDENTES</p>
          <h1 style={{ fontSize: '2.5rem' }}>5</h1>
          <p className="text-sm">Requer atenção</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid-2">
        {/* Gráfico de Barras */}
        <div className="card">
          <div className="flex justify-between items-center">
            <h3>Participações por Mês</h3>
            <span className="badge">Último ciclo</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosParticipacoes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="familias" fill="#8884d8" name="Famílias" />
              <Bar dataKey="eventos" fill="#82ca9d" name="Eventos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza */}
        <div className="card flex-col items-center">
          <h3 style={{ alignSelf: 'flex-start' }}>Distribuição por Perfil</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosPerfis}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPerfis.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking de Presidentes e Status de Cotas */}
      <div className="grid-2">
        {/* Ranking de Presidentes - Top 5 */}
        <div className="card" >
          <h3 style={{display: 'flex'} }>Ranking de Presidentes</h3>
          <div className="ranking-header" style={{ fontWeight: 'bold', marginTop: '1rem', marginBottom: '1rem' }}>
            Top 5
          </div>
          <table style={{ width: '100%' }}>
            <tbody>
              {rankingPresidentes.map(presidente => (
                <tr key={presidente.posicao}>
                  <td style={{ padding: '8px 0', fontWeight: '500' }}>
                    {presidente.nome}
                  </td>
                  <td style={{ padding: '8px 0', textAlign: 'right' }}>
                    {presidente.visitas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status de Cotas */}
        <div className="card">
          <h3>Status de Cotas</h3>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
            Progresso por presidente
          </div>
          
          {statusCotas.map((item, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: '500' }}>{item.nome}</span>
                <span>{item.atual}/{item.meta}</span>
              </div>
              <div style={{ 
                background: '#e0e0e0', 
                borderRadius: '10px', 
                height: '8px', 
                overflow: 'hidden' 
              }}>
                <div style={{ 
                  background: '#2f2f2f', 
                  height: '100%', 
                  width: `${item.percentual}%`,
                  transition: 'width 0.3s',
                  borderRadius: '10px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;