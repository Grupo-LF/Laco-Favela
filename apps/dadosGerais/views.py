from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny # Mudar quando sair do desenvolvimento
from django.db.models import Sum, Count
from apps.familias.models import Familia
from apps.presidentes.models import Presidente


class dadosGeraisONGVIEW(APIView):
    permission_classes = [AllowAny] # Permite qualuqer um entrar na url, mudar quando sair do desenvolvimento

    def get(self, request):
        # Total de pessoas
        total_pessoas = Familia.objects.aggregate(
            total=Sum('num_membros')
        )['total'] or 0

        # Total de famílias
        total_familias = Familia.objects.count()

        # Famílias por presidente
        familias_por_presidente = (
            Presidente.objects
            .filter(ativo=True)
            .annotate(
                quantidade_familias=Count('familias'),
                total_pessoas=Sum('familias__num_membros')
            )
            .values('id', 'nome', 'comunidade', 'quantidade_familias', 'total_pessoas')
            .order_by('-quantidade_familias')
        )

        # Pessoas por comunidade
        pessoas_por_comunidade = (
            Familia.objects
            .values('comunidade')
            .annotate(
                total_pessoas=Sum('num_membros'),
                total_familias=Count('id')
            )
            .order_by('-total_pessoas')
        )

        # Famílias por comunidade
        familias_por_comunidade = (
            Familia.objects
            .values('comunidade')
            .annotate(total=Count('id'))
            .order_by('-total')
        )

        return Response({
            'total_pessoas': total_pessoas,
            'total_familias': total_familias,
            'familias_por_presidente': list(familias_por_presidente),
            'pessoas_por_comunidade': list(pessoas_por_comunidade),
            'familias_por_comunidade': list(familias_por_comunidade),
        })
