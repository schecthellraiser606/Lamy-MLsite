from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import json

from .myauthentication import MyAuthentication
from .models import Comments, Threads, UserToken, User, Images
from .serializers import CommentsSerializer, PhotoSerializer, ThreadSerializer, UserSerializer
from .ownpermissions import NoDeletePermission, OwnObjectPermission, ProfilePermission

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
  permission_classes = (IsAuthenticated , NoDeletePermission)
  
  def get_object(self):
      return self.request.user
  
class ImageRnakGetViewSet(generics.ListAPIView):
  queryset = Images.objects.select_related('user').filter(is_main=True).order_by('-accurancy', '-updated_image_at').all()
  serializer_class = PhotoSerializer
  filter_backends = (DjangoFilterBackend, filters.SearchFilter,)
  filter_fields = ('class_name',)
  search_fields = ('^updated_image_at',)


class ManagePhotoViewSet(viewsets.ModelViewSet):
  queryset = Images.objects.select_related('user').all()
  serializer_class = PhotoSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated, OwnObjectPermission, NoDeletePermission)
  
  def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        if Images.objects.filter(user=request.user, is_main=True).exists():
          old = Images.objects.get(user=request.user, is_main=True)
          old.is_main = False
          old.save()
        return self.update(request, *args, **kwargs)
  
  
  
class ThreadGetViewSet(generics.ListAPIView):
  queryset = Threads.objects.select_related('user').all()
  serializer_class = ThreadSerializer
  filter_backends = (filters.OrderingFilter,)
  ordering_fields = ('updated_thread_at')
  ordering = ('updated_thread_at')
  
  
class ManageThreadView(viewsets.ModelViewSet):
  queryset = Threads.objects.select_related('user').all()
  serializer_class = ThreadSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated, OwnObjectPermission, NoDeletePermission,)
  
class CommentGetView(generics.ListAPIView):
  queryset = Comments.objects.select_related('user', 'threads').order_by('-updated_comment_at')
  serializer_class = CommentsSerializer
  filter_backends = (DjangoFilterBackend,)
  filter_fields = ('threads',)

class ManageCommentViewSet(viewsets.ModelViewSet):
  queryset = Comments.objects.select_related('user', 'threads').all()
  serializer_class = CommentsSerializer
  authentication_classes = (MyAuthentication,)
  permission_classes = (IsAuthenticated, OwnObjectPermission,)
  filter_backends = (DjangoFilterBackend,)
  filter_fields = ('threads',)

