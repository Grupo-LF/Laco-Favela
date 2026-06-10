from django.conf import settings
from django.db.models import Q, F, Case, When, Value, IntegerField
from django.db.models.functions import Round
from django.utils import timezone
from rest_framework import status, viewsets, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import Familia
from .serializers import FamiliaSerializer, FamiliaRankingSerializer

# Create your views here.
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('presidente')
        
        # Anotar o score calculado para poder ordenar
        queryset = queryset.annotate(
            score_calculado=Round(
                (F('eventos_compareceu') * 100.0 / F('total_eventos')),
                output_field=IntegerField()
            )
        )
        
        params = self.request.query_params

        # Filtro por status
        status_param = params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filtro por presidente
        presidente_param = params.get('presidente')
        if presidente_param:
            queryset = queryset.filter(presidente_id=presidente_param)

        # Filtro por perfil
        perfil_param = params.get('perfil')
        if perfil_param:
            queryset = queryset.filter(perfil=perfil_param)

        # Busca por nome responsável ou telefone
        search_param = params.get('search')
        if search_param:
            queryset = queryset.filter(
                Q(nome_responsavel__icontains=search_param) |
                Q(telefone__icontains=search_param)
            )

        # Ordenação (ex: ?ordering=-score_calculado,status)
        ordering_param = params.get('ordering')
        if ordering_param:
            # Substitui 'score' por 'score_calculado' se necessário
            ordering_param = ordering_param.replace('score', 'score_calculado').replace('-score', '-score_calculado')
            fields = [field.strip() for field in ordering_param.split(',') if field.strip()]
            if fields:
                queryset = queryset.order_by(*fields)
        else:
            # Ordenação padrão por score decrescente (ranking)
            queryset = queryset.order_by('-score_calculado')

        return queryset

    def get_permissions(self):
        if settings.DEBUG and self.action in ['list', 'retrieve', 'set_status', 'bulk_set_status', 'ranking']:
            return [IsAuthenticated()]
        if self.action in ['set_status', 'bulk_set_status']:
            return [IsAdminUser()]
        return super().get_permissions()

    @action(detail=True, methods=['patch'], url_path='set-status')
    def set_status(self, request, pk=None):
        familia = self.get_object()
        status_value = request.data.get('status')
        valid_status = dict(Familia.STATUS_CHOICES)
        
        if status_value not in valid_status:
            return Response({'detail': 'Status inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        familia.status = status_value
        familia.save(update_fields=['status'])
        
        return Response(self.get_serializer(familia).data)

    @action(detail=False, methods=['post'], url_path='bulk-set-status')
    def bulk_set_status(self, request):
        ids = request.data.get('ids', [])
        status_value = request.data.get('status')
        valid_status = dict(Familia.STATUS_CHOICES)

        if not isinstance(ids, list) or not ids:
            return Response({'detail': 'Informe uma lista de ids.'}, status=status.HTTP_400_BAD_REQUEST)
        if status_value not in valid_status:
            return Response({'detail': 'Status inválido.'}, status=status.HTTP_400_BAD_REQUEST)

        updated = Familia.objects.filter(id__in=ids).update(status=status_value)
        
        return Response({
            'updated': updated,
            'message': f'{updated} família(s) atualizada(s) para {status_value}'
        })

    @action(detail=False, methods=['patch'], url_path='bulk-update-participacao')
    def bulk_update_participacao(self, request):
        """
        Atualiza a participação de várias famílias de uma vez
        Exemplo: POST /familias/bulk-update-participacao/
        {
            "ids": [1, 2, 3],
            "eventos_compareceu": 5
        }
        """
        ids = request.data.get('ids', [])
        eventos_compareceu = request.data.get('eventos_compareceu')

        if not isinstance(ids, list) or not ids:
            return Response({'detail': 'Informe uma lista de ids.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if eventos_compareceu is None:
            return Response({'detail': 'Informe eventos_compareceu.'}, status=status.HTTP_400_BAD_REQUEST)

        # Valida se eventos_compareceu não é maior que total_eventos para cada família
        familias = Familia.objects.filter(id__in=ids)
        invalid = []
        
        for familia in familias:
            if eventos_compareceu > familia.total_eventos:
                invalid.append(familia.id)
        
        if invalid:
            return Response({
                'detail': f'eventos_compareceu ({eventos_compareceu}) não pode ser maior que total_eventos para as famílias: {invalid}'
            }, status=status.HTTP_400_BAD_REQUEST)

        updated = familias.update(eventos_compareceu=eventos_compareceu)
        
        return Response({
            'updated': updated,
            'message': f'{updated} família(s) atualizada(s) com {eventos_compareceu} eventos'
        })

    @action(detail=False, methods=['get'], url_path='ranking')
    def ranking(self, request):
        """
        Endpoint específico para o ranking de famílias
        Ordenado por score decrescente
        """
        queryset = self.get_queryset().order_by('-score_calculado')
        
        # Limitar quantidade se necessário
        limit = request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        serializer = FamiliaRankingSerializer(queryset, many=True)
        return Response(serializer.data)


class RankingFamiliasView(generics.ListAPIView):
    """
    View para o ranking de famílias baseado no score de engajamento
    """
    serializer_class = FamiliaRankingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Anotar o score calculado
        queryset = Familia.objects.filter(status='aprovada').annotate(
            score_calculado=Round(
                (F('eventos_compareceu') * 100.0 / F('total_eventos')),
                output_field=IntegerField()
            )
        ).order_by('-score_calculado')
        
        # Filtro opcional por perfil
        perfil = self.request.query_params.get('perfil')
        if perfil:
            queryset = queryset.filter(perfil=perfil)
        
        # Limite opcional
        limit = self.request.query_params.get('limit')
        if limit:
            try:
                queryset = queryset[:int(limit)]
            except ValueError:
                pass
        
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Calcular posição (rank) para cada família
        dados_com_rank = []
        for index, item in enumerate(serializer.data, start=1):
            item['rank'] = index
            dados_com_rank.append(item)
        
        return Response({
            'count': len(dados_com_rank),
            'results': dados_com_rank
        })


class ParticipacaoUpdateView(generics.UpdateAPIView):
    """
    View específica para atualizar apenas a participação de uma família
    """
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer
    permission_classes = [IsAdminUser]

    def partial_update(self, request, *args, **kwargs):
        familia = self.get_object()
        eventos_compareceu = request.data.get('eventos_compareceu')
        
        if eventos_compareceu is None:
            return Response({'detail': 'Informe eventos_compareceu.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if eventos_compareceu > familia.total_eventos:
            return Response({
                'detail': f'eventos_compareceu ({eventos_compareceu}) não pode ser maior que total_eventos ({familia.total_eventos})'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        familia.eventos_compareceu = eventos_compareceu
        familia.save(update_fields=['eventos_compareceu'])
        
        return Response({
            'id': familia.id,
            'nome_responsavel': familia.nome_responsavel,
            'eventos_compareceu': familia.eventos_compareceu,
            'total_eventos': familia.total_eventos,
            'score': familia.score,
            'participacao_percentual': familia.participacao_percentual
        })