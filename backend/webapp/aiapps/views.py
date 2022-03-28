from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, filters, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .tasks import ml_predict
from .models import Comments, Threads, Users, Images
from .serializers import CommentsSerializer, PhotoSerializer, ThreadSerializer, UserSerializer, ImageLearningSerializer
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
    
  serializer = ImageLearningSerializer(data=request.data)
  if not serializer.is_valid():
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  concre = serializer.save()
  
  photo = PhotoLearning(image=concre.image)
  task_id = ml_predict.delay(photo)
  object = TaskResult.objects.filter(task_id=task_id)
  
  
  context = {
    'photo_name': photo.image.name,
    'photo_data': photo.image_src(),
    'predicted': object.result[0],
    'percentage':object.result[1]
  }
  return Response(context)