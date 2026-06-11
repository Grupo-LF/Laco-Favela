from django.urls import path
from rest_framework import viewsets
from rest_framework.routers import DefaultRouter

from .views import (
    FamiliaCreateView,
    ListaCreatePresidentesView,
    AtualizarCotaView,
    RankingPresidentesView,
    AtualizarPresidenteView,
    AdminStatusCotasView,
    PresidenteHomeView,
    RegistrarVisitaView
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
    path('admin/dashboard/cotas/', AdminStatusCotasView.as_view(), name='admin-status-cotas'),
    
    # Presidente: Home do presidente logado
    path('presidentes/me/home/', PresidenteHomeView.as_view(), name='presidente-home'),
    path('familias/cadastrar/', FamiliaCreateView.as_view(), name='cadastrar-familia'),

    # Presidente: Registrar visitas feitas
    path('presidentes/visita/registrar/', RegistrarVisitaView.as_view(), name='registrar-visita'),



]
