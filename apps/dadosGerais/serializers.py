from rest_framework import serializers

class FamiliasPorPresidenteSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nome = serializers.CharField()
    comunidade = serializers.CharField()
    quantidade_familias = serializers.IntegerField()
    total_pessoas = serializers.IntegerField()

class ComunidadeEstatisticaSerializer(serializers.Serializer):
    comunidade = serializers.CharField()
    total_pessoas = serializers.IntegerField(required=False)
    total_familias = serializers.IntegerField(required=False)
    total = serializers.IntegerField(required=False)

class DadosGeraisONGSerializer(serializers.Serializer):
    total_pessoas = serializers.IntegerField()
    total_familias = serializers.IntegerField()
    familias_por_presidente = FamiliasPorPresidenteSerializer(many=True)
    pessoas_por_comunidade = ComunidadeEstatisticaSerializer(many=True)
    familias_por_comunidade = ComunidadeEstatisticaSerializer(many=True)