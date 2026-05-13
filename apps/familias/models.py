from django.db import models

# Create your models here.
class Familia(models.Model):
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

    presidente = models.ForeignKey(
        'presidentes.Presidente',
        on_delete=models.SET_NULL,
        null=True,
        related_name='familias'
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
    aprovada = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_responsavel} - {self.comunidade}"