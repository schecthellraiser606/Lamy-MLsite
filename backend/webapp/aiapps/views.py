from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, filters, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .tasks import ml_predict
from .models import Comments, Threads, Users, Images
from .serializers import CelerySerializer, CommentsSerializer, PhotoSerializer, ThreadSerializer, UserSerializer, ImageLearningSerializer
from .ownpermissions import ProfilePermission

from .predict_model import PhotoLearning
from django_celery_results.models import TaskResult

# Create your views here.

class UserGetPostViewSet(viewsets.ModelViewSet):
  queryset = Users.objects.all()
  serializer_class = UserSerializer
  permission_classes = (ProfilePermission,)
  
class ManageUserView(generics.RetrieveUpdateAPIView):
  serializer_class = UserSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class PhotoGetViewSet(generics.ListAPIView):
  queryset = Images.objects.all()
  serializer_class = PhotoSerializer
  filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
  filter_fields = ('class_name',)
  search_fields = ('^updated_at')
  ordering_fields = ('accurancy', 'updated_at')
  ordering = ('accurancy', 'updated_at')

class ManagePhotoViewSet(viewsets.ModelViewSet):
  queryset = Images.objects.all()
  serializer_class = PhotoSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class ThreadGetViewSet(generics.ListAPIView):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  filter_backends = (filters.OrderingFilter)
  ordering_fields = ('updated_at')
  ordering = ('updated_at')
  
class ManageThreadView(viewsets.ModelViewSet):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class CommentGetView(generics.ListAPIView):
  queryset = Comments.objects.order_by('updated_at')
  serializer_class = CommentsSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  filter_backends = (DjangoFilterBackend,)
  filter_fields = ('threads',)

class ManageCommentViewSet(viewsets.ModelViewSet):
  queryset = Comments.objects.all()
  serializer_class = CommentsSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)

@api_view(['POST'])  
def predict(request):
  if not request.method == 'POST':
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
  serializer_in = ImageLearningSerializer(data=request.data)
  if not serializer_in.is_valid():
    return Response(serializer_in.errors, status=status.HTTP_400_BAD_REQUEST)
  concre_in = serializer_in.save()
  
  task_id = ml_predict.delay(concre_in.image)
  object = TaskResult.objects.filter(task_id=task_id)
  
  serializer_out = CelerySerializer(data=object.result)
  if not serializer_out.is_valid():
    return Response(serializer_out.errors, status=status.HTTP_400_BAD_REQUEST)
  concre_out = serializer_out.save()

  context = {
    'photo_data': serializer_out.photo_data,
    'predicted': serializer_out.predicted,
    'percentage':serializer_out.percentage
  }
  return Response(context)