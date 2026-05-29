// src/constants/presidentes.js
export const ESTADO_INICIAL_FORM = {
  nome: '',
  organizacao: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  redes_sociais: '',
  comunidade: '',
  situacao_trabalho: '',
  renda_familiar: '',
  num_membros: '',
  termo_aceito: false,
  cota: '',
};

export const OPCOES_TRABALHO = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
  { value: "empreendedor", label: "Sou empreendedor" }
];

export const OPCOES_RENDA = [
  { value: "menos_um", label: "Menos de um salário mínimo" },
  { value: "um", label: "Um salário mínimo" },
  { value: "um_a_dois", label: "De um a dois salários mínimos" },
  { value: "acima_dois", label: "Acima de dois salários mínimos" }
];

export const OPCOES_MEMBROS = [
  { value: "1", label: "1 integrante" },
  { value: "2", label: "2 integrantes" },
  { value: "3", label: "3 integrantes" },
  { value: "4", label: "4 integrantes" },
  { value: "5", label: "5 integrantes" },
  { value: "6", label: "Acima de 5 integrantes" }
];