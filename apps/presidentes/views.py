from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.response import Response 
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework.views import APIView
from .models import Presidente
from .serializers import PresidenteSerializer, CotaSerializer, PresidenteRankingSerializer 
from apps.formularios.models import Ciclo, RespostaCiclo, RespostaItem, Pergunta
from apps.familias.models import Familia
from django.utils import timezone
from django.db import transaction

class RegistrarVisitaView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic # Garante que salva tudo ou não salva nada
    def post(self, request):
        try:
            # 1. Identificar o Presidente logado
            presidente = Presidente.objects.filter(user=request.user).first()
            if not presidente:
                return Response({'erro': 'Usuário não está vinculado a um presidente.'}, status=status.HTTP_403_FORBIDDEN)

            # 2. Identificar o Ciclo Ativo
            ciclo_ativo = Ciclo.objects.filter(status='ativo').first()
            if not ciclo_ativo:
                return Response({'erro': 'Não há nenhum ciclo ativo no momento.'}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Validar a Família Visitada
            familia_id = request.data.get('familia_id')
            familia = Familia.objects.filter(id=familia_id, presidente=presidente).first()
            if not familia:
                return Response({'erro': 'Família não encontrada ou não pertence a este presidente.'}, status=status.HTTP_404_NOT_FOUND)

            # 4. Verificar se a visita já foi feita neste ciclo
            # Protege contra duplo envio baseado na constraint unique_resposta_por_familia_ciclo
            if RespostaCiclo.objects.filter(ciclo=ciclo_ativo, familia=familia).exists():
                return Response({'erro': 'Esta família já foi visitada no ciclo atual.'}, status=status.HTTP_400_BAD_REQUEST)

            # 5. Criar o registro geral da Visita (RespostaCiclo)
            # Ao salvar com status 'completo', a cota já vai contabilizar automaticamente!
            resposta_ciclo = RespostaCiclo.objects.create(
                ciclo=ciclo_ativo,
                presidente=presidente,
                familia=familia,
                status='completo', 
                observacao=request.data.get('observacao', '')
            )

            # 6. Salvar cada resposta individual (RespostaItem)
            respostas_data = request.data.get('respostas', [])
            
            for item in respostas_data:
                pergunta_id = item.get('pergunta_id')
                pergunta = Pergunta.objects.filter(id=pergunta_id, ciclo=ciclo_ativo).first()
                
                if pergunta:
                    RespostaItem.objects.create(
                        resposta=resposta_ciclo,
                        pergunta=pergunta,
                        valor_texto=item.get('valor_texto', ''),
                        valor_numero=item.get('valor_numero', None),
                        valor_booleano=item.get('valor_booleano', None),
                        valor_data=item.get('valor_data', None),
                        opcao_id=item.get('opcao_id', None)
                        # Nota: Se tiver 'selecao_multipla', você precisará adicionar a lógica para popular a relação ManyToMany 'opcoes' aqui.
                    )

            return Response({'sucesso': 'Visita registrada com sucesso!'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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