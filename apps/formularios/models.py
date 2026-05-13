from django.db import models

# Create your models here.
class Ciclo(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('rascunho', 'Rascunho'),
        ('encerrado', 'Encerrado'),
    ]

    titulo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='rascunho')
    prazo = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class RespostaCiclo(models.Model):
    STATUS_CHOICES = [
        ('completo', 'Completo'),
        ('pendente', 'Pendente'),
    ]

    ciclo = models.ForeignKey(Ciclo, on_delete=models.CASCADE, related_name='respostas')
    presidente = models.ForeignKey('presidentes.Presidente', on_delete=models.CASCADE)
    familia = models.ForeignKey('familias.Familia', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendente')
    observacao = models.TextField(blank=True)
    respondido_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ciclo} - {self.presidente}"