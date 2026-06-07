import React from 'react';
import '../../../styles/pages/morador/RankingPage.css';

const niveis = [
  { id: 1, titulo: 'Nível 1 - Iniciante', pontos: 'A partir de 0 pontos', atual: false },
  { id: 2, titulo: 'Nível 2 - Participativo', pontos: 'A partir de 30 pontos', atual: false },
  { id: 3, titulo: 'Nível 3 - Engajado', pontos: 'A partir de 60 pontos', atual: true },
  { id: 4, titulo: 'Nível 4 - Liderança', pontos: 'A partir de 80 pontos', atual: false },
  { id: 5, titulo: 'Nível 5 - Referência', pontos: 'A partir de 95 pontos', atual: false },
];

const rankingComunidade = [
  { posicao: 1, nome: 'Nome e Sobrenome', pontos: 97, voce: false },
  { posicao: 2, nome: 'Nome e Sobrenome', pontos: 89, voce: false },
  { posicao: 3, nome: 'Nome e Sobrenome', pontos: 82, voce: false },
  { posicao: 4, nome: 'Nome e Sobrenome', pontos: 74, voce: false },
  { posicao: 5, nome: 'Nome e Sobrenome (você)', pontos: 67, voce: true },
];

const comoGanhar = [
  { acao: 'Participar de reunião', pontos: 10 },
  { acao: 'Enviar feedback', pontos: 5 },
  { acao: 'Comparecer a ação de doações', pontos: 8 },
  { acao: 'Indicar melhorias para a comunidade', pontos: 7 },
];

function RankingPage() {
  return (
    <div className="ranking-page">
      <h1 className="ranking-page__titulo">Ranking</h1>

      <div className="ranking-page__conteudo">
        <div className="ranking-page__esquerda">
          <div className="ranking-nivel-card">
            <div className="ranking-nivel-card__topo">
              <div className="ranking-nivel-card__icone" />
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
            {niveis.map((nivel) => (
              <div key={nivel.id} className={`ranking-niveis__item ${nivel.atual ? 'ranking-niveis__item--atual' : ''}`}>
                <div className="ranking-niveis__item-icone" />
                <div className="ranking-niveis__item-info">
                  <span className="ranking-niveis__item-titulo">{nivel.titulo}</span>
                  <span className="ranking-niveis__item-pontos">{nivel.pontos}</span>
                </div>
                {nivel.atual && <span className="ranking-niveis__item-badge">você está aqui</span>}
              </div>
            ))}
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
            {comoGanhar.map((item, i) => (
              <div key={i} className="ranking-como-ganhar__item">
                <div className="ranking-como-ganhar__icone" />
                <span className="ranking-como-ganhar__acao">{item.acao}</span>
                <span className="ranking-como-ganhar__pts">{item.pontos} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingPage;