from rest_framework import viewsets
from .models import Feedback
from .serializers import FeedbackSerializer

# Create your views here.
class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer