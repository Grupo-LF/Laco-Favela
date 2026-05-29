from rest_framework import serializers
from .models import Familia

class FamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familia
        fields = '__all__'
        read_only_fields = ['aprovada', 'criado_em', 'atualizado_em']

class FamiliaRankingSerializer(serializers.ModelSerializer):
    # Campo calculado dinamicamente para o ranking
    pontuacao_prioridade = serializers.SerializerMethodField()
    
    # Exibe o texto amigável das escolhas em vez da chave do banco (opcional, mas ótimo para o React)
    renda_familiar_display = serializers.CharField(source='get_renda_familiar_display', read_only=True)
    mae_solo_display = serializers.CharField(source='get_mae_solo_display', read_only=True)

    class Meta:
        model = Familia
        fields = [
            'id', 'nome_responsavel', 'comunidade', 'municipio', 
            'renda_familiar', 'renda_familiar_display',
            'mae_solo', 'mae_solo_display', 'num_membros', 
            'num_filhos', 'bolsa_familia', 'aprovada', 'pontuacao_prioridade'
        ]

    def get_pontuacao_prioridade(self, obj):
        pontos = 0

        # 1. Pesos para Renda Familiar (Menor renda = Mais pontos/prioridade)
        pesos_renda = {
            'sem_renda': 50,
            'ate_meio': 40,
            'ate_um': 30,
            'um_a_dois': 15,
            'mais_dois': 0
        }
        pontos += pesos_renda.get(obj.renda_familiar, 0)

        # 2. Pesos para Mãe Solo
        if obj.mae_solo == 'sim':
            pontos += 30

        # 3. Peso para Beneficiários do Bolsa Família
        if obj.bolsa_familia:
            pontos += 20

        # 4. Peso por volume de membros e filhos (Impacto demográfico)
        pontos += (obj.num_filhos * 5)
        pontos += (obj.num_membros * 2)

        return pontos
