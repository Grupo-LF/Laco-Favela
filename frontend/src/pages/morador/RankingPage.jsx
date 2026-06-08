import React from 'react';
import '../../styles/pages/morador/RankingPage.css';

const IconIniciante = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const IconParticipativo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconEngajado = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const IconLideranca = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <polyline points="14 14 16 20 12 17 8 20 10 14"/>
  </svg>
);

const IconReferencia = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const IconReuniao = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconFeedback = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconDoacao = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const IconMelhoria = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const niveis = [
  { id: 1, titulo: 'Nível 1 - Iniciante', pontos: 'A partir de 0 pontos', atual: false, icone: IconIniciante },
  { id: 2, titulo: 'Nível 2 - Participativo', pontos: 'A partir de 30 pontos', atual: false, icone: IconParticipativo },
  { id: 3, titulo: 'Nível 3 - Engajado', pontos: 'A partir de 60 pontos', atual: true, icone: IconEngajado },
  { id: 4, titulo: 'Nível 4 - Liderança', pontos: 'A partir de 80 pontos', atual: false, icone: IconLideranca },
  { id: 5, titulo: 'Nível 5 - Referência', pontos: 'A partir de 95 pontos', atual: false, icone: IconReferencia },
];

const rankingComunidade = [
  { posicao: 1, nome: 'Nome e Sobrenome', pontos: 97, voce: false },
  { posicao: 2, nome: 'Nome e Sobrenome', pontos: 89, voce: false },
  { posicao: 3, nome: 'Nome e Sobrenome', pontos: 82, voce: false },
  { posicao: 4, nome: 'Nome e Sobrenome', pontos: 74, voce: false },
  { posicao: 5, nome: 'Nome e Sobrenome (você)', pontos: 67, voce: true },
];

const comoGanhar = [
  { acao: 'Participar de reunião', pontos: 10, icone: IconReuniao },
  { acao: 'Enviar feedback', pontos: 5, icone: IconFeedback },
  { acao: 'Comparecer a ação de doações', pontos: 8, icone: IconDoacao },
  { acao: 'Indicar melhorias para a comunidade', pontos: 7, icone: IconMelhoria },
];

function RankingPage() {
  return (
    <div className="ranking-page">
      <h1 className="ranking-page__titulo">Ranking</h1>

      <div className="ranking-page__conteudo">
        <div className="ranking-page__esquerda">
          <div className="ranking-nivel-card">
            <div className="ranking-nivel-card__topo">
              <div className="ranking-nivel-card__icone">
                <IconEngajado />
              </div>
              <div className="ranking-nivel-card__info">
                <span className="ranking-nivel-card__nivel">Nível 3</span>
                <span className="ranking-nivel-card__nome">Engajado</span>
                <span className="ranking-nivel-card__desc">Você está se destacando na comunidade! Continue assim.</span>
                <div className="ranking-nivel-card__barra-container">
                  <div className="ranking-nivel-card__barra" style={{ width: '67%' }} />
                </div>
                <div className="ranking-nivel-card__pts">
                  <span>67 / 100 pts</span>
                  <span>Próximo nível: 80 pts</span>
                </div>
                <div className="ranking-nivel-card__aviso">+13 pontos para alcançar o Nível 4 - Liderança</div>
              </div>
              <div className="ranking-nivel-card__posicao">
                <span className="ranking-nivel-card__posicao-label">Sua posição</span>
                <span className="ranking-nivel-card__posicao-numero">5º</span>
                <span className="ranking-nivel-card__posicao-total">entre 28 moradores</span>
                <span className="ranking-nivel-card__posicao-variacao">↑ 2 posições em relação à semana passada</span>
              </div>
            </div>
          </div>

          <div className="ranking-niveis">
            <h2 className="ranking-niveis__titulo">Níveis de engajamento</h2>
            {niveis.map((nivel) => {
              const Icone = nivel.icone;
              return (
                <div key={nivel.id} className={`ranking-niveis__item ${nivel.atual ? 'ranking-niveis__item--atual' : ''}`}>
                  <div className={`ranking-niveis__item-icone ${nivel.atual ? 'ranking-niveis__item-icone--atual' : ''}`}>
                    <Icone />
                  </div>
                  <div className="ranking-niveis__item-info">
                    <span className="ranking-niveis__item-titulo">{nivel.titulo}</span>
                    <span className="ranking-niveis__item-pontos">{nivel.pontos}</span>
                  </div>
                  {nivel.atual && <span className="ranking-niveis__item-badge">você está aqui</span>}
                </div>
              );
            })}
            <p className="ranking-niveis__rodape">Cada nível representa mais impacto real na comunidade.</p>
          </div>
        </div>

        <div className="ranking-page__direita">
          <div className="ranking-comunidade">
            <h2 className="ranking-comunidade__titulo">Ranking da comunidade</h2>
            {rankingComunidade.map((item) => (
              <div key={item.posicao} className={`ranking-comunidade__item ${item.voce ? 'ranking-comunidade__item--voce' : ''}`}>
                <span className="ranking-comunidade__posicao">{item.posicao}º</span>
                <div className="ranking-comunidade__avatar">NS</div>
                <span className="ranking-comunidade__nome">{item.nome}</span>
                <span className="ranking-comunidade__pontos">{item.pontos} pts</span>
              </div>
            ))}
          </div>

          <div className="ranking-como-ganhar">
            <h2 className="ranking-como-ganhar__titulo">Como ganhar pontos</h2>
            <p className="ranking-como-ganhar__desc">Participe ativamente e suba no ranking!</p>
            {comoGanhar.map((item, i) => {
              const Icone = item.icone;
              return (
                <div key={i} className="ranking-como-ganhar__item">
                  <div className="ranking-como-ganhar__icone"><Icone /></div>
                  <span className="ranking-como-ganhar__acao">{item.acao}</span>
                  <span className="ranking-como-ganhar__pts">{item.pontos} pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingPage;