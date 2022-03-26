from django.urls import path, include
from rest_framework import routers

from .views import ManageCommentViewSet, ManagePhotoViewSet, ManageThreadView, ManageUserView, PhotoGetViewSet, ThreadGetViewSet, UserGetPostViewSet

app_name = 'aiapps'
router = routers.DefaultRouter()
router.register('user', UserGetPostViewSet)
router.register('image', PhotoGetViewSet)
router.register('image_all', ManagePhotoViewSet)
router.register('thread_index', ThreadGetViewSet)
router.register('thread_all', ManageThreadView)
router.register('comment', ManageCommentViewSet)

urlpatterns = [
    path('/update', ManageUserView.as_view(), name='update'),
    path('', include( router.urls )),
]