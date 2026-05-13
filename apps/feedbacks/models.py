from django.db import models

# Create your models here.
class Feedback(models.Model):
    TIPO_CHOICES = [
        ('denuncia', 'Denúncia'),
        ('sugestao', 'Sugestão'),
        ('elogio', 'Elogio'),
    ]

    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    mensagem = models.TextField()
    lido = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo} - {self.criado_em}"