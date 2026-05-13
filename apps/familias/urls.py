from rest_framework.routers import DefaultRouter
from .views import FamiliaViewSet

router = DefaultRouter()
router.register(r'familias', FamiliaViewSet)

urlpatterns = router.urls