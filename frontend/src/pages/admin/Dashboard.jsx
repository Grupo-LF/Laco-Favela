import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as AddIcon } from '../../assets/addBtn.svg';
import { ReactComponent as ExportIcon } from '../../assets/file_export.svg';
import ApexCharts from 'apexcharts';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const Dashboard = () => {
  // ========== ESTADOS ==========
  const [statusCotas, setStatusCotas] = useState([]);
  const [cicloTitulo, setCicloTitulo] = useState('Carregando ciclo...');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // ========== DADOS ==========
  const dadosParticipacoes = [
    { mes: 'Janeiro', familias: 320, eventos: 85 },
    { mes: 'Fevereiro', familias: 260, eventos: 85 },
    { mes: 'Março', familias: 320, eventos: 90 },
    { mes: 'Abril', familias: 300, eventos: 85 },
  ];

  // ========== FUNÇÃO PARA MOSTRAR NOTIFICAÇÃO ==========
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // ========== CONFIGURAÇÃO DOS GRÁFICOS APEX ==========
  const barChartOptions = {
    series: [
      {
        name: 'Famílias presentes',
        data: dadosParticipacoes.map(item => item.familias),
        color: '#005E94'
      },
      {
        name: 'Eventos',
        data: dadosParticipacoes.map(item => item.eventos),
        color: '#F5A623'
      }
    ],
    chart: {
      type: 'bar',
      height: 300,
      toolbar: { show: false },
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: 'end',
        horizontal: false,
        columnWidth: '60%',
        barGap: '20%',
        distributed: false,
      }
    },
    dataLabels: { enabled: false },
    grid: {
      show: true,
      borderColor: '#d9d9d9',
      strokeDashArray: 0,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true, color: '#d9d9d9' } }
    },
    xaxis: {
      categories: dadosParticipacoes.map(item => item.mes),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: true, style: { fontSize: '14px', fontWeight: 500 } }
    },
    yaxis: { show: true, labels: { show: true }, title: { text: '' } },
    tooltip: { enabled: true, shared: true, intersect: false, y: { formatter: (val) => `${val}` } },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: { radius: 12, width: 12, height: 12 },
      itemMargin: { horizontal: 15, vertical: 0 }
    },
    title: { text: undefined },
    colors: ['#005E94', '#F5A623']
  };

  const donutOptions = {
    series: [44, 55, 13, 33],
    chart: {
      type: 'donut',
      height: 300,
      toolbar: { show: false },
      responsive: [{
        breakpoint: 768,
        options: { chart: { height: 250 } }
      }]
    },
    labels: ['Mães solo', '+3 filhos', 'Renda baixa', 'Idosos'],
    colors: ['#035A8F', '#599DC7', '#297CAE', '#026FB2'],
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '12px' },
    plotOptions: { pie: { donut: { size: "45%" } } }
  };

  const rankingOptions = {
    series: [{ name: 'Visitas', data: [48, 45, 40, 35, 30] }],
    colors: ["var(--color-primary)", "var(--color-primary)", "var(--color-primary)", "var(--color-accent)", "var(--color-accent)"],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      responsive: [{ breakpoint: 768, options: { chart: { height: 280 } } }]
    },
    tooltip: { enabled: false },
    plotOptions: {
      bar: {
        barHeight: "50%",
        borderRadius: 10,
        horizontal: true,
        borderRadiusApplication: 'end',
        distributed: true,
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: { enabled: true, formatter: (val) => `${val}`, offsetX: 10, style: { fontSize: '12px', fontWeight: 'bold' } },
    legend: { show: false },
    grid: { show: true, xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    xaxis: {
      categories: ['André', 'Maria', 'Ana', 'Felipe', 'João'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false }
    },
    yaxis: { show: true, labels: { show: true, style: { fontSize: '14px', fontWeight: 'bold' } } },
    title: { text: 'Ranking de Presidentes', align: 'left', style: { fontSize: '18px', fontWeight: 'bold' } }
  };

  // ========== REFERÊNCIAS ==========
  const barChartRef = useRef(null);
  const donutRef = useRef(null);
  const rankingRef = useRef(null);
  const barChartInstance = useRef(null);
  const donutChartInstance = useRef(null);
  const rankingChartInstance = useRef(null);

  // ========== FUNÇÃO PARA EXPORTAR PDF ==========
  const exportToPDF = async () => {
    setExporting(true);
    setShowMenu(false);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // CABEÇALHO
      pdf.setFontSize(18);
      pdf.setTextColor(0, 94, 148);
      pdf.text('Painel Analitico - Dashboard', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      pdf.setFontSize(11);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Data de exportacao: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPosition, { align: 'center' });
      pdf.text(`Ciclo: ${cicloTitulo}`, pageWidth / 2, yPosition + 6, { align: 'center' });
      
      yPosition += 20;
      
      // CARDS (Métricas)
      const cards = [
        { titulo: 'FAMILIAS CADASTRADAS', valor: '487', subtitulo: '+30 familias neste ciclo' },
        { titulo: 'PRESIDENTES ATIVOS', valor: '12', subtitulo: 'Meta: 12' },
        { titulo: 'APROVACOES PENDENTES', valor: '48', subtitulo: '10% do total' },
        { titulo: 'FEEDBACKS PENDENTES', valor: '5', subtitulo: 'Requer atencao' }
      ];
      
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Resumo das Metricas', 20, yPosition);
      yPosition += 10;
      
      const metricsData = cards.map(card => [card.titulo, card.valor, card.subtitulo]);
      const metricsHeaders = [['Metrica', 'Valor', 'Variacao/Observacao']];
      
      autoTable(pdf, {
        head: metricsHeaders,
        body: metricsData,
        startY: yPosition,
        margin: { left: 20, right: 20 },
        theme: 'grid',
        headStyles: { fillColor: [0, 94, 148], textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 70 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 70 }
        }
      });
      
      yPosition = pdf.lastAutoTable.finalY + 15;
      
      // GRÁFICO 1: Participações por Mês
      if (barChartInstance.current) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.setTextColor(0, 0, 0);
        pdf.text('1. Participacoes por Mes', 20, yPosition);
        yPosition += 10;
        
        try {
          const dataUrl = await barChartInstance.current.dataURI({ scale: 2, backgroundColor: '#ffffff' });
          const imgWidth = 170;
          const imgHeight = 80;
          pdf.addImage(dataUrl.imgURI, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
          
          const participacoesData = dadosParticipacoes.map(item => [item.mes, item.familias, item.eventos]);
          autoTable(pdf, {
            head: [['Mes', 'Familias presentes', 'Eventos']],
            body: participacoesData,
            startY: yPosition,
            margin: { left: 20, right: 20 },
            theme: 'striped',
            headStyles: { fillColor: [245, 166, 35], textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
          });
          yPosition = pdf.lastAutoTable.finalY + 15;
        } catch (error) {
          console.error('Erro ao adicionar grafico de barras:', error);
        }
      }
      
      // GRÁFICO 2: Distribuição por Perfil
      if (donutChartInstance.current) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.text('2. Distribuicao por Perfil', 20, yPosition);
        yPosition += 10;
        
        try {
          const dataUrl = await donutChartInstance.current.dataURI({ scale: 2, backgroundColor: '#ffffff' });
          const imgWidth = 170;
          const imgHeight = 80;
          pdf.addImage(dataUrl.imgURI, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
          
          const donutData = [
            ['Maes solo', '44'],
            ['+3 filhos', '55'],
            ['Renda baixa', '13'],
            ['Idosos', '33']
          ];
          autoTable(pdf, {
            head: [['Perfil', 'Quantidade']],
            body: donutData,
            startY: yPosition,
            margin: { left: 20, right: 20 },
            theme: 'striped',
            headStyles: { fillColor: [3, 90, 143], textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
          });
          yPosition = pdf.lastAutoTable.finalY + 15;
        } catch (error) {
          console.error('Erro ao adicionar grafico donut:', error);
        }
      }
      
      // GRÁFICO 3: Ranking de Presidentes
      if (rankingChartInstance.current) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.text('3. Ranking de Presidentes', 20, yPosition);
        yPosition += 10;
        
        try {
          const dataUrl = await rankingChartInstance.current.dataURI({ scale: 2, backgroundColor: '#ffffff' });
          const imgWidth = 170;
          const imgHeight = 80;
          pdf.addImage(dataUrl.imgURI, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
          
          const rankingData = [
            ['Andre', '48 visitas'],
            ['Maria', '45 visitas'],
            ['Ana', '40 visitas'],
            ['Felipe', '35 visitas'],
            ['Joao', '30 visitas']
          ];
          autoTable(pdf, {
            head: [['Presidente', 'Visitas']],
            body: rankingData,
            startY: yPosition,
            margin: { left: 20, right: 20 },
            theme: 'striped',
            headStyles: { fillColor: [0, 94, 148], textColor: 255, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
          });
          yPosition = pdf.lastAutoTable.finalY + 15;
        } catch (error) {
          console.error('Erro ao adicionar grafico de ranking:', error);
        }
      }
      
      // STATUS DE COTAS
      if (statusCotas.length > 0) {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(14);
        pdf.text('4. Status de Cotas por Presidente', 20, yPosition);
        yPosition += 5;
        
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Progresso detalhado - ${cicloTitulo}`, 20, yPosition);
        yPosition += 10;
        
        const cotasData = statusCotas.map(item => [
          item.nome,
          item.atual,
          item.meta,
          `${item.percentual}%`
        ]);
        
        autoTable(pdf, {
          head: [['Presidente', 'Atual', 'Meta', 'Percentual']],
          body: cotasData,
          startY: yPosition,
          margin: { left: 20, right: 20 },
          theme: 'grid',
          headStyles: { fillColor: [0, 94, 148], textColor: 255, fontSize: 10 },
          bodyStyles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' }
          }
        });
        
        yPosition = pdf.lastAutoTable.finalY + 15;
        
        // Adicionar gráfico de barras do status de cotas
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(12);
        pdf.text('Progresso Individual por Presidente', 20, yPosition);
        yPosition += 10;
        
        statusCotas.forEach((item) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${item.nome}: ${item.percentual}% (${item.atual}/${item.meta})`, 20, yPosition);
          
          const barWidth = 160;
          const barHeight = 5;
          const progressWidth = (item.percentual / 100) * barWidth;
          
          pdf.setFillColor(224, 224, 224);
          pdf.rect(20, yPosition + 3, barWidth, barHeight, 'F');
          
          pdf.setFillColor(0, 94, 148);
          pdf.rect(20, yPosition + 3, progressWidth, barHeight, 'F');
          
          yPosition += 12;
        });
      }
      
      // RODAPÉ
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Pagina ${i} de ${pageCount} - Gerado por Sistema de Dashboard`,
          pageWidth / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      pdf.save(`dashboard_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`);
      showNotification('PDF exportado com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      showNotification('Erro ao gerar PDF. Tente novamente.', 'error');
    } finally {
      setExporting(false);
    }
  };
  
  // ========== FUNÇÃO PARA EXPORTAR CSV ==========
  const exportToCSV = () => {
    setExporting(true);
    setShowMenu(false);
    
    try {
      const csvData = [];
      
      // Cabeçalho geral
      csvData.push({
        'Tipo': 'RELATORIO COMPLETO DO DASHBOARD',
        'Detalhe': '',
        'Valor': '',
        'Extra': ''
      });
      csvData.push({ 
        'Tipo': 'Data Exportacao', 
        'Detalhe': new Date().toLocaleString('pt-BR'), 
        'Valor': '',
        'Extra': ''
      });
      csvData.push({ 
        'Tipo': 'Ciclo Atual', 
        'Detalhe': cicloTitulo, 
        'Valor': '',
        'Extra': ''
      });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // Métricas principais
      csvData.push({ 'Tipo': 'METRICAS PRINCIPAIS', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      const cards = [
        { titulo: 'FAMILIAS CADASTRADAS', valor: '487', subtitulo: '+30 familias neste ciclo' },
        { titulo: 'PRESIDENTES ATIVOS', valor: '12', subtitulo: 'Meta: 12' },
        { titulo: 'APROVACOES PENDENTES', valor: '48', subtitulo: '10% do total' },
        { titulo: 'FEEDBACKS PENDENTES', valor: '5', subtitulo: 'Requer atencao' }
      ];
      cards.forEach(card => {
        csvData.push({
          'Tipo': card.titulo,
          'Detalhe': card.valor,
          'Valor': card.subtitulo,
          'Extra': ''
        });
      });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // Participações por Mês
      csvData.push({ 'Tipo': 'PARTICIPACOES POR MES', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      csvData.push({ 'Tipo': 'Mes', 'Detalhe': 'Familias presentes', 'Valor': 'Eventos', 'Extra': '' });
      dadosParticipacoes.forEach(item => {
        csvData.push({
          'Tipo': item.mes,
          'Detalhe': item.familias,
          'Valor': item.eventos,
          'Extra': ''
        });
      });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // Totais de Participações
      const totalFamilias = dadosParticipacoes.reduce((sum, item) => sum + item.familias, 0);
      const totalEventos = dadosParticipacoes.reduce((sum, item) => sum + item.eventos, 0);
      csvData.push({ 'Tipo': 'TOTAIS', 'Detalhe': 'Total de Familias', 'Valor': totalFamilias, 'Extra': '' });
      csvData.push({ 'Tipo': 'TOTAIS', 'Detalhe': 'Total de Eventos', 'Valor': totalEventos, 'Extra': '' });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // Distribuição por Perfil
      csvData.push({ 'Tipo': 'DISTRIBUICAO POR PERFIL', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      const perfis = [
        { perfil: 'Maes solo', quantidade: 44 },
        { perfil: '+3 filhos', quantidade: 55 },
        { perfil: 'Renda baixa', quantidade: 13 },
        { perfil: 'Idosos', quantidade: 33 }
      ];
      csvData.push({ 'Tipo': 'Perfil', 'Detalhe': 'Quantidade', 'Valor': '', 'Extra': '' });
      perfis.forEach(perfil => {
        csvData.push({
          'Tipo': perfil.perfil,
          'Detalhe': perfil.quantidade,
          'Valor': '',
          'Extra': ''
        });
      });
      
      const totalPessoas = perfis.reduce((sum, item) => sum + item.quantidade, 0);
      csvData.push({ 'Tipo': 'Total Geral', 'Detalhe': totalPessoas, 'Valor': '', 'Extra': '' });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // Ranking de Presidentes
      csvData.push({ 'Tipo': 'RANKING DE PRESIDENTES', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      const ranking = [
        { nome: 'Andre', visitas: 48 },
        { nome: 'Maria', visitas: 45 },
        { nome: 'Ana', visitas: 40 },
        { nome: 'Felipe', visitas: 35 },
        { nome: 'Joao', visitas: 30 }
      ];
      csvData.push({ 'Tipo': 'Presidente', 'Detalhe': 'Visitas', 'Valor': '', 'Extra': '' });
      ranking.forEach(item => {
        csvData.push({
          'Tipo': item.nome,
          'Detalhe': item.visitas,
          'Valor': '',
          'Extra': ''
        });
      });
      
      const totalVisitas = ranking.reduce((sum, item) => sum + item.visitas, 0);
      const mediaVisitas = (totalVisitas / ranking.length).toFixed(2);
      csvData.push({ 'Tipo': 'Total de Visitas', 'Detalhe': totalVisitas, 'Valor': '', 'Extra': '' });
      csvData.push({ 'Tipo': 'Media de Visitas', 'Detalhe': mediaVisitas, 'Valor': '', 'Extra': '' });
      csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
      
      // STATUS DE COTAS (detalhado)
      if (statusCotas.length > 0) {
        csvData.push({ 'Tipo': 'STATUS DE COTAS', 'Detalhe': '', 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'Presidente', 'Detalhe': 'Atual', 'Valor': 'Meta', 'Extra': 'Percentual' });
        
        statusCotas.forEach(item => {
          csvData.push({
            'Tipo': item.nome,
            'Detalhe': item.atual,
            'Valor': item.meta,
            'Extra': `${item.percentual}%`
          });
        });
        
        // Estatísticas das cotas
        const totalAtual = statusCotas.reduce((sum, item) => sum + item.atual, 0);
        const totalMeta = statusCotas.reduce((sum, item) => sum + item.meta, 0);
        const mediaPercentual = (statusCotas.reduce((sum, item) => sum + item.percentual, 0) / statusCotas.length).toFixed(2);
        const totalPercentualGeral = totalMeta > 0 ? ((totalAtual / totalMeta) * 100).toFixed(2) : 0;
        
        csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'RESUMO DE COTAS', 'Detalhe': '', 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'Total Atual', 'Detalhe': totalAtual, 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'Total Meta', 'Detalhe': totalMeta, 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'Percentual Geral', 'Detalhe': `${totalPercentualGeral}%`, 'Valor': '', 'Extra': '' });
        csvData.push({ 'Tipo': 'Media Individual', 'Detalhe': `${mediaPercentual}%`, 'Valor': '', 'Extra': '' });
        
        // Presidentes que atingiram a meta
        const metaAtingida = statusCotas.filter(item => item.percentual >= 100);
        if (metaAtingida.length > 0) {
          csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
          csvData.push({ 'Tipo': 'PRESIDENTES QUE ATINGIRAM A META', 'Detalhe': '', 'Valor': '', 'Extra': '' });
          metaAtingida.forEach(item => {
            csvData.push({
              'Tipo': item.nome,
              'Detalhe': `${item.percentual}%`,
              'Valor': '',
              'Extra': ''
            });
          });
        }
        
        // Presidentes abaixo da meta
        const abaixoMeta = statusCotas.filter(item => item.percentual < 100);
        if (abaixoMeta.length > 0) {
          csvData.push({ 'Tipo': '', 'Detalhe': '', 'Valor': '', 'Extra': '' });
          csvData.push({ 'Tipo': 'PRESIDENTES ABAIXO DA META', 'Detalhe': '', 'Valor': '', 'Extra': '' });
          abaixoMeta.forEach(item => {
            csvData.push({
              'Tipo': item.nome,
              'Detalhe': `${item.percentual}% (faltam ${item.meta - item.atual})`,
              'Valor': '',
              'Extra': ''
            });
          });
        }
      }
      
      // Converter para CSV usando PapaParse
      const csv = Papa.unparse(csvData, {
        quotes: true,
        delimiter: ";"
      });
      
      // Adicionar BOM para suporte a caracteres especiais (português)
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.href = url;
      link.setAttribute("download", `dashboard_dados_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('CSV exportado com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      showNotification('Erro ao gerar CSV. Tente novamente.', 'error');
    } finally {
      setExporting(false);
    }
  };

  // ========== BUSCAR DADOS DA API ==========
  useEffect(() => {
    const fetchStatusCotas = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/dashboard/cotas/', {
          headers: token ? { 'Authorization': `Token ${token}` } : {}
        });

        setStatusCotas(response.data.cotas || []);
        setCicloTitulo(response.data.ciclo || 'Ciclo Atual');
      } catch (error) {
        console.error('Erro ao buscar status de cotas:', error);
        setStatusCotas([
          { nome: 'Maria Costa', atual: 48, meta: 50, percentual: 96 },
          { nome: 'Ana Lima', atual: 45, meta: 50, percentual: 90 },
          { nome: 'André Alves', atual: 50, meta: 50, percentual: 100 },
          { nome: 'Felipe Ramos', atual: 31, meta: 50, percentual: 62 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusCotas();
  }, []);

  // ========== INICIALIZAR GRÁFICOS ==========
  useEffect(() => {
    const initCharts = () => {
      if (barChartRef.current && !barChartInstance.current) {
        barChartInstance.current = new ApexCharts(barChartRef.current, barChartOptions);
        barChartInstance.current.render();
      }

      if (donutRef.current && !donutChartInstance.current) {
        donutChartInstance.current = new ApexCharts(donutRef.current, donutOptions);
        donutChartInstance.current.render();
      }

      if (rankingRef.current && !rankingChartInstance.current) {
        rankingChartInstance.current = new ApexCharts(rankingRef.current, rankingOptions);
        rankingChartInstance.current.render();
      }
    };

    const timer = setTimeout(initCharts, 100);
    
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.export-menu')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      clearTimeout(timer);
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
      if (donutChartInstance.current) {
        donutChartInstance.current.destroy();
        donutChartInstance.current = null;
      }
      if (rankingChartInstance.current) {
        rankingChartInstance.current.destroy();
        rankingChartInstance.current = null;
      }
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu]);

  const cards = [
    { titulo: 'FAMILIAS CADASTRADAS', valor: '487', subtitulo: '+30 familias neste ciclo' },
    { titulo: 'PRESIDENTES ATIVOS', valor: '12', subtitulo: 'Meta: 12' },
    { titulo: 'APROVACOES PENDENTES', valor: '48', subtitulo: '10% do total' },
    { titulo: 'FEEDBACKS PENDENTES', valor: '5', subtitulo: 'Requer atencao' }
  ];

  return (
    <div>
      {/* NOTIFICAÇÃO PERSONALIZADA */}
      {notification.show && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
          color: 'white',
          borderRadius: '4px',
          zIndex: 9999,
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification.message}
        </div>
      )}

      <div className="header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--color-primary)' }}>Painel Analitico</h2>
          <p style={{ margin: 0, color: '#666' }}>Ciclo 1 - Mes 6</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative' }}>
          <div className="export-menu" style={{ position: 'relative', display: 'inline-block' }}>
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.45rem 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setShowMenu(!showMenu)}
              disabled={exporting}
            >
              {exporting ? 'Exportando...' : 'Exportar'} <ExportIcon />
            </button>
            
            {showMenu && !exporting && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                minWidth: '180px'
              }}>
                <button
                  onClick={exportToPDF}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '8px 8px 0 0',
                    transition: 'background 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Exportar como PDF
                </button>
                <button
                  onClick={exportToCSV}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '0 0 8px 8px',
                    borderTop: '1px solid #eee',
                    transition: 'background 0.2s',
                    fontSize: '14px'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  Exportar como CSV
                </button>
              </div>
            )}
          </div>
          
          <button className="btn btn-primary" style={{ color: 'var(--white)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Novo ciclo <AddIcon />
          </button>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {cards.map((card, index) => (
            <div className="card" key={index}>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.titulo}</p>
              <h1 style={{ margin: '8px 0', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>{card.valor}</h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{card.subtitulo}</p>
            </div>
          ))}
        </div>

        {/* GRÁFICO DE BARRAS + DONUT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div className="card">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '50px'
            }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '600' }}>
                Participacoes por Mes
              </h3>
              <select style={{
                padding: '10px 15px',
                borderRadius: '12px',
                border: 'none',
                background: '#f3f3f3',
                fontWeight: '500',
                cursor: 'pointer'
              }}>
                <option>Ultimo ciclo</option>
                <option>Ultimos 6 meses</option>
                <option>Ultimo ano</option>
              </select>
            </div>
            <div ref={barChartRef}></div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '46px' }}>Distribuicao por Perfil</h3>
            <div ref={donutRef}></div>
          </div>
        </div>

        {/* RANKING + STATUS DE COTAS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          <div className="card">
            <div ref={rankingRef} style={{ overflowX: 'hidden' }}></div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '8px' }}>Status de Cotas</h3>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
              Progresso por presidente - {cicloTitulo}
            </p>

            {loading ? (
              <p>Carregando...</p>
            ) : (
              statusCotas.map((item, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{item.nome}</strong>
                    <span>{item.atual}/{item.meta}</span>
                  </div>
                  <div style={{ background: '#e0e0e0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      background: 'var(--color-primary)',
                      height: '100%',
                      width: `${item.percentual}%`,
                      borderRadius: '10px'
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;