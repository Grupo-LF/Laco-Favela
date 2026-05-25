from rest_framework import generics
from .models import Presidente
from .serializers import PresidenteSerializer
from .serializers import CotaSerializer

# Lista E Cadastra presidentes
class ListaCreatePresidentesView(generics.ListCreateAPIView):
    queryset = Presidente.objects.all().order_by('-criado_em')
    serializer_class = PresidenteSerializer

#Gerenciar cotas do presidente
class AtualizarCotaView(generics.UpdateAPIView):
    queryset = Presidente.objects.all()
    serializer_class = CotaSerializer