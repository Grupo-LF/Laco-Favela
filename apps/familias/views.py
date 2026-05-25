from rest_framework import generics, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # 1. ADICIONE ESTA LINHA AQUI
from .models import Familia
from .serializers import FamiliaSerializer, FamiliaRankingSerializer

# Create your views here.
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer

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