from rest_framework import generics
from rest_framework.response import Response # <-- 1. IMPORTANTE PARA RETORNAR O RANKING ORDENADO
from rest_framework.permissions import AllowAny # <-- 2. LIBERA O ACESSO PÚBLICO PARA O REACT
from .models import Presidente
from .serializers import PresidenteSerializer, CotaSerializer, PresidenteRankingSerializer # <-- 3. ADICIONE O NOVO SERIALIZER AQUI

# Lista E Cadastra presidentes
class ListaCreatePresidentesView(generics.ListCreateAPIView):
    queryset = Presidente.objects.all().order_by('-criado_em')
    serializer_class = PresidenteSerializer

# Gerenciar cotas do presidente
class AtualizarCotaView(generics.UpdateAPIView):
    queryset = Presidente.objects.all()
    serializer_class = CotaSerializer


# === ADICIONE A NOVA VIEW DAQUI PARA BAIXO ===

class RankingPresidentesView(generics.ListAPIView):
    serializer_class = PresidenteRankingSerializer
    permission_classes = [AllowAny] # Permite que o React busque sem travar no Token

    def get_queryset(self):
        # No ranking de engajamento, trazemos apenas os presidentes ativos
        return Presidente.objects.filter(ativo=True)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        
        # Ordena os presidentes pela 'pontuacao_engajamento' do maior para o menor
        dados_ordenados = sorted(
            serializer.data, 
            key=lambda k: k['pontuacao_engajamento'], 
            reverse=True
        )
        
        return Response(dados_ordenados)