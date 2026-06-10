from rest_framework import serializers
from .models import Familia

class FamiliaSerializer(serializers.ModelSerializer):
    # Campos calculados (read-only)
    score = serializers.IntegerField(read_only=True)
    participacao_percentual = serializers.CharField(read_only=True)
    
    # Exibe o texto amigável das escolhas
    perfil_display = serializers.CharField(source='get_perfil_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    # Informações do presidente (para exibir no frontend)
    presidente_nome = serializers.CharField(source='presidente.nome', read_only=True, default='')
    presidente_id = serializers.IntegerField(source='presidente.id', read_only=True, default=None)

    class Meta:
        model = Familia
        fields = [
            'id',
            'presidente',
            'presidente_nome',
            'presidente_id',
            'nome_responsavel',
            'telefone',
            'perfil',
            'perfil_display',
            'num_membros',
            'total_eventos',
            'eventos_compareceu',
            'score',
            'participacao_percentual',
            'status',
            'status_display'
        ]
        read_only_fields = ['score', 'participacao_percentual']


class FamiliaRankingSerializer(serializers.ModelSerializer):
    """
    Serializer específico para o ranking de famílias
    Ordenado por score de engajamento
    """
    # Campos calculados
    score = serializers.IntegerField(read_only=True)
    participacao_percentual = serializers.CharField(read_only=True)
    participacao_numero = serializers.IntegerField(source='participacao_numero', read_only=True)
    
    # Perfil
    perfil_display = serializers.CharField(source='get_perfil_display', read_only=True)
    
    # Presidente
    presidente_nome = serializers.CharField(source='presidente.nome', read_only=True, default='')
    
    # Eventos formatados
    eventos_formatado = serializers.SerializerMethodField()
    
    class Meta:
        model = Familia
        fields = [
            'id',
            'nome_responsavel',
            'telefone',
            'presidente_nome',
            'perfil',
            'perfil_display',
            'num_membros',
            'total_eventos',
            'eventos_compareceu',
            'eventos_formatado',
            'score',
            'participacao_percentual',
            'participacao_numero',
            'status'
        ]
    
    def get_eventos_formatado(self, obj):
        """Retorna eventos no formato '7/9'"""
        return f"{obj.eventos_compareceu}/{obj.total_eventos}"


class FamiliaCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer para criar e atualizar famílias
    Permite editar a participação
    """
    class Meta:
        model = Familia
        fields = [
            'id',
            'presidente',
            'nome_responsavel',
            'telefone',
            'perfil',
            'num_membros',
            'total_eventos',
            'eventos_compareceu',
            'status'
        ]
    
    def validate_eventos_compareceu(self, value):
        """Valida se eventos_compareceu não é maior que total_eventos"""
        total_eventos = self.initial_data.get('total_eventos')
        if total_eventos and value > int(total_eventos):
            raise serializers.ValidationError(
                f"eventos_compareceu ({value}) não pode ser maior que total_eventos ({total_eventos})"
            )
        return value
    
    def validate(self, data):
        """Validação adicional"""
        if data.get('eventos_compareceu', 0) > data.get('total_eventos', 9):
            raise serializers.ValidationError({
                'eventos_compareceu': 'Não pode ser maior que total_eventos'
            })
        return data


class FamiliaBulkUpdateSerializer(serializers.Serializer):
    """
    Serializer para atualização em massa (ex: aprovar várias famílias)
    """
    ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Lista de IDs das famílias"
    )
    eventos_compareceu = serializers.IntegerField(required=False, allow_null=True)
    status = serializers.ChoiceField(choices=Familia.STATUS_CHOICES, required=False)
    
    def validate_ids(self, value):
        if not value:
            raise serializers.ValidationError("Lista de IDs não pode estar vazia")
        return value