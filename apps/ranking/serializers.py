from rest_framework import serializers
from django.db.models import Sum
from apps.presidentes.models import Presidente


class RankingPresidenteSerializer(serializers.ModelSerializer):
    total_familias = serializers.SerializerMethodField()
    total_pessoas = serializers.SerializerMethodField()
    posicao = serializers.SerializerMethodField()

    class Meta:
        model = Presidente
        fields = [
            'id',
            'nome',
            'comunidade',
            'total_familias',
            'total_pessoas',
            'posicao',
        ]

    def get_total_familias(self, obj):
        return obj.familias.filter(aprovada=True).count()

    def get_total_pessoas(self, obj):
        return obj.familias.filter(aprovada=True).aggregate(
            total=Sum('num_membros')
        )['total'] or 0

    def get_posicao(self, obj):
        return self.context.get('posicoes', {}).get(obj.id)