from django.db import models
from django.conf import settings

# Create your models here.
class Familia(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='familia_profile',
        null=True,
        blank=True
    )

    RENDA_CHOICES = [
        ('sem_renda', 'Sem renda fixa'),
        ('ate_meio', 'Até meio salário mínimo'),
        ('ate_um', 'Até um salário mínimo'),
        ('um_a_dois', 'De 1 a 2 salários mínimos'),
        ('mais_dois', 'Mais de 2 salários mínimos'),
    ]

    MAE_SOLO_CHOICES = [
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('sem_filhos', 'Não tenho filhos'),
    ]

    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovada', 'Aprovada'),
        ('lista_espera', 'Lista de espera'),
    ]

    presidente = models.ForeignKey(
        'presidentes.Presidente',
        on_delete=models.SET_NULL,
        null=True,
        related_name='familias'
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='familia_profile',
        null=True, # Importante: permite criar famílias sem usuário inicialmente
        blank=True
    )

    nome_responsavel = models.CharField(max_length=100)
    endereco = models.CharField(max_length=200)
    comunidade = models.CharField(max_length=100)
    municipio = models.CharField(max_length=100)
    telefone = models.CharField(max_length=15)
    melhor_horario = models.CharField(max_length=100, blank=True)
    renda_familiar = models.CharField(max_length=20, choices=RENDA_CHOICES)
    num_membros = models.IntegerField()
    mae_solo = models.CharField(max_length=20, choices=MAE_SOLO_CHOICES)
    num_filhos = models.IntegerField(default=0)
    bolsa_familia = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    aprovada = models.BooleanField(default=False)
    pontos_participacao = models.IntegerField(default=0, help_text="Pontos acumulados por engajamento")
    acoes_concluidas = models.IntegerField(default=0, help_text="Quantidade de ações comunitárias feitas")
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    

    def save(self, *args, **kwargs):
        self.aprovada = self.status == 'aprovada'
        update_fields = kwargs.get('update_fields')
        if update_fields is not None:
            kwargs['update_fields'] = set(update_fields) | {'aprovada'}
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.nome_responsavel} - {self.comunidade}"