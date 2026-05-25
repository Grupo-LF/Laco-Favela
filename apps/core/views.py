from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

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
    tipo = 'admin' if user.is_staff else 'presidente'

    return Response({
        'token': token.key,
        'tipo': tipo,
        'nome': user.get_full_name() or user.username,
    })