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
    
    def clean(self):
        cleaned_data = super().clean()
        # Verifica se é um novo cadastro (sem id) e se a senha não foi fornecida
        if not self.instance.pk and not cleaned_data.get('senha_admin'):
            self.add_error('senha_admin', "Para novos cadastros, o campo 'Senha de Acesso' é obrigatório.")
        return cleaned_data

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
                # Gera um username único baseado no nome
                username = obj.nome.lower().replace(' ', '_')
                base_username = username
                counter = 1
                
                while User.objects.filter(username=username).exists():
                    username = f"{base_username}_{counter}"
                    counter += 1
                
                novo_usuario = User.objects.create_user(
                    username=username,
                    password=senha
                )
                novo_usuario.first_name = obj.nome.split(' ')[0] if ' ' in obj.nome else obj.nome
                if len(obj.nome.split(' ')) > 1:
                    novo_usuario.last_name = ' '.join(obj.nome.split(' ')[1:])
                novo_usuario.save()
                
                obj.user = novo_usuario
            # Se não tem senha, o erro já será exibido pelo clean()

        super().save_model(request, obj, form, change)