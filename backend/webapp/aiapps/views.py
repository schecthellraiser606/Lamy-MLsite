from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
import json

from .myauthentication import MyAuthentication
from .models import Comments, Threads, UserToken, User, Images
from .serializers import CommentsSerializer, PhotoSerializer, ThreadSerializer, UserSerializer
from .ownpermissions import ProfilePermission

# Create your views here.

class Login(APIView):
  def post(self, request, format=None):
    try:
      data = json.loads(request.body)
      uid = data['uid']      
    except:
      return Response({'message': 'Post data injustice'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not User.objects.filter(uid=uid).exists():
      return Response({'message': 'Login failure.'}, status=status.HTTP_403_FORBIDDEN)
    
    user = User.objects.get(uid=uid)
    token = UserToken.create(user)
    
    return JsonResponse({'token': token.token})
    
class UserGetPostViewSet(viewsets.ModelViewSet):
  queryset = User.objects.all()
  serializer_class = UserSerializer
  permission_classes = (ProfilePermission,)
  
class ManageUserView(generics.RetrieveUpdateAPIView):
  
  serializer_class = UserSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated ,)
  
  def get_object(self):
      return self.request.user
  
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
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated,)
  
  def dispatch(self, request, *args, **kwargs):
    try:
      data = json.loads(request.body)
      uid = data['uid']      
    except:
      raise PermissionError('Post data injustice')
    
    obj = self.get_object()
    if obj.uid != uid:
        raise PermissionError('permisson faile')
      
    return super(ManagePhotoViewSet, self).dispatch(request, *args, **kwargs)
  
  
class ThreadGetViewSet(generics.ListAPIView):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  filter_backends = (filters.OrderingFilter)
  ordering_fields = ('updated_at')
  ordering = ('updated_at')
  
class ManageThreadView(viewsets.ModelViewSet):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class CommentGetView(generics.ListAPIView):
  queryset = Comments.objects.order_by('updated_at')
  serializer_class = CommentsSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated,)
  filter_backends = (DjangoFilterBackend,)
  filter_fields = ('threads',)

class ManageCommentViewSet(viewsets.ModelViewSet):
  queryset = Comments.objects.all()
  serializer_class = CommentsSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated,)

