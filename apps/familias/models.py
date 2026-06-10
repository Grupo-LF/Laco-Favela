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
        ('aprovada', 'Aprovada'),
        ('lista_espera', 'Lista de espera'),
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
    
    # ========== PERFIL DA FAMÍLIA ==========
    perfil = models.CharField(max_length=20, choices=PERFIL_CHOICES, default='nenhum')
    num_membros = models.IntegerField(default=1)
    
    # ========== PARTICIPAÇÃO EM EVENTOS (EDITÁVEL) ==========
    total_eventos = models.IntegerField(default=9)
    eventos_compareceu = models.IntegerField(default=0)
    
    # ========== STATUS ==========
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')

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

    def __str__(self):
        return f"{self.nome_responsavel} - {self.get_perfil_display()} - {self.participacao_percentual}"