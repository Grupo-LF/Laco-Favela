import React, { useState } from 'react';
import '../../../styles/pages/morador/AcompanhamentoPage.css';

const ciclosExemplo = [
  {
    id: 1,
    titulo: 'Ciclo 1 - Doações',
    periodo: 'Início: 11 de Jun. 2026 - Fim: 28 de Jun. 2026',
    etapas: [
      { id: 1, titulo: 'Cadastro Realizado', descricao: 'Seu cadastro foi registrado pelo Presidente de Rua no sistema', data: '13/06/2026 • 09:30', completo: true },
      { id: 2, titulo: 'Em análise', descricao: 'Dados em verificação pela equipe do G10 Favelas', data: '13/06/2026 • 10:00', completo: true },
      { id: 3, titulo: 'Aprovado', descricao: 'Dados validados com sucesso pela equipe responsável.', data: '15/06/2026 • 09:20', completo: true },
    ]
  },
  {
    id: 2,
    titulo: 'Ciclo 2 - Doações',
    periodo: 'Início: 01 de Jul. 2026',
    etapas: [
      { id: 1, titulo: 'Cadastro Realizado', descricao: 'Seu cadastro foi registrado pelo Presidente de Rua no sistema', data: '03/06/2026 • 10:00', completo: true },
      { id: 2, titulo: 'Em análise', descricao: 'Dados em verificação pela equipe do G10 Favelas', data: '', completo: false },
      { id: 3, titulo: 'Aprovado', descricao: 'Dados validados com sucesso pela equipe responsável.', data: '', completo: false },
    ]
  }
];

const eventosExemplo = [
  { id: 1, titulo: 'Reunião Comunitária', data: '11/06/2026 - 18h no Centro Comunitário de Fitilho' },
  { id: 2, titulo: 'Ação para Crianças', data: '18/06/2026 - 16h na Praça Central Laço' },
];

function AcompanhamentoPage() {
  const [verMais, setVerMais] = useState(false);
  const ciclos = verMais ? ciclosExemplo : ciclosExemplo.slice(0, 1);

  return (
    <div className="acomp-page">
      <div className="acomp-page__header">
        <h1 className="acomp-page__titulo">Acompanhamento</h1>
        <p className="acomp-page__subtitulo">Verifique seus processos aqui</p>
      </div>

      <div className="acomp-page__conteudo">
        <div className="acomp-page__historico">
          <h2 className="acomp-page__historico-titulo">Histórico do Processo</h2>
          {ciclos.map((ciclo) => (
            <div key={ciclo.id} className="acomp-ciclo">
              <h3 className="acomp-ciclo__titulo">{ciclo.titulo}</h3>
              <p className="acomp-ciclo__periodo">{ciclo.periodo}</p>
              <div className="acomp-ciclo__etapas">
                {ciclo.etapas.map((etapa) => (
                  <div key={etapa.id} className="acomp-etapa">
                    <div className={`acomp-etapa__icone ${etapa.completo ? 'acomp-etapa__icone--completo' : ''}`} />
                    <div className="acomp-etapa__info">
                      <span className={`acomp-etapa__titulo ${!etapa.completo ? 'acomp-etapa__titulo--pendente' : ''}`}>{etapa.titulo}</span>
                      <span className={`acomp-etapa__descricao ${!etapa.completo ? 'acomp-etapa__descricao--pendente' : ''}`}>{etapa.descricao}</span>
                      {etapa.data && <span className="acomp-etapa__data">{etapa.data}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="acomp-page__ver-mais" onClick={() => setVerMais(!verMais)}>
            {verMais ? 'Ver menos' : 'Ver mais'}
          </button>
        </div>

        <div className="acomp-page__eventos">
          <h2 className="acomp-page__eventos-titulo">Próximos Eventos</h2>
          {eventosExemplo.map((evento) => (
            <div key={evento.id} className="acomp-evento">
              <span className="acomp-evento__titulo">{evento.titulo}</span>
              <span className="acomp-evento__data">{evento.data}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AcompanhamentoPage;