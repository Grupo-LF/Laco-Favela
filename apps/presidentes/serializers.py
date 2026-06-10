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
            'num_membros', 'termo_aceito', 'cota', 'ativo', 'meta_familias',
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
        """
        Calcula a pontuação de engajamento baseada em:
        - Cotas (máximo = meta_familias)
        - Visitas (máximo 24 pontos)
        - Eventos (máximo 24 pontos)
        - Termo aceito (bônus)
        - Meta de famílias (bônus)
        """
        pontos = 0
        meta = obj.meta_familias or 100

        # 1. Pontuação por Cotas (máximo = meta)
        # Cada cota vale 1 ponto
        if obj.cota > 0:
            pontos_cota = min(obj.cota, meta)
            pontos += pontos_cota

        # 2. Pontuação por Visitas (máximo 24 pontos)
        # Cada visita vale 1 ponto, limitado a 24
        if obj.visitas:
            pontos_visitas = min(obj.visitas, 24)
            pontos += pontos_visitas

        # 3. Pontuação por Eventos (máximo 24 pontos)
        # Cada evento vale 1 ponto, limitado a 24
        if obj.eventos:
            pontos_eventos = min(obj.eventos, 24)
            pontos += pontos_eventos

        # 4. Bônus por aceitar o termo (máx: 5 pontos)
        if obj.termo_aceito:
            pontos += 5

        # 5. Bônus por meta de famílias atingida (máx: 5 pontos)
        if obj.meta_familias > 0 and obj.visitas and obj.visitas >= obj.meta_familias:
            pontos += 5
        elif obj.meta_familias > 0 and obj.visitas and obj.visitas >= obj.meta_familias * 0.8:
            pontos += 2  # Bônus parcial

        # 6. Bônus por rede social preenchida (máx: 3 pontos)
        if obj.redes_sociais and obj.redes_sociais.strip():
            pontos += 3

        # Limita o máximo a 98 pontos (50 cotas + 24 visitas + 24 eventos)
        return round(min(pontos, 98), 1)

    def get_porcentagem_cota(self, obj):
        """Calcula a porcentagem da cota atingida baseado nas visitas"""
        if obj.cota and obj.cota > 0:
            porcentagem = (obj.visitas / obj.cota) * 100 if obj.visitas else 0
            return round(min(porcentagem, 100), 1)
        return 0

    def get_score_final(self, obj):
        """
        Score final = pontuação de engajamento - penalização (não pode ficar negativo)
        Cada penalização reduz 10 pontos
        """
        engajamento = self.get_pontuacao_engajamento(obj)
        penalizacao = (obj.penalizacao or 0) * 10  # Cada penalização = -10 pontos
        score = max(0, engajamento - penalizacao)
        return round(score, 1)

    def get_status_display(self, obj):
        """Define o status baseado no score final"""
        score = self.get_score_final(obj)
        
        if score >= 70:
            return "Ativo"
        elif score >= 50:
            return "Alerta"
        else:
            return "Crítico"