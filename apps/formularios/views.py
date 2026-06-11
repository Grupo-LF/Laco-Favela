from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Ciclo, RespostaCiclo
from .serializers import (
    CicloReadSerializer,
    CicloWriteSerializer,
    RespostaCicloReadSerializer,
    RespostaCicloWriteSerializer,
)

# Create your views here.
class CicloViewSet(viewsets.ModelViewSet):
    queryset = Ciclo.objects.all().prefetch_related('perguntas__opcoes')
    serializer_class = CicloReadSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CicloReadSerializer
        return CicloWriteSerializer

    def get_permissions(self):
        if self.action in ['publish', 'close']:
            return [IsAdminUser()]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        ciclo = self.get_object()
        if ciclo.status != 'rascunho':
            return Response({'detail': 'Ciclo nao pode ser editado apos publicacao.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        ciclo = self.get_object()
        if ciclo.status != 'rascunho':
            return Response({'detail': 'Ciclo nao pode ser editado apos publicacao.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        ciclo = self.get_object()
        if ciclo.status != 'rascunho':
            return Response({'detail': 'Ciclo nao pode ser removido apos publicacao.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='publish')
    def publish(self, request, pk=None):
        ciclo = self.get_object()
        if ciclo.status == 'encerrado':
            return Response({'detail': 'Ciclo ja encerrado.'}, status=status.HTTP_400_BAD_REQUEST)
        ciclo.status = 'ativo'
        ciclo.publicado_em = ciclo.publicado_em or timezone.now()
        ciclo.save(update_fields=['status', 'publicado_em'])
        return Response(CicloReadSerializer(ciclo).data)

    @action(detail=True, methods=['post'], url_path='close')
    def close(self, request, pk=None):
        ciclo = self.get_object()
        ciclo.status = 'encerrado'
        ciclo.encerrado_em = ciclo.encerrado_em or timezone.now()
        ciclo.save(update_fields=['status', 'encerrado_em'])
        return Response(CicloReadSerializer(ciclo).data)


class RespostaCicloViewSet(viewsets.ModelViewSet):
    queryset = RespostaCiclo.objects.all().select_related('ciclo', 'presidente', 'familia').prefetch_related('itens__opcoes', 'itens__opcao', 'itens__pergunta')
    serializer_class = RespostaCicloReadSerializer

    def get_permissions(self):
        if settings.DEBUG and self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        ciclo_param = params.get('ciclo')
        if ciclo_param:
            queryset = queryset.filter(ciclo_id=ciclo_param)

        familia_param = params.get('familia')
        if familia_param:
            queryset = queryset.filter(familia_id=familia_param)

        status_param = params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        return queryset

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RespostaCicloReadSerializer
        return RespostaCicloWriteSerializer

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk=None):
        resposta = self.get_object()
        if resposta.status == 'enviado':
            return Response({'detail': 'Resposta ja enviada.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RespostaCicloWriteSerializer(
            resposta,
            data=request.data,
            context={'submit': True},
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        resposta.status = 'enviado'
        resposta.enviado_em = timezone.now()
        resposta.save(update_fields=['status', 'enviado_em'])
        return Response(RespostaCicloReadSerializer(resposta).data)

    # 👇 ADICIONE ESTE MÉTODO
    @action(detail=True, methods=['post'], url_path='notificar')
    def notificar(self, request, pk=None):
        """
        Marca uma resposta como completa e registra a data/hora atual
        """
        resposta = self.get_object()
        
        # Se já estiver completa, retorna erro
        if resposta.status == 'completo':
            return Response(
                {'detail': 'Esta resposta já foi completada anteriormente.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Atualiza status e datas
        resposta.status = 'completo'
        resposta.enviado_em = timezone.now()  # Pega a hora atual do servidor
        resposta.save(update_fields=['status', 'enviado_em', 'atualizado_em'])
        
        # Serializa e retorna a resposta atualizada
        serializer = self.get_serializer(resposta)
        return Response(serializer.data)