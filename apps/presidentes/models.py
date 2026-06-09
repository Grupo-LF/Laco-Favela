from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Presidente(models.Model): #fiz com base no formulario do presidente de rua que recebemos
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='presidente_profile')
    TRABALHO_CHOICES = [
        ('sim', 'Sim'),
        ('nao', 'Não'),
        ('empreendedor', 'Sou empreendedor'),
    ]

    RENDA_CHOICES = [
        ('menos_um', 'Menos de um salário mínimo'),
        ('um', 'Um salário mínimo'),
        ('um_a_dois', 'De um a dois salários mínimos'),
        ('acima_dois', 'Acima de dois salários mínimos'),
    ]

    MEMBROS_CHOICES = [
        (1, '1 integrante'),
        (2, '2 integrantes'),
        (3, '3 integrantes'),
        (4, '4 integrantes'),
        (5, '5 integrantes'),
        (6, 'Acima de 5 integrantes'),
    ]

    # Campos obrigatórios (mantidos)
    nome = models.CharField(max_length=100)
    situacao_trabalho = models.CharField(max_length=20, choices=TRABALHO_CHOICES)
    renda_familiar = models.CharField(max_length=20, choices=RENDA_CHOICES)
    num_membros = models.IntegerField(choices=MEMBROS_CHOICES)
    termo_aceito = models.BooleanField(default=False)
    
    # ========== CAMPOS OPCIONAIS (NÃO OBRIGATÓRIOS) ==========
    endereco = models.CharField(max_length=200, blank=True, null=True)  # Agora opcional
    comunidade = models.CharField(max_length=100, blank=True, null=True)  # Agora opcional
    organizacao = models.CharField(max_length=100, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    redes_sociais = models.CharField(max_length=200, blank=True, null=True)
    
    # Campos com valores padrão
    cota = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    # ========== NOVOS CAMPOS ==========
    setor = models.CharField(max_length=100, blank=True, null=True, help_text="Setor/Região do presidente")
    visitas = models.IntegerField(default=0, help_text="Quantidade de visitas realizadas")
    eventos = models.IntegerField(default=0, help_text="Quantidade de eventos realizados")
    penalizacao = models.IntegerField(default=0, help_text="Pontos de penalização (desconta do score)")
    meta_familias = models.IntegerField(default=0, help_text="Meta de famílias a serem atendidas/recrutadas")

    def __str__(self):
        return f"{self.nome} - {self.comunidade if self.comunidade else 'Sem comunidade'}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) # Continua o processo normal de salvar