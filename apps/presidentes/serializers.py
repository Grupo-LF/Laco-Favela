from rest_framework import serializers
from .models import Presidente

class PresidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presidente
        fields = '__all__'

class CotaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Presidente
        fields = ['cota']