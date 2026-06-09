import React, { useEffect, useMemo, useState } from 'react';
import {
  atualizarStatusFamilia,
  listarRespostasPorFamilia,
  obterFamilia,
} from '../../services/api';

const STATUS_OPTIONS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'aprovada', label: 'Aprovada' },
  { value: 'lista_espera', label: 'Lista de espera' },
];

const formatResposta = (item) => {
  if (item.valor_texto) return item.valor_texto;
  if (item.valor_numero !== null && item.valor_numero !== undefined) return item.valor_numero;
  if (item.valor_booleano !== null && item.valor_booleano !== undefined) {
    return item.valor_booleano ? 'Sim' : 'Nao';
  }
  if (item.valor_data) return item.valor_data;
  if (item.opcao && item.opcao.texto) return item.opcao.texto;
  if (item.opcoes && item.opcoes.length > 0) {
    return item.opcoes.map((op) => op.texto).join(', ');
  }
  return '-';
};

const FamiliaDetalhe = ({ familiaId, onNavigate }) => {
  const [familia, setFamilia] = useState(null);
  const [respostas, setRespostas] = useState([]);
  const [statusValue, setStatusValue] = useState('pendente');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totalRespostas = useMemo(() => respostas.length, [respostas]);

  useEffect(() => {
    let isMounted = true;
    const carregar = async () => {
      if (!familiaId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const [familiaData, respostasData] = await Promise.all([
          obterFamilia(familiaId),
          listarRespostasPorFamilia(familiaId),
        ]);
        if (!isMounted) return;
        setFamilia(familiaData);
        setRespostas(respostasData || []);
        setStatusValue(familiaData.status || 'pendente');
      } catch (err) {
        if (!isMounted) return;
        setError('Nao foi possivel carregar os dados da familia.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    carregar();
    return () => {
      isMounted = false;
    };
  }, [familiaId]);

  const salvarStatus = async () => {
    if (!familiaId) return;
    setSaving(true);
    setError('');
    try {
      const atualizado = await atualizarStatusFamilia(familiaId, statusValue);
      setFamilia(atualizado);
    } catch (err) {
      setError('Nao foi possivel atualizar o status.');
    } finally {
      setSaving(false);
    }
  };

  if (!familiaId) {
    return (
      <div className="view-section active">
        <div className="header">
          <button className="btn btn-outline" onClick={() => onNavigate('familias')}>
            ← Voltar
          </button>
          <h2>Detalhe da Familia</h2>
        </div>
        <div className="card">Selecione uma familia na lista para ver o formulario.</div>
      </div>
    );
  }

  return (
    <div className="view-section active">
      <div className="header">
        <button className="btn btn-outline" onClick={() => onNavigate('familias')}>
          ← Voltar
        </button>
        <h2>Detalhe da Familia</h2>
        <div className="flex gap-1">
          <button className="btn btn-primary" onClick={salvarStatus} disabled={saving || loading}>
            {saving ? 'Salvando...' : 'Salvar status'}
          </button>
        </div>
      </div>

      {error && <div className="card" style={{ background: '#ffe0e0' }}>{error}</div>}

      <div className="grid-4" style={{ marginBottom: '1rem' }}>
        <div className="card"><p className="text-sm">Familia</p><h2>{familia ? familia.nome_responsavel : '-'}</h2></div>
        <div className="card"><p className="text-sm">Comunidade</p><h2>{familia ? familia.comunidade : '-'}</h2></div>
        <div className="card"><p className="text-sm">Municipio</p><h2>{familia ? familia.municipio : '-'}</h2></div>
        <div className="card"><p className="text-sm">Respostas</p><h2>{totalRespostas}</h2></div>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div className="flex gap-2 items-center">
          <label className="text-sm">Status</label>
          <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        <h4>Formulario da familia</h4>
        {loading ? (
          <p className="text-sm">Carregando respostas...</p>
        ) : respostas.length === 0 ? (
          <p className="text-sm">Nenhuma resposta encontrada para esta familia.</p>
        ) : (
          respostas.map((resposta) => (
            <div key={resposta.id} style={{ marginBottom: '1.5rem' }}>
              <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
                <h5>Ciclo #{resposta.ciclo}</h5>
                <span className="badge">{resposta.status}</span>
              </div>
              <table>
                <thead>
                  <tr><th>Pergunta</th><th>Resposta</th></tr>
                </thead>
                <tbody>
                  {(resposta.itens || []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.pergunta ? item.pergunta.texto : '-'}</td>
                      <td>{formatResposta(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FamiliaDetalhe;
