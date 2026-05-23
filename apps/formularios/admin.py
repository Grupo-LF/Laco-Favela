from django.contrib import admin
from .models import Ciclo, RespostaCiclo, Pergunta, Opcao, RespostaItem

# Register your models here.
@admin.register(Ciclo)
class CicloAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'status', 'prazo', 'criado_em', 'publicado_em', 'encerrado_em']
    list_filter = ['status']
    search_fields = ['titulo']

@admin.register(RespostaCiclo)
class RespostaCicloAdmin(admin.ModelAdmin):
    list_display = ['ciclo', 'presidente', 'familia', 'status', 'respondido_em', 'enviado_em']
    list_filter = ['status']


@admin.register(Pergunta)
class PerguntaAdmin(admin.ModelAdmin):
    list_display = ['ciclo', 'texto', 'tipo', 'obrigatoria', 'ordem']
    list_filter = ['tipo', 'obrigatoria']
    search_fields = ['texto']


@admin.register(Opcao)
class OpcaoAdmin(admin.ModelAdmin):
    list_display = ['pergunta', 'texto', 'ordem']
    search_fields = ['texto']


@admin.register(RespostaItem)
class RespostaItemAdmin(admin.ModelAdmin):
    list_display = ['resposta', 'pergunta']