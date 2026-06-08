from django.urls import path
from .views import RankingPresidentesView

urlpatterns = [
    path('ranking/presidentes/', RankingPresidentesView.as_view(), name='ranking-presidentes'),
]