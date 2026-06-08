from django.urls import path
from .views import (
    ListaCreatePresidentesView, 
    AtualizarCotaView, 
    RankingPresidentesView, 
    AtualizarPresidenteView,
    AdminStatusCotasView,
    PresidenteHomeView
)

urlpatterns = [
    # Listar todos os presidentes e criar novo presidente
    path('presidentes/', ListaCreatePresidentesView.as_view(), name='presidentes-list-create'),
    
    # Ranking de engajamento dos presidentes
    path('presidentes/ranking/', RankingPresidentesView.as_view(), name='presidentes-ranking'),
    
    # Atualizar apenas a cota de um presidente específico
    path('presidentes/<int:pk>/cota/', AtualizarCotaView.as_view(), name='presidentes-cota'),
    
    # Atualizar qualquer campo do presidente (PATCH)
    path('presidentes/<int:pk>/', AtualizarPresidenteView.as_view(), name='presidentes-update'),
    
    # Admin: Status de cotas de todos os presidentes
    path('admin/cotas/', AdminStatusCotasView.as_view(), name='admin-cotas'),
    
    # Presidente: Home do presidente logado
    path('home/', PresidenteHomeView.as_view(), name='presidente-home'),
]