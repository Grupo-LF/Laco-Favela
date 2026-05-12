from rest_framework import viewsets
from .models import Presidente
from .serializers import PresidenteSerializer

# Create your views here.

class PresidenteViewSet(viewsets.ModelViewSet):
    queryset = Presidente.objects.all()
    serializer_class = PresidenteSerializer