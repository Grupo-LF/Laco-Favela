from rest_framework.routers import DefaultRouter
from .views import CicloViewSet, RespostaCicloViewSet

router = DefaultRouter()
router.register(r'ciclos', CicloViewSet)
router.register(r'respostas', RespostaCicloViewSet)

urlpatterns = router.urls