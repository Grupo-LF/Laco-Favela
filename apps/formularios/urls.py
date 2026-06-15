from rest_framework.routers import DefaultRouter
from .views import CicloViewSet, RespostaCicloViewSet, NotificacaoViewSet

router = DefaultRouter()
router.register(r'ciclos', CicloViewSet)
router.register(r'respostas', RespostaCicloViewSet)
router.register(r'notificacoes', NotificacaoViewSet)

urlpatterns = router.urls