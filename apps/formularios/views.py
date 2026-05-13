from rest_framework import viewsets
from .models import Ciclo, RespostaCiclo
from .serializers import CicloSerializer, RespostaCicloSerializer

# Create your views here.
class CicloViewSet(viewsets.ModelViewSet):
    queryset = Ciclo.objects.all()
    serializer_class = CicloSerializer

class RespostaCicloViewSet(viewsets.ModelViewSet):
    queryset = RespostaCiclo.objects.all()
    serializer_class = RespostaCicloSerializer