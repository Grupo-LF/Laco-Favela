from django.contrib import admin
from .models import Ciclo, RespostaCiclo

# Register your models here.
@admin.register(Ciclo)
class CicloAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'status', 'prazo', 'criado_em']
    list_filter = ['status']
    search_fields = ['titulo']

@admin.register(RespostaCiclo)
class RespostaCicloAdmin(admin.ModelAdmin):
    list_display = ['ciclo', 'presidente', 'familia', 'status', 'respondido_em']
    list_filter = ['status']