from django.shortcuts import render
from rest_framework import viewsets, generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Comments, Threads, Users, Images
from .serializers import CommentsSerializer, PhotoSerializer, ThreadSerializer, UserSerializer
from .ownpermissions import ProfilePermission

# Create your views here.

class UserGetPostViewSet(viewsets.ModelViewSet):
  queryset = Users.objects.all()
  serializer_class = UserSerializer
  permission_classes = (ProfilePermission,)
  
class ManageUserView(generics.RetrieveUpdateAPIView):
  serializer_class = UserSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class PhotoGetViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = Images.objects.all()
  serializer_class = PhotoSerializer

class ManagePhotoViewSet(viewsets.ModelViewSet):
  queryset = Images.objects.all()
  serializer_class = PhotoSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class ThreadGetViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  
class ManageThreadView(viewsets.ModelViewSet):
  queryset = Threads.objects.all()
  serializer_class = ThreadSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)
  
class ManageCommentViewSet(viewsets.ModelViewSet):
  queryset = Comments.objects.all()
  serializer_class = CommentsSerializer
  authentication_classes = (TokenAuthentication,)
  permission_classes = (IsAuthenticated,)