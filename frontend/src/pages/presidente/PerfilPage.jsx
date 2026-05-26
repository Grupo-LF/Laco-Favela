import React from 'react';

function PerfilPage() {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerTela}>
        <h1 style={styles.tituloTela}>Meu Perfil</h1>
        <p style={styles.subtituloTela}>Gerencie suas informações cadastrais, dados da comunidade e familiares.</p>
      </div>

      <div style={styles.formContainer}>
        {/* Seção 1 */}
        <div style={styles.formSection}>
          <h3 style={styles.formSectionTitle}>Informações Básicas</h3>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome Completo</label>
              <input type="text" defaultValue="João da Silva" style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>E-mail Institucional</label>
              <input type="email" defaultValue="joao.silva@lacofavela.org" style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nome da Organização/Iniciativa</label>
              <input type="text" defaultValue="Iniciativa Exemplo Fila" style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Comunidade Atuante</label>
              <select style={styles.input} defaultValue="vila-prudente">
                <option value="vila-prudente">Vila Prudente</option>
                <option value="rocinha">Rocinha</option>
                <option value="paraisopolis">Paraisópolis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2 */}
        <div style={styles.formSection}>
          <h3 style={styles.formSectionTitle}>Perfil de Trabalho e Renda</h3>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Faixa de Renda Familiar</label>
              <select style={styles.input} defaultValue="at2">
                <option value="at1">Até 1 Salário Mínimo</option>
                <option value="at2">De 1 a 2 Salários Mínimos</option>
                <option value="at3">Mais de 2 Salários Mínimos</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Link do Instagram da Ação</label>
              <input type="text" defaultValue="https://instagram.com/lacofavela_exemplo" style={styles.input} />
            </div>
          </div>
        </div>

        {/* Seção 3: Tabela interna de membros */}
        <div style={styles.formSection}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h3 style={{...styles.formSectionTitle, marginBottom: 0}}>Membros da Família Cadastrados</h3>
            <button type="button" style={styles.btnAdicionar}>+ Adicionar Membro</button>
          </div>
          
          <table style={{...styles.table, border: '1px solid #e2e8f0', borderRadius: '8px'}}>
            <thead>
              <tr style={{background: '#f8fafc'}}>
                <th style={styles.thSub}>Nome</th>
                <th style={styles.thSub}>Parentesco</th>
                <th style={styles.thSub}>Idade</th>
                <th style={{...styles.thSub, textAlign: 'center'}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tdSub}>Maria da Silva</td>
                <td style={styles.tdSub}>Mãe</td>
                <td style={styles.tdSub}>58 anos</td>
                <td style={{...styles.tdSub, textAlign: 'center', color: '#ef4444', cursor: 'pointer'}}>Remover</td>
              </tr>
              <tr>
                <td style={styles.tdSub}>Pedro da Silva</td>
                <td style={styles.tdSub}>Filho</td>
                <td style={styles.tdSub}>12 anos</td>
                <td style={{...styles.tdSub, textAlign: 'center', color: '#ef4444', cursor: 'pointer'}}>Remover</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '30px'}}>
          <button type="button" style={styles.btnSalvar}>
            💾 Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: { padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },
  headerTela: { marginBottom: '32px' },
  tituloTela: { fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 4px 0' },
  subtituloTela: { fontSize: '15px', color: '#64748b', margin: 0 },
  formContainer: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '32px' },
  formSection: { marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' },
  formSectionTitle: { fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#475569' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#1e293b', outline: 'none' },
  btnAdicionar: { padding: '6px 12px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#1e293b', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thSub: { padding: '12px', fontSize: '14px', fontWeight: '600', color: '#334155', borderBottom: '1px solid #e2e8f0' },
  tdSub: { padding: '12px', fontSize: '15px', color: '#475569', borderBottom: '1px solid #f1f5f9' },
  btnSalvar: { padding: '12px 24px', borderRadius: '8px', backgroundColor: '#1e293b', color: '#ffffff', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }
};

export default PerfilPage;