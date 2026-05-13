from rest_framework import viewsets
from .models import Familia
from .serializers import FamiliaSerializer

# Create your views here.
class FamiliaViewSet(viewsets.ModelViewSet):
    queryset = Familia.objects.all()
    serializer_class = FamiliaSerializer