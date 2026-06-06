from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Presidente
from .serializers import PresidenteSerializer, CotaSerializer, PresidenteRankingSerializer

# Lista E Cadastra presidentes
class ListaCreatePresidentesView(generics.ListCreateAPIView):
    queryset = Presidente.objects.all().order_by('-criado_em')
    serializer_class = PresidenteSerializer


# Gerenciar cotas do presidente (apenas cota)
class AtualizarCotaView(generics.UpdateAPIView):
    queryset = Presidente.objects.all()
    serializer_class = CotaSerializer


# ========== NOVA VIEW - Editar qualquer campo do presidente ==========
class AtualizarPresidenteView(generics.RetrieveUpdateAPIView):
    queryset = Presidente.objects.all()
    serializer_class = PresidenteSerializer
    permission_classes = [AllowAny]  # Permite edição sem autenticação (ou troque se precisar de token)


# Ranking de presidentes
class RankingPresidentesView(generics.ListAPIView):
    serializer_class = PresidenteRankingSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Presidente.objects.filter(ativo=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Ordena pelo score_final (melhor)
        dados_ordenados = sorted(
            serializer.data, 
            key=lambda k: k.get('score_final', 0), 
            reverse=True
        )
        
        return Response(dados_ordenados)