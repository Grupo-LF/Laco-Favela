from django.contrib import admin
from .models import Familia

# Register your models here.
@admin.register(Familia)
class FamiliaAdmin(admin.ModelAdmin):
    list_display = ['nome_responsavel', 'comunidade', 'municipio', 'aprovada', 'criado_em']
    list_filter = ['aprovada', 'bolsa_familia', 'mae_solo']
    search_fields = ['nome_responsavel', 'comunidade']