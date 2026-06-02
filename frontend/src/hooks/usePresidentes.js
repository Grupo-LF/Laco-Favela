// hooks/usePresidentes.js
import { useState, useEffect } from 'react';
import { listarPresidentes, cadastrarPresidente, atualizarCotaPresidente } from '../services/presidente'; // ← CORRIGIDO

export const usePresidentes = () => {
  const [presidentes, setPresidentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState({});

  const carregarPresidentes = async () => {
    setLoading(true);
    try {
      const resposta = await listarPresidentes();
      // Se já é o array (axios já retorna data diretamente)
      setPresidentes(Array.isArray(resposta) ? resposta : resposta.results || []);
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err);
      setErros({ carregar: err.message });
    } finally {
      setLoading(false);
    }
  };

  const cadastrar = async (dadosForm, resetarForm) => {
    setCarregando(true);
    setErros({});
    try {
      await cadastrarPresidente(dadosForm);
      alert("Presidente cadastrado com sucesso!");
      if (resetarForm) resetarForm();
      await carregarPresidentes(); // Recarrega a lista
      return true;
    } catch (erro) {
      console.error('Erro ao cadastrar:', erro);
      
      // Trata erros da API
      if (erro.response?.data) {
        setErros(erro.response.data);
      } else if (erro.message) {
        try {
          const mensagensErro = JSON.parse(erro.message);
          setErros(mensagensErro);
        } catch {
          setErros({ geral: erro.message });
        }
      } else {
        alert("Erro inesperado ao cadastrar.");
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
      await carregarPresidentes(); // Recarrega a lista
      return true;
    } catch (erro) {
      console.error('Erro ao atualizar cota:', erro);
      alert("Erro ao atualizar cota.");
      return false;
    }
  };

  useEffect(() => {
    carregarPresidentes();
  }, []);

  return { 
    presidentes, 
    loading, 
    carregando, 
    erros, 
    cadastrar, 
    atualizarCota,
    recarregar: carregarPresidentes // Opcional: expõe função para recarregar manualmente
  };
};