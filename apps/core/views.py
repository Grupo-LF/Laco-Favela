from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

# 1. View de Login Existente
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if not user:
        return Response({'error': 'Credenciais inválidas'}, status=400)

    token, _ = Token.objects.get_or_create(user=user)
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