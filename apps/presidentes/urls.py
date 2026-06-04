from django.urls import path
from .views import ListaCreatePresidentesView, AtualizarCotaView, RankingPresidentesView
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets


urlpatterns = [

    path('presidentes/', ListaCreatePresidentesView.as_view()), 
    path('presidentes/ranking/', RankingPresidentesView.as_view()),
    path('presidentes/<int:pk>/', AtualizarCotaView.as_view()),




]
