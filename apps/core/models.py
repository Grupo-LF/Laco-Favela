from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class PerfilUsuario(models.Model):
    TIPO_CHOICES = [
        ('admin', 'Administrador'),
        ('presidente', 'Presidente de Rua'),
        ('morador', 'Morador'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='morador')

    def __str__(self):
        return f"{self.user.username} - {self.tipo}"