from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from rest_framework import status, viewsets,generics
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Familia
from .serializers import FamiliaSerializer, FamiliaRankingSerializer

# Create your views here.
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer

    def get_queryset(self):
        queryset = super().get_queryset().select_related('presidente')
        params = self.request.query_params

        status_param = params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        presidente_param = params.get('presidente')
        if presidente_param:
            queryset = queryset.filter(presidente_id=presidente_param)

        search_param = params.get('search')
        if search_param:
            queryset = queryset.filter(
                Q(nome_responsavel__icontains=search_param)
                | Q(comunidade__icontains=search_param)
                | Q(municipio__icontains=search_param)
            )

        ordering_param = params.get('ordering')
        if ordering_param:
            fields = [field.strip() for field in ordering_param.split(',') if field.strip()]
            if fields:
                queryset = queryset.order_by(*fields)

        return queryset

    def get_permissions(self):
        if settings.DEBUG and self.action in ['list', 'retrieve', 'set_status', 'bulk_set_status']:
            return [AllowAny()]
        if self.action in ['set_status', 'bulk_set_status']:
            return [IsAdminUser()]
        return super().get_permissions()

    @action(detail=True, methods=['patch'], url_path='set-status')
    def set_status(self, request, pk=None):
        familia = self.get_object()
        status_value = request.data.get('status')
        valid_status = dict(Familia.STATUS_CHOICES)
        if status_value not in valid_status:
            return Response({'detail': 'Status invalido.'}, status=status.HTTP_400_BAD_REQUEST)

        familia.status = status_value
        familia.aprovada = status_value == 'aprovada'
        familia.atualizado_em = timezone.now()
        familia.save(update_fields=['status', 'aprovada', 'atualizado_em'])
        return Response(self.get_serializer(familia).data)

    @action(detail=False, methods=['post'], url_path='bulk-set-status')
    def bulk_set_status(self, request):
        ids = request.data.get('ids', [])
        status_value = request.data.get('status')
        valid_status = dict(Familia.STATUS_CHOICES)

        if not isinstance(ids, list) or not ids:
            return Response({'detail': 'Informe uma lista de ids.'}, status=status.HTTP_400_BAD_REQUEST)
        if status_value not in valid_status:
            return Response({'detail': 'Status invalido.'}, status=status.HTTP_400_BAD_REQUEST)

        updated = Familia.objects.filter(id__in=ids).update(
            status=status_value,
            aprovada=status_value == 'aprovada',
            atualizado_em=timezone.now(),
        )
        return Response({'updated': updated})
class RankingFamiliasView(generics.ListAPIView):
    # Aqui usamos o serializer do ranking que calcula a pontuação
    serializer_class = FamiliaRankingSerializer
    permission_classes = [AllowAny] # 2. ADICIONE ESTA LINHA AQUI (Abre o acesso público)

    def get_queryset(self):
        # Traz apenas as famílias aprovadas para o ranking
        return Familia.objects.filter(aprovada=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Ordena os dados pela 'pontuacao_prioridade' de forma decrescente (reverse=True)
        dados_ordenados = sorted(
            serializer.data, 
            key=lambda k: k['pontuacao_prioridade'], 
            reverse=True
        )
        
        return Response(dados_ordenados)
