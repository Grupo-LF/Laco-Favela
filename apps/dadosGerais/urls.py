from django.urls import path
from .views import dadosGeraisONGVIEW

urlpatterns = [
    path('dados-gerais/', dadosGeraisONGVIEW.as_view(), name='dados-gerais'),
]
