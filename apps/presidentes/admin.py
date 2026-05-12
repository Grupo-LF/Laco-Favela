from django.contrib import admin
from .models import Presidente

# Register your models here.

@admin.register(Presidente)
class PresidenteAdmin(admin.ModelAdmin):
    list_display = ['nome', 'setor', 'cota', 'ativo', 'criado_em']
    list_filter = ['ativo']
    search_fields = ['nome', 'setor']