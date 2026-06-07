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


# ===== ENDPOINTS PARA O SISTEMA DE COTAS =====

class AdminStatusCotasView(APIView):
    permission_classes = [AllowAny] # TODO: Mudar para IsAuthenticated e verificar se é admin

    def get(self, request):
        try:
            # Busca o ciclo ativo
            ciclo_ativo = Ciclo.objects.filter(status='ativo').first()
            
            if not ciclo_ativo:
                return Response(
                    {'detalhe': 'Nenhum ciclo ativo encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Conta as respostas de formulários do presidente
            presidentes = Presidente.objects.filter(ativo=True).annotate(
                respostas_completas = Count(
                    'respostaciclo', 
                    filter=Q(respostaciclo__ciclo=ciclo_ativo, respostaciclo__status__in=['completo', 'enviado'])
                )
            ).order_by('nome')
            
            dados_cotas = []
            
            for presidente in presidentes:
                meta = presidente.cota
                atual = presidente.respostas_completas 
                percentual = int((atual / meta * 100)) if meta > 0 else 0
                
                dados_cotas.append({
                    'nome': presidente.nome,
                    'atual': atual,
                    'meta': meta,
                    'percentual': min(percentual, 100)
                })
            
            return Response({
                'ciclo': ciclo_ativo.titulo,
                'cotas': dados_cotas
            })
            
        except Exception as e:
            return Response(
                {'erro': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def get(self, request):
        try:
            # Busca o ciclo ativo
            ciclo_ativo = Ciclo.objects.filter(status='ativo').first()
            
            if not ciclo_ativo:
                return Response(
                    {'detalhe': 'Nenhum ciclo ativo encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Conta as respostas de formulários do presidente
            presidentes = Presidente.objects.filter(ativo=True).annotate(
                respostas_completas = Count(
                    'respostaciclo', 
                    filter=Q(respostaciclo__ciclo=ciclo_ativo, respostaciclo__status__in=['completo', 'enviado'])
                )
            ).order_by('nome')
            
            dados_cotas = []
            
            for presidente in presidentes:
                meta = presidente.cota
                # Pega a contagem gerada pelo annotate
                atual = presidente.respostas_completas 
                percentual = int((atual / meta * 100)) if meta > 0 else 0
                
                dados_cotas.append({
                    'nome': presidente.nome,
                    'atual': atual,
                    'meta': meta,
                    'percentual': min(percentual, 100)
                })
            
            return Response({
                'ciclo': ciclo_ativo.titulo,
                'cotas': dados_cotas
            })
            
        except Exception as e:
            return Response(
                {'erro': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PresidenteHomeView(APIView):
    """
    Retorna os dados do presidente logado para sua página home.
    Inclui progresso da cota, formulários pendentes e últimas visitas.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Busca o presidente vinculado ao usuário logado
            presidente = Presidente.objects.filter(user=request.user).first()
            
            # Se o filtro retornar None, o vínculo realmente não existe no banco
            if not presidente:
                return Response(
                    {'detalhe': 'Usuário não está vinculado a um presidente'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Busca o ciclo ativo
            ciclo_ativo = Ciclo.objects.filter(status='ativo').first()
            
            if not ciclo_ativo:
                return Response(
                    {'detalhe': 'Nenhum ciclo ativo encontrado'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Conta as respostas completas/enviadas do presidente no ciclo ativo
            respostas_completas = RespostaCiclo.objects.filter(
                ciclo=ciclo_ativo,
                presidente=presidente,
                status__in=['completo', 'enviado']
            ).count()
            
            # Calcula dias restantes
            prazo_date = ciclo_ativo.prazo
            hoje = timezone.now().date() 
            dias_restantes = max(0, (prazo_date - hoje).days)
            
            # Monta a resposta 
            cota_data = {
                'visitasRealizadas': respostas_completas,
                'meta': presidente.cota,
                'faltamParaMeta': max(0, presidente.cota - respostas_completas), 
                'diasRestantes': dias_restantes,
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
                    'titulo': ciclo_ativo.titulo,
                    'prazo': ciclo_ativo.prazo
                }
            })
            
        except Exception as e:
            return Response(
                {'erro': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )