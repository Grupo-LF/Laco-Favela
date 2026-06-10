from django.contrib import admin
from .models import Familia

@admin.register(Familia)
class FamiliaAdmin(admin.ModelAdmin):
    list_display = [
        'nome_responsavel',
        'telefone',
        'presidente',
        'perfil',
        'num_membros',
        'eventos_compareceu',
        'total_eventos',
        'score_display',
        'participacao_display',
        'status'
    ]
    
    list_filter = [
        'perfil',
        'status',
        'presidente'
    ]
    
    search_fields = [
        'nome_responsavel',
        'telefone',
        'presidente__nome'
    ]
    
    # Campos que podem ser editados diretamente na lista
    list_editable = [
        'eventos_compareceu',  # ✅ EDITÁVEL
        'total_eventos',       # ✅ EDITÁVEL
        'status'
    ]
    
    # Campos somente leitura (calculados)
    readonly_fields = ['score_display', 'participacao_display']
    
    list_per_page = 25
    
    def score_display(self, obj):
        """Mostra o score calculado"""
        return obj.score
    score_display.short_description = 'SCORE'
    
    def participacao_display(self, obj):
        """Mostra a porcentagem de participação"""
        return obj.participacao_percentual
    participacao_display.short_description = 'PART. (%)'
    
    # Organização do formulário de edição
    fieldsets = (
        ('Informações Pessoais', {
            'fields': ('nome_responsavel', 'telefone', 'presidente')
        }),
        ('Perfil da Família', {
            'fields': ('perfil', 'num_membros')
        }),
        ('Participação em Eventos (EDITÁVEL)', {
            'fields': ('eventos_compareceu', 'total_eventos'),
            'description': 'O score é calculado automaticamente: (eventos_compareceu / total_eventos) * 100'
        }),
        ('Status', {
            'fields': ('status',)
        }),
    )