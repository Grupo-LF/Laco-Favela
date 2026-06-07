from django.urls import path
from .views import ListaCreatePresidentesView, AtualizarCotaView, RankingPresidentesView, AtualizarPresidenteView

urlpatterns = [
    # Listar todos os presidentes e criar novo presidente
    path('presidentes/', ListaCreatePresidentesView.as_view(), name='presidentes-list-create'),
    
    # Ranking de engajamento dos presidentes
    path('presidentes/ranking/', RankingPresidentesView.as_view(), name='presidentes-ranking'),
    
    # Atualizar apenas a cota de um presidente específico
    path('presidentes/<int:pk>/cota/', AtualizarCotaView.as_view(), name='presidentes-cota'),
    
    # NOVA URL: Atualizar qualquer campo do presidente (PATCH)
    path('presidentes/<int:pk>/', AtualizarPresidenteView.as_view(), name='presidentes-update'),
]
