from rest_framework import serializers
from apps.familias.models import Familia
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

        # 1. Comprometimento: Aceitou o termo de liderança? (Máx: 10 pontos)
        if obj.termo_aceito:
            pontos += 10

        # 2. Volume de Trabalho: Baseado na cota (Máx: 40 pontos)
        # Cada família na cota vale 2 pontos, limitado a 40
        if obj.cota > 0:
            pontos_cota = min(obj.cota * 2, 40)
            pontos += pontos_cota

        # 3. Visitas realizadas (Máx: 30 pontos)
        # Pontua baseado na % da cota atingida
        if obj.cota > 0 and obj.visitas:
            percentual_visitas = min((obj.visitas / obj.cota) * 100, 100)
            pontos_visitas = (percentual_visitas / 100) * 30
            pontos += pontos_visitas

        # 4. Eventos realizados (Máx: 15 pontos)
        # Cada evento vale 3 pontos, limitado a 15
        if obj.eventos:
            pontos_eventos = min(obj.eventos * 3, 15)
            pontos += pontos_eventos

        # 5. Comunicação: Rede social preenchida (Máx: 5 pontos)
        if obj.redes_sociais and obj.redes_sociais.strip():
            pontos += 5

        return round(pontos, 1)

    def get_porcentagem_cota(self, obj):
        """Calcula a porcentagem da cota atingida baseado nas visitas"""
        if obj.cota > 0 and obj.cota is not None:
            porcentagem = (obj.visitas / obj.cota) * 100
            return round(min(porcentagem, 100), 1)  # Limita a 100%
        return 0

    def get_score_final(self, obj):
        """Score final = pontuação de engajamento - penalização (não pode ficar negativo)"""
        engajamento = self.get_pontuacao_engajamento(obj)
        score = max(0, engajamento - obj.penalizacao)
        return round(score, 1)

    def get_status_display(self, obj):
        """Define o status baseado no score final (escala mais realista)"""
        score = self.get_score_final(obj)
        
        if score >= 85:
            return "Excelente"
        elif score >= 70:
            return "Bom"
        elif score >= 50:
            return "Regular"
        elif score >= 30:
            return "Atenção"
        else:
            return "Crítico"
