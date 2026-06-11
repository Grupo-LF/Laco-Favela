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
        'num_filhos',
        'recebe_beneficio',
        'eventos_compareceu',
        'total_eventos',
        'score_display',
        'status',
        'aprovada',
        'aprovada_icon'
    ]
    
    list_filter = [
        'perfil',
        'status',
        'aprovada',
        'presidente',
        'recebe_beneficio',
        'comunidade'
    ]
    
    search_fields = [
        'nome_responsavel',
        'telefone',
        'presidente__nome',
        'endereco',
        'comunidade'
    ]
    
    list_editable = [
        'eventos_compareceu',
        'total_eventos',
        'status',
        'aprovada'  # ✅ PODE EDITAR DIRETO NA LISTA
    ]
    
    readonly_fields = ['score_display']
    list_per_page = 25
    
    def score_display(self, obj):
        return f"{obj.score}%"
    score_display.short_description = 'SCORE'
    
    def aprovada_icon(self, obj):
        return '✅' if obj.aprovada else '❌'
    aprovada_icon.short_description = '✓'

    fieldsets = (
        ('Informações Pessoais', {
            'fields': ('nome_responsavel', 'telefone', 'presidente')
        }),
        ('Endereço', {
            'fields': ('endereco', 'comunidade', 'municipio')
        }),
        ('Composição Familiar', {
            'fields': ('num_membros', 'num_filhos', 'recebe_beneficio')
        }),
        ('Perfil', {
            'fields': ('perfil',)
        }),
        ('Participação em Eventos', {
            'fields': ('eventos_compareceu', 'total_eventos'),
            'description': 'O score é calculado automaticamente'
        }),
        ('Status do Processo', {
            'fields': ('status',),
            'description': 'Pendente ou Completo'
        }),
        ('Aprovação', {
            'fields': ('aprovada',),
            'description': 'Marcar se a família foi aprovada'
        }),
    )