from django.urls import path
from .views import ListaCreatePresidentesView, AtualizarCotaView, RankingPresidentesView, AdminStatusCotasView, PresidenteHomeView
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets


urlpatterns = [

    path('presidentes/', ListaCreatePresidentesView.as_view()), 
    path('presidentes/ranking/', RankingPresidentesView.as_view()),
    path('presidentes/<int:pk>/', AtualizarCotaView.as_view()),
    path('admin/dashboard/cotas/', AdminStatusCotasView.as_view(), name='admin-status-cotas'),
    path('presidentes/me/home/', PresidenteHomeView.as_view(), name='presidente-home'),




]
