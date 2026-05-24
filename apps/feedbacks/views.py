from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.filters import OrderingFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Feedback
from .serializers import FeedbackSerializer
from django_filters.rest_framework import DjangoFilterBackend


# Create your views here.
class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    
    filter_backends = [OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['lido', 'tipo']
    ordering_fields = ['criado_em']
    ordering = ['-criado_em']

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['patch'])
    def marcar_lido(self, request, pk=None):
        feedback = self.get_object()
        feedback.lido = True
        feedback.save()
        return Response({'status': 'Feedback marcado como lido com sucesso!'})