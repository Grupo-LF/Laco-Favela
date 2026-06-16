import time
import os
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

FRONTEND_URL = 'http://localhost:3000'


class BaseSeleniumTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        browser = os.environ.get('TEST_BROWSER', 'firefox')
        headless = os.environ.get('HEADLESS', 'true') != 'false'

        if browser == 'chrome':
            from selenium.webdriver.chrome.options import Options as ChromeOptions
            from selenium.webdriver.chrome.service import Service
            from webdriver_manager.chrome import ChromeDriverManager
            options = ChromeOptions()
            if headless:
                options.add_argument('--headless')
            options.add_argument('--no-sandbox')
            cls.browser = webdriver.Chrome(
                service=Service(ChromeDriverManager().install()),
                options=options
            )
        else:
            options = Options()
            if headless:
                options.add_argument('--headless')
            cls.browser = webdriver.Firefox(options=options)

        cls.browser.implicitly_wait(10)

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()
        super().tearDownClass()

    def fazer_login(self, username, password):
        self.browser.get(FRONTEND_URL)
        self.browser.execute_script("localStorage.clear()")
        self.browser.get(FRONTEND_URL)
        wait = WebDriverWait(self.browser, 10)
        wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Digite seu usuário']")))
        self.browser.find_element(By.XPATH, "//input[@placeholder='Digite seu usuário']").send_keys(username)
        self.browser.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys(password)
        time.sleep(1)
        self.browser.find_element(By.XPATH, "//button[@type='submit']").click()
        wait.until(EC.presence_of_element_located((By.TAG_NAME, 'aside')))
        time.sleep(1)

    def clicar_menu(self, label):
        item = self.browser.find_element(By.XPATH, f"//a[contains(text(), '{label}')]")
        item.click()
        time.sleep(2)


class TesteLogin(BaseSeleniumTest):

    # SCRUM-16: Admin quer um login simples e seguro
    def test_login_valido(self):
        self.fazer_login('admin', 'admin123')
        sidebar = self.browser.find_element(By.TAG_NAME, 'aside')
        self.assertTrue(sidebar.is_displayed())

    def test_login_invalido(self):
        self.browser.get(FRONTEND_URL)
        self.browser.execute_script("localStorage.clear()")
        self.browser.get(FRONTEND_URL)
        wait = WebDriverWait(self.browser, 10)
        wait.until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Digite seu usuário']")))
        self.browser.find_element(By.XPATH, "//input[@placeholder='Digite seu usuário']").send_keys('errado')
        self.browser.find_element(By.XPATH, "//input[@placeholder='Digite sua senha']").send_keys('errado123')
        time.sleep(1)
        self.browser.find_element(By.XPATH, "//button[@type='submit']").click()
        time.sleep(3)
        erro = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "p.text-center")))
        self.assertTrue(erro.is_displayed())

class TesteAdminFamilias(BaseSeleniumTest):

    # SCRUM-6: Admin quer visualizar lista de famílias
    def test_visualizar_lista_familias(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Famílias')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    # SCRUM-8: Admin quer visualizar ranking de famílias
    def test_visualizar_ranking_familias(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Aprovados')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())


class TesteAdminPresidentes(BaseSeleniumTest):

    # SCRUM-7: Admin quer visualizar lista de presidentes
    def test_visualizar_lista_presidentes(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Presidentes')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())


class TesteAdminDashboard(BaseSeleniumTest):

    # SCRUM-5: Admin quer visualizar dados gerais da ONG
    def test_visualizar_dashboard(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Dashboard')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    # SCRUM-15: Admin quer visualizar histórico do programa
    def test_visualizar_historico(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Histórico')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

class TesteAdminAprovados(BaseSeleniumTest):

    # SCRUM-13: Admin quer selecionar e gerar lista de aprovados
    def test_visualizar_aprovados(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Aprovados')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_botao_gerar_aprovados_visivel(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Aprovados')
        time.sleep(2)
        botao = self.browser.find_element(By.XPATH, "//button[contains(text(), 'Gerar Aprovados')]")
        self.assertTrue(botao.is_displayed())

    def test_filtro_todas_visivel(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Aprovados')
        time.sleep(2)
        filtro = self.browser.find_element(By.XPATH, "//button[contains(text(), 'Todas')]")
        self.assertTrue(filtro.is_displayed())


class TesteAdminFormularios(BaseSeleniumTest):

    # SCRUM-10: Admin quer criar, editar e excluir formulários
    def test_visualizar_formularios(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Formulários')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_botao_ver_todos_visivel(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Formulários')
        time.sleep(2)
        botao = self.browser.find_element(By.XPATH, "//button[contains(text(), 'Ver todos')]")
        self.assertTrue(botao.is_displayed())

class TesteAdminPresidentesRanking(BaseSeleniumTest):

    # SCRUM-9: Admin quer visualizar ranking de presidentes
    def test_tabela_ranking_visivel(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Presidentes')
        time.sleep(2)
        tabela = self.browser.find_element(By.TAG_NAME, 'table')
        self.assertTrue(tabela.is_displayed())

    def test_botao_novo_presidente_visivel(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Presidentes')
        time.sleep(2)
        botao = self.browser.find_element(By.XPATH, "//button[contains(text(), 'Novo Presidente')]")
        self.assertTrue(botao.is_displayed())

    def test_filtros_ordenacao_visiveis(self):
        self.fazer_login('admin', 'admin123')
        self.clicar_menu('Presidentes')
        time.sleep(2)
        filtro = self.browser.find_element(By.XPATH, "//button[contains(text(), 'Score')]")
        self.assertTrue(filtro.is_displayed())

class TestePresidente(BaseSeleniumTest):

    # História 2 - Presidente de Rua
    def test_login_presidente(self):
        self.fazer_login('presidente', 'presidente123')
        sidebar = self.browser.find_element(By.TAG_NAME, 'aside')
        self.assertTrue(sidebar.is_displayed())

    def test_home_presidente_visivel(self):
        self.fazer_login('presidente', 'presidente123')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_visualizar_familias(self):
        self.fazer_login('presidente', 'presidente123')
        self.clicar_menu('Famílias')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_visualizar_formularios(self):
        self.fazer_login('presidente', 'presidente123')
        self.clicar_menu('Formulários')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_visualizar_ranking(self):
        self.fazer_login('presidente', 'presidente123')
        self.clicar_menu('Ranking')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_visualizar_meu_indicador(self):
        self.fazer_login('presidente', 'presidente123')
        self.clicar_menu('Meu indicador')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())

    def test_visualizar_registros(self):
        self.fazer_login('presidente', 'presidente123')
        self.clicar_menu('Registros')
        time.sleep(2)
        conteudo = self.browser.find_element(By.CLASS_NAME, 'main-content')
        self.assertTrue(conteudo.is_displayed())