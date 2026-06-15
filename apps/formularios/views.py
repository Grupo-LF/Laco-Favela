from django.conf import settings
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from apps.formularios.models import Notificacao
from apps.formularios.serializers import NotificacaoSerializer
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

class NotificacaoViewSet(viewsets.ModelViewSet):
    queryset = Notificacao.objects.all()
    serializer_class = NotificacaoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtra as notificações baseadas no parâmetro enviado pelo Front (ID da Família)
        familia_param = self.request.query_params.get('familia')
        if familia_param:
            queryset = queryset.filter(familia_id=familia_param)
        return queryset

    @action(detail=False, methods=['post'], url_path='marcar-todas-lidas')
    def marcar_todas_lidas(self, request):
        familia_id = request.data.get('familia')
        if not familia_id:
            return Response({'detail': 'ID da família não informado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        Notificacao.objects.filter(familia_id=familia_id, lida=False).update(lida=True)
        return Response({'status': 'Sucesso'})