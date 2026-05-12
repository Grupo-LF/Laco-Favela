from rest_framework.routers import DefaultRouter
from .views import PresidenteViewSet

router = DefaultRouter()
router.register(r'presidentes', PresidenteViewSet)

urlpatterns = router.urls