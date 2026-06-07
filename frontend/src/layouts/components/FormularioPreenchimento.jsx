// src/components/layout/FormularioPreenchimento.jsx
import React, { useState, useEffect } from 'react';
import FormField from './FormField'; // Supondo que FormField esteja no mesmo diretório
import '../../styles/pages/formularios.css';

const FormularioPreenchimento = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });

  // Carregar dados salvos offline (localStorage)
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Salvar dados no localStorage sempre que houver alteração
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Formulário enviado com sucesso!');
    // Limpar dados após envio
    setFormData({ nome: '', email: '', mensagem: '' });
    localStorage.removeItem('formData');
  };

  return (
    <div className="formulario-container">
      <h2>Formulário de Contato</h2>
      <form onSubmit={handleSubmit} className="formulario-form">
        <FormField
          label="Nome"
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Mensagem"
          type="textarea"
          name="mensagem"
          value={formData.mensagem}
          onChange={handleChange}
          required
        />
        <button type="submit" className="formulario-botao">Enviar</button>
      </form>
    </div>
  );
};

export default FormularioPreenchimento;

// === CSS separado: src/styles/pages/formularios.css ===
// .formulario-container {
//   max-width: 600px;
//   margin: 0 auto;
//   padding: 20px;
//   background-color: #f9f9f9;
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// }
// 
// .formulario-form {
//   display: flex;
//   flex-direction: column;
//   gap: 15px;
// }
// 
// .formulario-botao {
//   padding: 10px 20px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 16px;
// }
// 
// .formulario-botao:hover {
//   background-color: #0056b3;
// }
// 
// @media (max-width: 768px) {
//   .formulario-container {
//     padding: 15px;
//   }
//   .formulario-form {
//     gap: 10px;
//   }
// }
