from rest_framework import serializers
from .models import Ciclo, RespostaCiclo

class CicloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ciclo
        fields = '__all__'

class RespostaCicloSerializer(serializers.ModelSerializer):
    class Meta:
        model = RespostaCiclo
        fields = '__all__'