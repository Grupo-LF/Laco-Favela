from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FamiliaViewSet, RankingFamiliasView, RankingParticipacaoView, StatusMeuCadastroView # Importe a view do ranking aqui

router = DefaultRouter()
router.register(r'familias', FamiliaViewSet)

urlpatterns = [
    # 1. Adicionamos a rota do ranking ANTES das urls do router
    path('familias/ranking/', RankingFamiliasView.as_view(), name='familia-ranking'),

    # ADICIONADO: A nova rota para o Ranking de Participação/Engajamento dos moradores
    path('familias/ranking-participacao/', RankingParticipacaoView.as_view(), name='familia-ranking-participacao'),

    path('familias/meu-status/', StatusMeuCadastroView.as_view(), name='meu-status'),
    
    # 2. Incluímos todas as rotas que o seu router gerou automaticamente
    path('', include(router.urls)),
]