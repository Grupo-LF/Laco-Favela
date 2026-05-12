from django.db import models

# Create your models here.

class Presidente(models.Model):
    nome = models.CharField(max_length=100)
    setor = models.CharField(max_length=100)
    cota = models.IntegerField(default=0)
    ativo = models.BooleanField(default=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome} - {self.setor}"