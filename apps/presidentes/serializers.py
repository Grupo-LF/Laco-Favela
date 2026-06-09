from rest_framework import serializers
from .models import Presidente

class PresidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presidente
        fields = '__all__'


class CotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presidente
        fields = ['cota']


class PresidenteRankingSerializer(serializers.ModelSerializer):
    # Campos existentes
    pontuacao_engajamento = serializers.SerializerMethodField()
    renda_familiar_display = serializers.CharField(source='get_renda_familiar_display', read_only=True)
    situacao_trabalho_display = serializers.CharField(source='get_situacao_trabalho_display', read_only=True)
    
    # NOVOS CAMPOS
    porcentagem_cota = serializers.SerializerMethodField()
    score_final = serializers.SerializerMethodField()
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Presidente
        fields = [
            'id', 'nome', 'organizacao', 'comunidade', 'endereco', 'telefone',
            'redes_sociais',
            'situacao_trabalho', 'situacao_trabalho_display',
            'renda_familiar', 'renda_familiar_display',
            'num_membros', 'termo_aceito', 'cota', 'ativo',
            'pontuacao_engajamento',
            # NOVOS CAMPOS
            'setor',
            'visitas',
            'eventos',
            'penalizacao',
            'porcentagem_cota',
            'score_final',
            'status_display'
        ]

    def get_pontuacao_engajamento(self, obj):
        pontos = 0

        # 1. Comprometimento: Aceitou o termo de liderança?
        if obj.termo_aceito:
            pontos += 40

        # 2. Volume de Trabalho: Multiplica a cota de famílias por 10
        if obj.cota > 0:
            pontos += (obj.cota * 10)

        # 3. Comunicação: Se preencheu as redes sociais ganha bônus
        if obj.redes_sociais and obj.redes_sociais.strip():
            pontos += 20

        return pontos

    def get_porcentagem_cota(self, obj):
        """Calcula a porcentagem da cota atingida baseado nas visitas"""
        if obj.cota > 0:
            porcentagem = (obj.visitas / obj.cota) * 100
            return round(porcentagem, 1)
        return 0

    def get_score_final(self, obj):
        """Score final = pontuação de engajamento - penalização"""
        engajamento = self.get_pontuacao_engajamento(obj)
        return max(0, engajamento - obj.penalizacao)

    def get_status_display(self, obj):
        """Define o status baseado no score final"""
        score = self.get_score_final(obj)
        
        if score >= 100:
            return "Excelente"
        elif score >= 70:
            return "Bom"
        elif score >= 40:
            return "Regular"
        elif score >= 20:
            return "Atenção"
        else:
            return "Crítico"