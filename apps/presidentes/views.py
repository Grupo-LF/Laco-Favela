from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Count, Q
from django.utils import timezone
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


# Editar qualquer campo do presidente
class AtualizarPresidenteView(generics.RetrieveUpdateAPIView):
    queryset = Presidente.objects.all()
    serializer_class = PresidenteSerializer
    permission_classes = [AllowAny]


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


# Status de Cotas (simplificado sem Ciclo)
class AdminStatusCotasView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            presidentes = Presidente.objects.filter(ativo=True).order_by('nome')
            
            dados_cotas = []
            
            for presidente in presidentes:
                meta = presidente.cota
                # Usando visitas como atual (ou outro campo que você tenha)
                atual = presidente.visitas  # ou 0 se não tiver
                percentual = int((atual / meta * 100)) if meta > 0 else 0
                
                dados_cotas.append({
                    'nome': presidente.nome,
                    'atual': atual,
                    'meta': meta,
                    'percentual': min(percentual, 100)
                })
            
            return Response({
                'ciclo': 'Ciclo Atual',
                'cotas': dados_cotas
            })
            
        except Exception as e:
            return Response(
                {'erro': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Home do Presidente (simplificado sem Ciclo)
class PresidenteHomeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            presidente = Presidente.objects.filter(user=request.user).first()
            
            if not presidente:
                return Response(
                    {'detalhe': 'Usuário não está vinculado a um presidente'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Calcula dados da cota
            meta = presidente.cota
            atual = presidente.visitas  # ou outro campo
            faltam = max(0, meta - atual)
            percentual = int((atual / meta * 100)) if meta > 0 else 0
            
            cota_data = {
                'visitasRealizadas': atual,
                'meta': meta,
                'percentual': min(percentual, 100),
                'faltamParaMeta': faltam,
                'diasRestantes': 30,  # Valor padrão
                'posicaoRanking': None
            }
            
            return Response({
                'usuario': {
                    'nome': presidente.nome,
                    'comunidade': presidente.comunidade,
                    'ativo': presidente.ativo
                },
                'cota': cota_data,
                'ciclo': {
                    'titulo': 'Ciclo Atual',
                    'prazo': timezone.now().date() + timezone.timedelta(days=30)
                }
            })
            
        except Exception as e:
            return Response(
                {'erro': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )