from .models import Familia
from django.db.models import Q
from django.conf import settings
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.decorators import action
from apps.formularios.models import Notificacao
from rest_framework import status, viewsets, generics
from apps.formularios.serializers import NotificacaoSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import FamiliaSerializer, FamiliaRankingSerializer, FamiliaRankingParticipacaoSerializer


class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer

    def get_queryset(self):

        queryset = super().get_queryset().select_related('presidente')
        user = self.request.user

        if not user.is_staff:
            if hasattr(user, 'presidente_profile'):
                queryset = queryset.filter(presidente=user.presidente_profile)
            else:
                queryset = queryset.filter(user=user)

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
        if self.action in ['list', 'retrieve']:
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
            return Response({'detail': 'Status invalido.'}, status=status.HTTP_400_BAD_REQUEST)

        familia.status = status_value
        familia.aprovada = status_value == 'aprovada'
        familia.atualizado_em = timezone.now()
        familia.save(update_fields=['status', 'aprovada', 'atualizado_em'])

        # --- DISPARO DA NOTIFICAÇÃO INDIVIDUAL ---
        status_limpo = status_value.replace('_', ' ').title()
        Notificacao.objects.create(
            familia=familia,
            titulo="Status Atualizado",
            mensagem=f"Sua situação foi atualizada para {status_limpo}. Confira os detalhes em Acompanhamento.",
            categoria='status'
        )

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

        familias = Familia.objects.filter(id__in=ids)
        notificacoes_lista = []
        status_limpo = status_value.replace('_', ' ').title()

        for familia in familias:
            familia.status = status_value
            familia.aprovada = status_value == 'aprovada'
            familia.atualizado_em = timezone.now()
            familia.save()
            
            notificacoes_lista.append(Notificacao(
                familia=familia,
                titulo="Status Atualizado",
                mensagem=f"Sua situação foi atualizada para {status_limpo}. Confira os detalhes em Acompanhamento.",
                categoria='status'
            ))
            
        if notificacoes_lista:
            Notificacao.objects.bulk_create(notificacoes_lista)

        return Response({'updated': familias.count()})


class RankingFamiliasView(generics.ListAPIView):
    serializer_class = FamiliaRankingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Familia.objects.filter(aprovada=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        dados_ordenados = sorted(
            serializer.data, 
            key=lambda k: k['pontuacao_prioridade'], 
            reverse=True
        )
        
        return Response(dados_ordenados)

class RankingParticipacaoView(generics.ListAPIView):
    serializer_class = FamiliaRankingParticipacaoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Familia.objects.filter(aprovada=True).order_by('-pontos_participacao')