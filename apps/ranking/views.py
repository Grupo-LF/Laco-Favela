from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from apps.presidentes.models import Presidente
from .serializers import RankingPresidenteSerializer


class RankingPresidentesView(generics.ListAPIView):

    serializer_class = RankingPresidenteSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Presidente.objects.filter(ativo=True)

        comunidade = self.request.query_params.get('comunidade')
        if comunidade:
            queryset = queryset.filter(comunidade__icontains=comunidade)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        # Ordena por total_familias
        dados_ordenados = sorted(
            serializer.data,
            key=lambda x: (x['total_familias'], x['total_pessoas']),
            reverse=True
        )

        for index, item in enumerate(dados_ordenados, start=1):
            item['posicao'] = index

        return Response({
            'total_presidentes': len(dados_ordenados),
            'ranking': dados_ordenados,
        })