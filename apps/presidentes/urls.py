from django.urls import path
from .views import ListaCreatePresidentesView, AtualizarCotaView, RankingPresidentesView
from rest_framework.routers import DefaultRouter
from rest_framework import viewsets


urlpatterns = [

    path('', ListaCreatePresidentesView.as_view()), 
    path('<int:pk>/', AtualizarCotaView.as_view()),

    path('ranking/', RankingPresidentesView.as_view()),


]
