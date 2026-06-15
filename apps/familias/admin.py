from django.contrib import admin
from .models import Familia

# Register your models here.
@admin.register(Familia)
class FamiliaAdmin(admin.ModelAdmin):
    
    list_display = [
        'nome_responsavel', 
        'presidente',   
        'comunidade', 
        'municipio', 
        'status', 
        'aprovada', 
        'criado_em'
    ]

    list_filter = ['status', 'aprovada', 'bolsa_familia', 'mae_solo', 'presidente']
    
    search_fields = ['nome_responsavel', 'comunidade', 'municipio']
    
    readonly_fields = ['criado_em', 'atualizado_em']