from django.db import transaction
from rest_framework import serializers

from .models import Ciclo, RespostaCiclo, Pergunta, Opcao, RespostaItem


class OpcaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Opcao
        fields = ['id', 'texto', 'ordem']


class PerguntaReadSerializer(serializers.ModelSerializer):
    opcoes = OpcaoSerializer(many=True, read_only=True)

    class Meta:
        model = Pergunta
        fields = ['id', 'texto', 'tipo', 'obrigatoria', 'ordem', 'opcoes']


class PerguntaWriteSerializer(serializers.ModelSerializer):
    opcoes = OpcaoSerializer(many=True, required=False)

    class Meta:
        model = Pergunta
        fields = ['id', 'texto', 'tipo', 'obrigatoria', 'ordem', 'opcoes']


class CicloReadSerializer(serializers.ModelSerializer):
    perguntas = PerguntaReadSerializer(many=True, read_only=True)
    
    # Campo para famílias associadas
    familias_associadas = serializers.SerializerMethodField()

    class Meta:
        model = Ciclo
        fields = [
            'id', 'titulo', 'descricao', 'status', 'prazo', 
            'criado_em', 'publicado_em', 'encerrado_em', 
            'perguntas', 'familias_associadas'
        ]

    def get_familias_associadas(self, obj):
        # Busca as respostas do ciclo com join no presidente
        respostas = RespostaCiclo.objects.filter(ciclo=obj).select_related('familia', 'presidente')
        
        # Retorna os dados das famílias
        return [{
            'id': r.familia.id,
            'nome': r.familia.nome_responsavel,
            'presidente': r.presidente.nome if r.presidente else None,
            'status': r.status
        } for r in respostas if r.familia]


