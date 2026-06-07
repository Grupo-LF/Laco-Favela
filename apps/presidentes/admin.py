from django import forms
from django.contrib import admin
from django.contrib.auth.models import User
from .models import Presidente
class PresidenteAdminForm(forms.ModelForm):
    senha_admin = forms.CharField(
        label="Senha de Acesso", 
        widget=forms.PasswordInput(), 
        required=False,
        help_text="Digite a senha inicial se estiver criando um novo presidente."
    )

    class Meta:
        model = Presidente
        fields = '__all__'
@admin.register(Presidente)
class PresidenteAdmin(admin.ModelAdmin):
    form = PresidenteAdminForm 
    
    list_display = ['nome', 'comunidade', 'cota', 'ativo', 'criado_em']
    list_filter = ['ativo']
    search_fields = ['nome', 'comunidade']
    
    def save_model(self, request, obj, form, change):
        senha = form.cleaned_data.get('senha_admin')

        if not change and not obj.user:
            if senha:
                novo_usuario = User.objects.create_user(
                    username=obj.nome, # Usei o telefone como login, como no seu código original
                    password=senha
                )
                novo_usuario.first_name = obj.nome.split(' ')[0]
                novo_usuario.save()
                
                obj.user = novo_usuario
            else:
                raise forms.ValidationError("Para novos cadastros, o campo 'Senha de Acesso' é obrigatório.")

        super().save_model(request, obj, form, change)
