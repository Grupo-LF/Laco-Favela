from django.db import models

class Familia(models.Model):
    PERFIL_CHOICES = [
        ('mae_solo', 'Mãe solo'),
        ('baixa_renda', 'Baixa renda'),
        ('mais_3_filhos', '+3 filhos'),
        ('idosos', 'Idosos'),
        ('nenhum', 'Nenhum perfil específico'),
    ]

    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('completo', 'Completo'),
    ]

    # ========== RELACIONAMENTOS ==========
    presidente = models.ForeignKey(
        'presidentes.Presidente',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='familias'
    )
    
    # ========== INFORMAÇÕES BÁSICAS ==========
    nome_responsavel = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15)
    
    # ========== ENDEREÇO ==========
    endereco = models.CharField(max_length=200, blank=True)
    comunidade = models.CharField(max_length=100, blank=True)
    municipio = models.CharField(max_length=100, blank=True)
    
    # ========== COMPOSIÇÃO FAMILIAR ==========
    num_membros = models.IntegerField(default=1)
    num_filhos = models.IntegerField(default=0)
    
    # ========== RENDA E BENEFÍCIOS ==========
    recebe_beneficio = models.BooleanField(default=False, help_text="Recebe Bolsa Família ou outro benefício social?")
    
    # ========== PERFIL DA FAMÍLIA ==========
    perfil = models.CharField(max_length=20, choices=PERFIL_CHOICES, default='nenhum')
    
    # ========== PARTICIPAÇÃO EM EVENTOS (EDITÁVEL) ==========
    total_eventos = models.IntegerField(default=9)
    eventos_compareceu = models.IntegerField(default=0)
    
    # ========== STATUS ==========
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    
    # ========== APROVAÇÃO (BOOLEANO INDEPENDENTE) ==========
    aprovada = models.BooleanField(default=False, help_text="Marca se a família foi aprovada (independente do status)")

    # ========== PROPRIEDADES CALCULADAS ==========
    @property
    def score(self):
        """Calcula o score de engajamento (0-100)"""
        if self.total_eventos == 0:
            return 0
        return round((self.eventos_compareceu / self.total_eventos) * 100)

    @property
    def participacao_percentual(self):
        """Retorna a porcentagem de participação formatada"""
        return f"{self.score}%"
    
    @property
    def participacao_numero(self):
        """Retorna a porcentagem de participação como número"""
        return self.score
    
    @property
    def endereco_completo(self):
        """Retorna o endereço completo formatado"""
        partes = []
        if self.endereco:
            partes.append(self.endereco)
        if self.comunidade:
            partes.append(self.comunidade)
        if self.municipio:
            partes.append(self.municipio)
        return ", ".join(partes) if partes else "Endereço não informado"

    def __str__(self):
        return f"{self.nome_responsavel} - {self.get_perfil_display()} - Status: {self.get_status_display()} - Aprovada: {'Sim' if self.aprovada else 'Não'}"