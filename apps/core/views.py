from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from apps.core.models import PerfilUsuario
# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if not user:
        return Response({'error': 'Credenciais inválidas'}, status=400)
    
    token, _ = Token.objects.get_or_create(user=user)
    
    try:
        tipo = user.perfil.tipo
    except PerfilUsuario.DoesNotExist:
        tipo = 'admin' if user.is_staff else 'presidente'
    
    return Response({
        'token': token.key,
        'tipo': tipo,
        'nome': user.get_full_name() or user.username,
    })


# 2. NOVA VIEW: Dashboard do Morador (Dados para o Figma)
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_morador(request):
    dados_teste = {
        "usuario": {
            "nome": "Pedro"
        },
        "eventos": [
            {"id": 1, "titulo": "Reunião Comunitária", "data_detalhe": "11/06/2026 - 18h no Centro Comunitário de Fitilho"},
            {"id": 2, "titulo": "Ação para Crianças", "data_detalhe": "18/06/2026 - 16h na Praça Central Laço"}
        ],
        "engajamento_nivel": "Nível 3 - Engajado",
        "engajamento_pontos": "67/100 pontos",
        "engajamento_porcentagem": 67
    }
    return Response(dados_teste)

# 3. NOVA VIEW: Notificações do Morador (Dados para o Figma)
@api_view(['GET'])
@permission_classes([AllowAny])
def lista_notificacoes(request):
    notificacoes_teste = [
        {
            "id": 1,
            "tipo": "reuniao",
            "titulo": "Reunião da comunidade",
            "mensagem": "Amanhã às 18h no Centro Comunitário – Assunto: Melhorias na praça central e iluminação.",
            "tempo_passado": "Hoje, 09:14",
            "lida": False
        },
        {
            "id": 2,
            "tipo": "status",
            "titulo": "Status Atualizado",
            "mensagem": "Sua situação foi atualizada para Aprovado. Confira os detalhes em Acompanhamento.",
            "tempo_passado": "Ontem, 14:32",
            "lida": False
        },
        {
            "id": 3,
            "tipo": "acao",
            "titulo": "Nova Ação Disponível",
            "mensagem": "Uma nova ação da comunidade está disponível para você participar. Acesse Acompanhamento para saber mais.",
            "tempo_passado": "Ontem, 11:00",
            "lida": False
        },
        {
            "id": 4,
            "tipo": "palestra",
            "titulo": "Palestra: Direitos do Morador",
            "mensagem": "O evento vai ser realizado na praça central às 16h. Contamos com a sua participação!",
            "tempo_passado": "3 dias atrás",
            "lida": True
        },
        {
            "id": 5,
            "tipo": "ranking",
            "titulo": "Você subiu no Ranking!",
            "mensagem": "Parabéns! Você alcançou o Nível 3 de engajamento na comunidade.",
            "tempo_passado": "1 semana atrás",
            "lida": True
        }
    ]
    return Response(notificacoes_teste)

@api_view(['POST'])
@permission_classes([AllowAny])
def marcar_todas_lidas(request):
    # Por enquanto retorna sucesso (dados ainda são mock)
    return Response({'status': 'ok', 'mensagem': 'Todas as notificações foram marcadas como lidas.'})