class CicloWriteSerializer(serializers.ModelSerializer):
    perguntas = PerguntaWriteSerializer(many=True, required=False)
    
    familias_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True
    )

    class Meta:
        model = Ciclo
        fields = [
            'id', 'titulo', 'descricao', 'status', 'prazo', 
            'criado_em', 'publicado_em', 'encerrado_em', 
            'perguntas', 'familias_ids'
        ]
        # 🔥 CORRIGIDO: 'status' removido do read_only_fields
        read_only_fields = ['criado_em', 'publicado_em', 'encerrado_em']

    @transaction.atomic
    def create(self, validated_data):
        # 🔥 DEBUG: Mostra o que está chegando
        print("📦 [SERIALIZER] validated_data:", validated_data)
        print("📦 [SERIALIZER] Status recebido:", validated_data.get('status'))
        
        familias_ids = validated_data.pop('familias_ids', [])
        perguntas_data = validated_data.pop('perguntas', [])
        
        # 🔥 CORRIGIDO: Só define status padrão se não veio do frontend
        if 'status' not in validated_data:
            validated_data['status'] = 'rascunho'
            print("📦 [SERIALIZER] Status não veio, usando padrão: rascunho")
        else:
            print(f"📦 [SERIALIZER] Status veio do frontend: {validated_data['status']}")
        
        ciclo = Ciclo.objects.create(**validated_data)
        print(f"✅ [SERIALIZER] Ciclo criado com status: {ciclo.status}")
        
        self._save_perguntas(ciclo, perguntas_data)
        
        from apps.familias.models import Familia
        
        for familia_id in familias_ids:
            familia = Familia.objects.get(id=familia_id)
            
            RespostaCiclo.objects.create(
                ciclo=ciclo,
                familia_id=familia_id,
                presidente=familia.presidente,
                status='pendente',
                observacao=''
            )
        
        return ciclo

    @transaction.atomic
    def update(self, instance, validated_data):
        perguntas_data = validated_data.pop('perguntas', None)
        familias_ids = validated_data.pop('familias_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if perguntas_data is not None:
            instance.perguntas.all().delete()
            self._save_perguntas(instance, perguntas_data)
        
        if familias_ids is not None:
            from apps.familias.models import Familia
            
            RespostaCiclo.objects.filter(ciclo=instance).delete()
            for familia_id in familias_ids:
                familia = Familia.objects.get(id=familia_id)
                RespostaCiclo.objects.create(
                    ciclo=instance,
                    familia_id=familia_id,
                    presidente=familia.presidente,
                    status='pendente',
                    observacao=''
                )
        
        return instance

    def _save_perguntas(self, ciclo, perguntas_data):
        for pergunta_data in perguntas_data:
            opcoes_data = pergunta_data.pop('opcoes', [])
            pergunta = Pergunta.objects.create(ciclo=ciclo, **pergunta_data)
            for opcao_data in opcoes_data:
                Opcao.objects.create(pergunta=pergunta, **opcao_data)


class RespostaItemReadSerializer(serializers.ModelSerializer):
    pergunta = PerguntaReadSerializer(read_only=True)
    opcao = OpcaoSerializer(read_only=True)
    opcoes = OpcaoSerializer(many=True, read_only=True)

    class Meta:
        model = RespostaItem
        fields = [
            'id',
            'pergunta',
            'valor_texto',
            'valor_numero',
            'valor_booleano',
            'valor_data',
            'opcao',
            'opcoes',
        ]


class RespostaItemWriteSerializer(serializers.ModelSerializer):
    pergunta_id = serializers.PrimaryKeyRelatedField(source='pergunta', queryset=Pergunta.objects.all())
    opcao_id = serializers.PrimaryKeyRelatedField(source='opcao', queryset=Opcao.objects.all(), required=False, allow_null=True)
    opcao_ids = serializers.PrimaryKeyRelatedField(source='opcoes', queryset=Opcao.objects.all(), many=True, required=False)

    class Meta:
        model = RespostaItem
        fields = [
            'id',
            'pergunta_id',
            'valor_texto',
            'valor_numero',
            'valor_booleano',
            'valor_data',
            'opcao_id',
            'opcao_ids',
        ]


class RespostaCicloReadSerializer(serializers.ModelSerializer):
    itens = RespostaItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = RespostaCiclo
        fields = [
            'id',
            'ciclo',
            'familia',
            'presidente',
            'status',
            'observacao',
            'respondido_em',
            'atualizado_em',
            'enviado_em',
            'itens',
        ]


class RespostaCicloWriteSerializer(serializers.ModelSerializer):
    itens = RespostaItemWriteSerializer(many=True, required=False)

    class Meta:
        model = RespostaCiclo
        fields = [
            'id',
            'ciclo',
            'familia',
            'presidente',
            'status',
            'observacao',
            'respondido_em',
            'atualizado_em',
            'enviado_em',
            'itens',
        ]
        read_only_fields = ['status', 'respondido_em', 'atualizado_em', 'enviado_em']

    def validate(self, attrs):
        itens = attrs.get('itens')
        ciclo = attrs.get('ciclo') or getattr(self.instance, 'ciclo', None)
        if ciclo and itens is not None:
            self._validate_itens(ciclo, itens, require_all=self.context.get('submit', False))
        elif self.context.get('submit', False):
            raise serializers.ValidationError({'itens': 'Envie as respostas para concluir o envio.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        itens_data = validated_data.pop('itens', [])
        resposta = RespostaCiclo.objects.create(**validated_data)
        self._save_itens(resposta, itens_data)
        return resposta

    @transaction.atomic
    def update(self, instance, validated_data):
        itens_data = validated_data.pop('itens', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if itens_data is not None:
            instance.itens.all().delete()
            self._save_itens(instance, itens_data)
        return instance

    def _save_itens(self, resposta, itens_data):
        for item_data in itens_data:
            opcoes = item_data.pop('opcoes', [])
            resposta_item = RespostaItem.objects.create(resposta=resposta, **item_data)
            if opcoes:
                resposta_item.opcoes.set(opcoes)

    def _validate_itens(self, ciclo, itens_data, require_all=False):
        perguntas = Pergunta.objects.filter(ciclo=ciclo)
        pergunta_map = {pergunta.id: pergunta for pergunta in perguntas}

        itens_por_pergunta = {}
        for item in itens_data:
            pergunta = item.get('pergunta')
            if not pergunta:
                raise serializers.ValidationError({'itens': 'Cada resposta precisa de uma pergunta valida.'})
            if pergunta.id not in pergunta_map:
                raise serializers.ValidationError({'itens': f'Pergunta {pergunta.id} nao pertence ao ciclo.'})
            if pergunta.id in itens_por_pergunta:
                raise serializers.ValidationError({'itens': f'Pergunta {pergunta.id} duplicada.'})
            itens_por_pergunta[pergunta.id] = item

            self._validate_item_value(pergunta, item)

        if require_all:
            for pergunta in perguntas:
                if not pergunta.obrigatoria:
                    continue
                item = itens_por_pergunta.get(pergunta.id)
                if not item or not self._item_has_value(pergunta, item):
                    raise serializers.ValidationError({'itens': f'Pergunta obrigatoria sem resposta: {pergunta.id}.'})

    def _validate_item_value(self, pergunta, item):
        if pergunta.tipo in ['selecao_unica', 'selecao_multipla']:
            opcao = item.get('opcao')
            opcoes = item.get('opcoes') or []
            if opcao and opcao.pergunta_id != pergunta.id:
                raise serializers.ValidationError({'itens': f'Opcao invalida para pergunta {pergunta.id}.'})
            for opcao_item in opcoes:
                if opcao_item.pergunta_id != pergunta.id:
                    raise serializers.ValidationError({'itens': f'Opcao invalida para pergunta {pergunta.id}.'})

    def _item_has_value(self, pergunta, item):
        if pergunta.tipo == 'texto':
            return bool(item.get('valor_texto'))
        if pergunta.tipo == 'numero':
            return item.get('valor_numero') is not None
        if pergunta.tipo == 'booleano':
            return item.get('valor_booleano') is not None
        if pergunta.tipo == 'data':
            return item.get('valor_data') is not None
        if pergunta.tipo == 'selecao_unica':
            return item.get('opcao') is not None
        if pergunta.tipo == 'selecao_multipla':
            return bool(item.get('opcoes'))
        return False