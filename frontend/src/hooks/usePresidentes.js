// hooks/usePresidentes.js
import { useState, useEffect } from 'react';
import { listarPresidentes, cadastrarPresidente, atualizarCotaPresidente } from '../services/api';

export const usePresidentes = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  const carregarPresidentes = async () => {
    try {
      const resposta = await listarPresidentes();
      setPresidentes(resposta.data || resposta);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const cadastrar = async (dadosForm, resetarForm) => {
    setCarregando(true);
    setErros({});
    try {
      await cadastrarPresidente(dadosForm);
      alert("Presidente cadastrado com sucesso!");
      resetarForm();
      await carregarPresidentes();
      return true;
    } catch (erro) {
      try {
        const mensagensErro = JSON.parse(erro.message);
        setErros(mensagensErro);
      } catch {
        alert("Erro inesperado de conexão ao cadastrar.");
      }
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const atualizarCota = async (id, valor) => {
    try {
      await atualizarCotaPresidente(id, valor);
      alert("Cota atualizada com sucesso!");
      await carregarPresidentes();
      return true;
    } catch (erro) {
      alert("Erro ao atualizar cota.");
      return false;
    }
  };

  useEffect(() => {
    carregarPresidentes();
  }, []);

  return { presidentes, loading, carregando, erros, cadastrar, atualizarCota };
};